import { readFile } from "node:fs/promises";
import { videoCatalogSchema, type Video } from "../src/lib/videos/schema";
import { videosPath } from "./youtube/common";

async function main(): Promise<void> {
  const content = await readFile(videosPath, "utf8");
  let input: unknown;
  try {
    input = JSON.parse(content);
  } catch {
    throw new Error("content/videos.json is not valid JSON.");
  }

  const parsed = videoCatalogSchema.safeParse(input);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((issue) =>
      `${issue.path.join(".") || "entry"}: ${issue.message}`,
    );
    throw new Error(`content/videos.json failed Zod validation:\n- ${issues.join("\n- ")}`);
  }

  const videos = parsed.data;
  const countBy = (key: (video: Video) => string) => {
    const counts = new Map<string, number>();
    for (const video of videos) {
      const value = key(video);
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
    return [...counts.entries()].sort(([left], [right]) =>
      left.localeCompare(right, undefined, { numeric: true }),
    );
  };

  console.log(`Video catalog report (${videos.length} entries)\n`);
  console.log("By grade:");
  for (const [grade, count] of countBy((video) => `Grade ${video.grade}`)) console.log(`  ${grade}: ${count}`);
  console.log("\nBy subject:");
  for (const [subject, count] of countBy((video) => video.subject)) console.log(`  ${subject}: ${count}`);
  console.log("\nBy unit (grade / subject / unit):");
  for (const [unit, count] of countBy((video) =>
    `Grade ${video.grade} / ${video.subject} / Unit ${video.unitNumber}${video.unitName ? ` — ${video.unitName}` : ""}`,
  )) {
    console.log(`  ${unit}: ${count}`);
  }

  const unverified = videos.filter((video) => video.verificationStatus !== "verified");
  const nonEmbeddable = videos.filter((video) => !video.embeddable);
  const missing = videos.filter((video) =>
    !video.title.trim() ||
    !video.unitName.trim() ||
    !video.youtubeId.trim() ||
    !video.channelName.trim() ||
    !video.channelUrl.trim() ||
    video.curriculum === "unknown" ||
    !video.language.trim(),
  );
  console.log(`\nUnverified: ${unverified.length}`);
  for (const video of unverified) {
    console.log(`  ${video.id} — ${video.title || "(missing title)"}`);
  }
  console.log(`\nNon-embeddable: ${nonEmbeddable.length}`);
  for (const video of nonEmbeddable) {
    console.log(`  ${video.id} — ${video.title || "(missing title)"}`);
  }
  console.log(`\nMissing metadata: ${missing.length}`);
  for (const video of missing) {
    const fields = [
      !video.title.trim() && "title",
      !video.unitName.trim() && "unitName",
      !video.youtubeId.trim() && "youtubeId",
      !video.channelName.trim() && "channelName",
      !video.channelUrl.trim() && "channelUrl",
      video.curriculum === "unknown" && "curriculum",
      !video.language.trim() && "language",
    ].filter((field): field is string => Boolean(field));
    console.log(`  ${video.id}: ${fields.join(", ")}`);
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown report error.";
  console.error(`Video report failed: ${message}`);
  process.exitCode = 1;
});
