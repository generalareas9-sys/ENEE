import {
  channelHandleUrl,
  loadLocalEnv,
  rawPath,
  reviewPath,
  toCsv,
  writeJson,
  writeText,
} from "./youtube/common";
import { parsePlaylistTitle, reviewHeaders } from "./youtube/suggestions";

type ApiError = {
  error?: {
    errors?: Array<{ reason?: string }>;
    message?: string;
  };
};

type YouTubePage<T> = {
  items?: T[];
  nextPageToken?: string;
};

type ChannelItem = {
  id: string;
  snippet: { title: string };
};

type Playlist = {
  id: string;
  snippet: { title: string };
  contentDetails?: { itemCount?: number };
  status?: { privacyStatus?: string };
};

type PlaylistVideoItem = {
  snippet?: {
    title?: string;
    position?: number;
    resourceId?: { videoId?: string };
  };
  contentDetails?: { videoId?: string };
};

type VideoDetails = {
  id: string;
  status?: { embeddable?: boolean };
  contentDetails?: { duration?: string };
};

type CollectedVideo = {
  videoId: string;
  title: string;
  position: number;
  embeddable: boolean;
  duration: string;
};

type CollectedPlaylist = {
  playlistId: string;
  playlistTitle: string;
  videoCount: number;
  allEmbeddable: boolean;
  videos: CollectedVideo[];
};

async function fetchYouTube<T>(endpoint: string, params: Record<string, string>): Promise<T> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    throw new Error("Missing YOUTUBE_API_KEY. Add it to .env.local (server-side only) before collecting playlists.");
  }

  const url = new URL(`https://www.googleapis.com/youtube/v3/${endpoint}`);
  for (const [name, value] of Object.entries(params)) url.searchParams.set(name, value);
  url.searchParams.set("key", apiKey);

  let response: Response;
  try {
    response = await fetch(url, { headers: { Accept: "application/json" } });
  } catch {
    throw new Error("Network error while calling the YouTube Data API. Check your connection and retry.");
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new Error(`YouTube Data API returned an unreadable response (HTTP ${response.status}).`);
  }

  if (!response.ok) {
    const apiError = payload as ApiError;
    const reason = apiError.error?.errors?.[0]?.reason;
    if (reason === "quotaExceeded" || reason === "dailyLimitExceeded" || reason === "rateLimitExceeded") {
      throw new Error("YouTube Data API quota exceeded. Wait for quota reset or check the API quota in Google Cloud Console.");
    }
    if (response.status === 401 || response.status === 403) {
      throw new Error("YouTube Data API authorization failed. Check that YOUTUBE_API_KEY is valid and YouTube Data API v3 is enabled.");
    }
    if (response.status === 429) {
      throw new Error("YouTube Data API rate limit reached. Wait briefly, then retry collection.");
    }
    throw new Error(`YouTube Data API request failed with HTTP ${response.status}${reason ? ` (${reason})` : ""}.`);
  }
  return payload as T;
}

async function listAll<T>(
  endpoint: string,
  params: Record<string, string>,
): Promise<T[]> {
  const results: T[] = [];
  const seenTokens = new Set<string>();
  let pageToken: string | undefined;

  do {
    const page = await fetchYouTube<YouTubePage<T>>(endpoint, {
      ...params,
      ...(pageToken ? { pageToken } : {}),
    });
    results.push(...(page.items ?? []));
    pageToken = page.nextPageToken;
    if (pageToken && seenTokens.has(pageToken)) {
      throw new Error(`YouTube Data API returned a repeated page token while listing ${endpoint}.`);
    }
    if (pageToken) seenTokens.add(pageToken);
  } while (pageToken);

  return results;
}

async function getVideoDetails(ids: string[]): Promise<Map<string, VideoDetails>> {
  const details = new Map<string, VideoDetails>();
  for (let index = 0; index < ids.length; index += 50) {
    const batch = ids.slice(index, index + 50);
    const response = await fetchYouTube<{ items?: VideoDetails[] }>("videos", {
      part: "status,contentDetails",
      id: batch.join(","),
      maxResults: "50",
    });
    for (const item of response.items ?? []) details.set(item.id, item);
  }
  return details;
}

