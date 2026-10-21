import { readFile } from "node:fs/promises";
import {
  channelHandleUrl,
  parseCsv,
  rawPath,
  reviewPath,
  videosPath,
  writeJson,
} from "./youtube/common";
import {
  curriculumSchema,
  videoCatalogSchema,
  streamSchema,
  subjectSchema,
  type Stream,
  type Video,
} from "../src/lib/videos/schema";
import { rawYoutubeCatalogSchema } from "../src/lib/videos/raw-schema";
import { groupPlaylistLessons } from "../src/lib/videos/playlist-units";

const requiredHeaders = [
  "playlistId",
  "playlistTitle",
  "videoCount",
  "allEmbeddable",
  "suggestedGrade",
  "suggestedSubject",
  "suggestedStreams",
  "suggestedUnitNumber",
  "suggestedUnitName",
  "curriculum",
  "courseLabel",
  "status",
  "notes",
];

function parseInteger(value: string): number | null {
  if (!/^\d+$/.test(value.trim())) return null;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) ? parsed : null;
}

function parseStreams(value: string): Stream[] | null {
  const parts = value.split("|").map((part) => part.trim()).filter(Boolean);
  if (!parts.length) return null;
  const parsed = parts.map((part) => streamSchema.safeParse(part));
  if (parsed.some((result) => !result.success)) return null;
  const streams = parsed.flatMap((result) => result.success ? [result.data] : []);
  if (streams.length !== parsed.length) return null;
  return new Set(streams).size === streams.length ? streams : null;
}

async function readRequiredText(
  path: string,
  missingMessage = "Run npm run collect:youtube first.",
): Promise<string> {
  try {
    return await readFile(path, "utf8");
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT") {
      throw new Error(`Required file not found: ${path}. ${missingMessage}`);
    }
    throw error;
  }
}

function formatValidationIssues(error: { issues: Array<{ path: PropertyKey[]; message: string }> }): string {
  return error.issues
    .map((issue) => `${issue.path.join(".") || "entry"}: ${issue.message}`)
    .join("; ");
}

