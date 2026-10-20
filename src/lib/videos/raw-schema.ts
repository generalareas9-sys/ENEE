import { z } from "zod";

export const rawPlaylistVideoSchema = z.object({
  videoId: z.string().min(1),
  title: z.string(),
  position: z.number().int().nonnegative(),
  embeddable: z.boolean(),
  duration: z.string(),
});

export const rawPlaylistSchema = z.object({
  playlistId: z.string().min(1),
  playlistTitle: z.string(),
  videoCount: z.number().int().nonnegative(),
  allEmbeddable: z.boolean(),
  videos: z.array(rawPlaylistVideoSchema),
});

export const rawYoutubeCatalogSchema = z.object({
  channelId: z.string().min(1),
  channelName: z.string().min(1),
  channelUrl: z.string().url(),
  collectedAt: z.string(),
  playlists: z.array(rawPlaylistSchema),
});

export type RawPlaylist = z.infer<typeof rawPlaylistSchema>;
export type RawPlaylistVideo = z.infer<typeof rawPlaylistVideoSchema>;