async function collectPlaylist(playlist: Playlist): Promise<CollectedPlaylist> {
  const items = await listAll<PlaylistVideoItem>("playlistItems", {
    part: "snippet,contentDetails",
    playlistId: playlist.id,
    maxResults: "50",
  });
  const usableItems = items
    .map((item) => ({
      videoId: item.contentDetails?.videoId ?? item.snippet?.resourceId?.videoId ?? "",
      title: item.snippet?.title ?? "",
      position: item.snippet?.position ?? 0,
    }))
    .filter((item) =>
      item.videoId &&
      !/^(private|deleted)\s+video$/i.test(item.title.trim()),
    );
  const details = await getVideoDetails(usableItems.map((item) => item.videoId));
  const videos = usableItems.flatMap((item): CollectedVideo[] => {
    const detail = details.get(item.videoId);
    if (!detail) return [];
    return [{
      ...item,
      embeddable: detail.status?.embeddable === true,
      duration: detail.contentDetails?.duration ?? "",
    }];
  });

  return {
    playlistId: playlist.id,
    playlistTitle: playlist.snippet.title,
    videoCount: videos.length,
    allEmbeddable: videos.length > 0 && videos.every((video) => video.embeddable),
    videos,
  };
}

async function main(): Promise<void> {
  loadLocalEnv();
  if (!process.env.YOUTUBE_API_KEY) {
    throw new Error("Missing YOUTUBE_API_KEY. Add it to .env.local (server-side only) before collecting playlists.");
  }

  const channels = await fetchYouTube<YouTubePage<ChannelItem>>("channels", {
    part: "snippet",
    forHandle: "zsecrettraininginstitute",
    maxResults: "1",
  });
  const channel = channels.items?.[0];
  if (!channel) {
    throw new Error("YouTube channel @zsecrettraininginstitute was not found by channels.list.");
  }

  const playlists = await listAll<Playlist>("playlists", {
    part: "snippet,contentDetails,status",
    channelId: channel.id,
    maxResults: "50",
  });
  const publicPlaylists = playlists.filter((playlist) =>
    !playlist.status?.privacyStatus || playlist.status.privacyStatus === "public",
  );
  const collected: CollectedPlaylist[] = [];
  for (const playlist of publicPlaylists) {
    const result = await collectPlaylist(playlist);
    collected.push(result);
    console.log(`Collected playlist ${collected.length}/${playlists.length}: ${result.playlistTitle} (${result.videoCount} public videos)`);
  }

  const raw = {
    channelId: channel.id,
    channelName: channel.snippet.title,
    channelUrl: channelHandleUrl,
    collectedAt: new Date().toISOString(),
    playlists: collected,
  };
  await writeJson(rawPath, raw);

  const rows = collected.map((playlist) => ({
    playlistId: playlist.playlistId,
    playlistTitle: playlist.playlistTitle,
    videoCount: playlist.videoCount,
    allEmbeddable: playlist.allEmbeddable,
    ...parsePlaylistTitle(playlist.playlistTitle),
    status: "needs_review",
  }));
  await writeText(reviewPath, toCsv(reviewHeaders, rows));

  const unparsed = rows.filter((row) =>
    !row.suggestedGrade || !row.suggestedSubject || !row.suggestedStreams ||
    !row.suggestedUnitNumber || !row.suggestedUnitName,
  ).length;
  const nonEmbeddable = collected.filter((playlist) =>
    playlist.videos.some((video) => !video.embeddable),
  ).length;
  console.log("\nYouTube collection complete.");
  console.log(`Channel: ${channel.snippet.title} (${channel.id})`);
  console.log(`Playlists: ${collected.length}`);
  console.log(`Videos: ${collected.reduce((total, playlist) => total + playlist.videoCount, 0)}`);
  console.log(`Playlists with one or more unparsed review fields: ${unparsed}`);
  console.log(`Playlists containing non-embeddable videos: ${nonEmbeddable}`);
  console.log(`Raw data: ${rawPath}`);
  console.log(`Review file: ${reviewPath}`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown collection error.";
  console.error(`YouTube collection failed: ${message}`);
  process.exitCode = 1;
});