async function main(): Promise<void> {
  const csvText = (await readRequiredText(reviewPath)).replace(/^\uFEFF/, "");
  const parsedRows = parseCsv(csvText);
  if (!parsedRows.length) throw new Error("Review CSV is empty. Run npm run collect:youtube first.");

  const headers = parsedRows[0].map((header) => header.trim());
  const missingHeaders = requiredHeaders.filter((header) => !headers.includes(header));
  if (missingHeaders.length) {
    throw new Error(`Review CSV is missing required columns: ${missingHeaders.join(", ")}.`);
  }
  const duplicateHeaders = headers.filter((header, index) => headers.indexOf(header) !== index);
  if (duplicateHeaders.length) {
    throw new Error(`Review CSV has duplicate columns: ${[...new Set(duplicateHeaders)].join(", ")}.`);
  }

  const approved: Array<{ rowNumber: number; fields: Record<string, string> }> = [];
  for (const [index, cells] of parsedRows.slice(1).entries()) {
    const rowNumber = index + 2;
    if (cells.every((cell) => !cell.trim())) continue;
    if (cells.length !== headers.length) {
      throw new Error(`CSV row ${rowNumber}: expected ${headers.length} fields, received ${cells.length}.`);
    }
    const fields = Object.fromEntries(headers.map((header, cellIndex) => [header, cells[cellIndex].trim()]));
    if (fields.status.toLowerCase() === "approved") approved.push({ rowNumber, fields });
  }

  if (!approved.length) {
    console.log('No review rows have status "approved"; content/videos.json was not changed.');
    return;
  }

  let raw: ReturnType<typeof rawYoutubeCatalogSchema.parse>;
  try {
    const rawResult = rawYoutubeCatalogSchema.safeParse(
      JSON.parse(await readRequiredText(rawPath)),
    );
    if (!rawResult.success) {
      throw new Error(`Raw YouTube import failed validation: ${rawResult.error.message}`);
    }
    raw = rawResult.data;
  } catch (error) {
    if (error instanceof SyntaxError) throw new Error("Raw YouTube import JSON is invalid. Run npm run collect:youtube again.");
    throw error;
  }
  if (!raw.channelName || raw.channelUrl !== channelHandleUrl || !Array.isArray(raw.playlists)) {
    throw new Error("Raw YouTube import is missing the expected channel metadata or playlists. Run npm run collect:youtube again.");
  }
  const rawPlaylists = new Map(raw.playlists.map((playlist) => [playlist.playlistId, playlist]));

  let existing: Video[];
  try {
    const parsed = videoCatalogSchema.safeParse(
      JSON.parse(await readRequiredText(videosPath, "Restore or create the catalog before importing.")),
    );
    if (!parsed.success) throw new Error(`Existing content/videos.json is invalid: ${formatValidationIssues(parsed.error)}.`);
    existing = parsed.data;
  } catch (error) {
    if (error instanceof SyntaxError) throw new Error("Existing content/videos.json is not valid JSON; fix it before importing.");
    throw error;
  }

  const errors: string[] = [];
  const pending: Video[] = [];
  let preservedCount = 0;
  const existingById = new Map(existing.map((video) => [video.id, video]));

  for (const { rowNumber, fields } of approved) {
    const playlistId = fields.playlistId;
    const rawPlaylist = rawPlaylists.get(playlistId);
    if (!playlistId || !rawPlaylist) {
      errors.push(`CSV row ${rowNumber}: playlistId "${playlistId || "(empty)"}" is not present in raw-youtube.json.`);
      continue;
    }

    const issues: string[] = [];
    const grade = parseInteger(fields.suggestedGrade);
    if (grade === null || grade < 9 || grade > 12) issues.push("suggestedGrade must be 9, 10, 11, or 12.");
    const subjectResult = subjectSchema.safeParse(fields.suggestedSubject);
    if (!subjectResult.success) issues.push("suggestedSubject must be one of the allowed subjects.");
    const streams = parseStreams(fields.suggestedStreams);
    if (!streams) issues.push('suggestedStreams must contain natural and/or social separated with "|".');
    const unitNumber = parseInteger(fields.suggestedUnitNumber);
    if (!unitNumber || unitNumber < 1) issues.push("suggestedUnitNumber must be a positive integer.");
    const curriculumResult = curriculumSchema.safeParse(fields.curriculum);
    if (!curriculumResult.success) issues.push('curriculum must be "new", "old", or "unknown".');
    const courseLabel = fields.courseLabel
      ? fields.courseLabel === "Course A" || fields.courseLabel === "Course B"
        ? fields.courseLabel
        : null
      : undefined;
    if (courseLabel === null) issues.push('courseLabel must be empty, "Course A", or "Course B".');
    if (!rawPlaylist.playlistTitle) issues.push("Raw playlist title is missing.");
    if (!rawPlaylist.videoCount || !rawPlaylist.videos.length) issues.push("Playlist has no accessible public videos.");

    if (issues.length) {
      errors.push(`CSV row ${rowNumber}: ${issues.join(" ")}`);
      continue;
    }
    if (
      grade === null ||
      !subjectResult.success ||
      !streams ||
      unitNumber === null ||
      !curriculumResult.success
    ) {
      continue;
    }

    const grouping = groupPlaylistLessons(rawPlaylist.videos, rawPlaylist.playlistTitle);
    if (!grouping.groups.length) {
      errors.push(`CSV row ${rowNumber}: no unit groups could be derived from playlist titles.`);
      continue;
    }
    const idsForPlaylist = new Set<string>();
    for (const group of grouping.groups) {
      const id = grouping.groups.length === 1
        ? `youtube-playlist-${playlistId}`
        : `youtube-playlist-${playlistId}-unit-${group.unitNumber}`;
      if (idsForPlaylist.has(id)) {
        errors.push(`CSV row ${rowNumber}: duplicate derived unit ${group.unitNumber} for playlist "${playlistId}".`);
        continue;
      }
      idsForPlaylist.add(id);

      const priorImport = existingById.get(id);
      if (priorImport) {
        if (priorImport.youtubeType !== "playlist" || priorImport.youtubeId !== playlistId) {
          errors.push(`CSV row ${rowNumber}: catalog id "${id}" already belongs to a different entry.`);
        } else {
          preservedCount += 1;
        }
        continue;
      }
      const alreadyPresent = [...existing, ...pending].some(
        (video) =>
          video.youtubeType === "playlist" &&
          video.youtubeId === playlistId &&
          video.grade === grade &&
          video.subject === subjectResult.data &&
          video.unitNumber === group.unitNumber &&
          video.courseLabel === courseLabel,
      );
      if (alreadyPresent) {
        preservedCount += 1;
        continue;
      }

      const titleEvidence = [rawPlaylist.playlistTitle, ...group.lessons.map((lesson) => lesson.title)];
      const hasNewCurriculum = titleEvidence.some((title) => /\bnew\s+curriculum\b/i.test(title));
      const hasOldCurriculum = titleEvidence.some((title) => /\bold\s+curriculum\b/i.test(title));
      const curriculum = hasNewCurriculum && !hasOldCurriculum
        ? "new"
        : hasOldCurriculum && !hasNewCurriculum
          ? "old"
          : "unknown";
      const entry: Video = {
        id,
        title: rawPlaylist.playlistTitle,
        ...(courseLabel ? { courseLabel } : {}),
        grade,
        streams,
        subject: subjectResult.data,
        unitNumber: group.unitNumber,
        unitName: group.unitName || fields.suggestedUnitName,
        lessonNumber: 1,
        youtubeType: "playlist",
        youtubeId: playlistId,
        channelName: raw.channelName,
        channelUrl: raw.channelUrl,
        curriculum,
        language: "",
        embeddable: group.lessons.some((lesson) => lesson.embeddable),
        verificationStatus: "needs_verification",
      };
      const validation = videoCatalogSchema.safeParse([...existing, ...pending, entry]);
      if (!validation.success) {
        errors.push(`CSV row ${rowNumber}: ${formatValidationIssues(validation.error)}.`);
        continue;
      }
      const validatedEntry = validation.data.at(-1);
      if (!validatedEntry) throw new Error(`CSV row ${rowNumber}: catalog validation produced no entry.`);
      pending.push(validatedEntry);
      idsForPlaylist.add(id);
    }
  }

  if (errors.length) {
    console.error("Reviewed import rejected. No catalog changes were written:");
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
    return;
  }

  const merged = videoCatalogSchema.safeParse([...existing, ...pending]);
  if (!merged.success) {
    throw new Error(`Final video catalog validation failed: ${formatValidationIssues(merged.error)}.`);
  }
  await writeJson(videosPath, merged.data);
  const importedPlaylistCount = new Set(pending.map((video) => video.youtubeId)).size;
  console.log(`Imported ${pending.length} course unit entr${pending.length === 1 ? "y" : "ies"} across ${importedPlaylistCount} playlist${importedPlaylistCount === 1 ? "" : "s"} into content/videos.json.`);
  console.log(`${preservedCount} existing course unit entr${preservedCount === 1 ? "y was" : "ies were"} preserved without overwriting existing entries.`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown import error.";
  console.error(`Reviewed import failed: ${message}`);
  process.exitCode = 1;
});
