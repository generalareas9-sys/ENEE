import rawVideos from "../../../content/videos.json";
import { videoCatalogSchema, type Stream, type Subject, type Video } from "./schema";
import { slugifySubject, unitSlug } from "./routes";

const result = videoCatalogSchema.safeParse(rawVideos);
if (!result.success) {
  throw new Error(`Invalid content/videos.json: ${result.error.message}`);
}

export const videos: Video[] = result.data;

export const subjectsByStream: Record<Stream, Subject[]> = {
  natural: ["English", "Mathematics", "SAT", "Physics", "Chemistry", "Biology"],
  social: ["English", "Mathematics", "SAT", "Geography", "History", "Economics"],
};

export function videosForPath(stream: Stream, grade: number, subject: Subject): Video[] {
  return videos.filter(
    (video) =>
      video.grade === grade &&
      video.subject === subject &&
      video.streams.includes(stream),
  );
}

export function isKnownStream(value: string): value is Stream {
  return value === "natural" || value === "social";
}

export function parseGrade(value: string): number | null {
  const grade = Number(value);
  return Number.isInteger(grade) && grade >= 9 && grade <= 12 ? grade : null;
}

export function parseSubjectSlug(value: string, stream: Stream): Subject | null {
  return subjectsByStream[stream].find((subject) => slugifySubject(subject) === value) ?? null;
}

export function parseUnitSlug(value: string): number | null {
  const match = /^unit-(\d+)$/.exec(value);
  if (!match) return null;
  const number = Number(match[1]);
  return Number.isSafeInteger(number) && number > 0 ? number : null;
}

export { slugifySubject, unitSlug };
