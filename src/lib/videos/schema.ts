import { z } from "zod";

export const streamSchema = z.enum(["natural", "social"]);

export const subjectSchema = z.enum([
  "English",
  "Mathematics",
  "SAT",
  "Physics",
  "Chemistry",
  "Biology",
  "Geography",
  "History",
  "Economics",
]);
export const curriculumSchema = z.enum(["new", "old", "unknown"]);

const naturalOnlySubjects = ["Physics", "Chemistry", "Biology"] as const;
const socialOnlySubjects = ["Geography", "History", "Economics"] as const;

export const videoSchema = z
  .object({
    id: z.string().min(1),
    title: z.string(),
    grade: z.number().int().min(9).max(12),
    streams: z.array(streamSchema).min(1).refine((streams) => new Set(streams).size === streams.length),
    subject: subjectSchema,
    unitNumber: z.number().int().positive(),
    unitName: z.string(),
    lessonNumber: z.number().int().positive(),
    youtubeType: z.enum(["video", "playlist"]),
    youtubeId: z.string(),
    channelName: z.string(),
    channelUrl: z.string().refine((value) => value === "" || z.url().safeParse(value).success),
    curriculum: curriculumSchema,
    language: z.string(),
    embeddable: z.boolean(),
    verificationStatus: z.enum(["needs_verification", "verified"]),
  })
  .strict()
  .superRefine((video, context) => {
    const streams = new Set(video.streams);
    if (
      naturalOnlySubjects.includes(video.subject as (typeof naturalOnlySubjects)[number]) &&
      (streams.size !== 1 || !streams.has("natural"))
    ) {
      context.addIssue({
        code: "custom",
        path: ["streams"],
        message: `${video.subject} can only be listed in the natural stream.`,
      });
    }
    if (
      socialOnlySubjects.includes(video.subject as (typeof socialOnlySubjects)[number]) &&
      (streams.size !== 1 || !streams.has("social"))
    ) {
      context.addIssue({
        code: "custom",
        path: ["streams"],
        message: `${video.subject} can only be listed in the social stream.`,
      });
    }
    if (video.youtubeId && video.youtubeType === "video" && !/^[\w-]{11}$/.test(video.youtubeId)) {
      context.addIssue({
        code: "custom",
        path: ["youtubeId"],
        message: "YouTube video IDs must be exactly 11 URL-safe characters.",
      });
    }
    if (video.youtubeId && video.youtubeType === "playlist" && !/^[\w-]+$/.test(video.youtubeId)) {
      context.addIssue({
        code: "custom",
        path: ["youtubeId"],
        message: "YouTube playlist IDs must be URL-safe characters.",
      });
    }
    if (video.channelUrl) {
      const parsedUrl = z.url().safeParse(video.channelUrl);
      if (parsedUrl.success) {
        const hostname = new URL(video.channelUrl).hostname.toLowerCase();
        if (hostname !== "youtube.com" && !hostname.endsWith(".youtube.com")) {
          context.addIssue({
            code: "custom",
            path: ["channelUrl"],
            message: "Channel credits must link to YouTube.",
          });
        }
      }
    }
    if (video.embeddable && !video.youtubeId) {
      context.addIssue({
        code: "custom",
        path: ["embeddable"],
        message: "A lesson without a YouTube ID cannot be embeddable.",
      });
    }
    if (video.verificationStatus === "verified" && (!video.youtubeId || !video.channelName || !video.channelUrl)) {
      context.addIssue({
        code: "custom",
        path: ["verificationStatus"],
        message: "Verified lessons must include a YouTube ID and channel credit.",
      });
    }
  });

export const videoCatalogSchema = z.array(videoSchema).superRefine((catalog, context) => {
  const seen = new Set<string>();
  catalog.forEach((video, index) => {
    if (seen.has(video.id)) {
      context.addIssue({
        code: "custom",
        path: [index, "id"],
        message: `Duplicate video catalog id: ${video.id}`,
      });
    }
    seen.add(video.id);
  });
});
export type Video = z.infer<typeof videoSchema>;
export type Stream = z.infer<typeof streamSchema>;
export type Subject = z.infer<typeof subjectSchema>;
