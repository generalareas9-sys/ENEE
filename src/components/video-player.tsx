"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowUpRight, CircleAlert, CirclePlay, ExternalLink, LockKeyhole } from "lucide-react";
import type { Video } from "@/lib/videos/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "./empty-state";

function youtubeUrl(video: Video): string | null {
  if (!video.youtubeId) return null;
  return video.youtubeType === "playlist"
    ? `https://www.youtube.com/playlist?list=${encodeURIComponent(video.youtubeId)}`
    : `https://www.youtube.com/watch?v=${encodeURIComponent(video.youtubeId)}`;
}

function embedUrl(video: Video, startIndex: number): string | null {
  if (!video.youtubeId || !video.embeddable) return null;
  const base =
    video.youtubeType === "playlist"
      ? `https://www.youtube-nocookie.com/embed/videoseries?list=${encodeURIComponent(video.youtubeId)}&index=${Math.max(0, startIndex)}`
      : `https://www.youtube-nocookie.com/embed/${encodeURIComponent(video.youtubeId)}`;
  return `${base}&autoplay=1&rel=0`;
}

export function VideoPlayer({
  video,
  startIndex = 0,
  title,
  thumbnailVideoId,
}: {
  video: Video;
  startIndex?: number;
  title?: string;
  thumbnailVideoId?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const openUrl = youtubeUrl(video);
  const src = embedUrl(video, startIndex);
  const hasLesson = Boolean(video.youtubeId);

  return (
    <div className="space-y-5">
      {video.verificationStatus === "needs_verification" && (
        <Badge variant="warning"><CircleAlert aria-hidden="true" size={14} /> Needs verification</Badge>
      )}
      {hasLesson ? (
        <div className="overflow-hidden rounded-3xl border border-border bg-[#101815] shadow-[var(--shadow-card)]">
          <div className="relative aspect-video w-full">
            {playing && src && !failed ? (
              <iframe
                src={src}
                title={title || video.title || "YouTube lesson"}
                className="absolute inset-0 size-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                onError={() => setFailed(true)}
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center overflow-hidden bg-[radial-gradient(ellipse_at_top,#315c49,#101815_70%)]">
                {thumbnailVideoId && (
                  <Image
                    src={`https://i.ytimg.com/vi/${encodeURIComponent(thumbnailVideoId)}/hqdefault.jpg`}
                    alt={`Thumbnail for ${video.title || "YouTube lesson"}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 70vw"
                    className="object-cover opacity-70"
                    unoptimized
                  />
                )}
                <div className="absolute inset-0 bg-black/25" />
                <div className="relative flex flex-col items-center gap-4 px-5 text-center text-white">
                  {src && !failed ? (
                    <Button
                      type="button"
                      variant="gold"
                      size="icon"
                      aria-label="Load and play this lesson"
                      onClick={() => setPlaying(true)}
                    >
                      <CirclePlay aria-hidden="true" size={25} />
                    </Button>
                  ) : (
                    <span className="grid size-14 place-items-center rounded-full bg-white/15 text-white">
                      <LockKeyhole aria-hidden="true" size={24} />
                    </span>
                  )}
                  <p className="max-w-md text-sm font-medium">
                    {failed
                      ? "The embedded player could not be loaded. You can open this lesson on YouTube."
                      : src
                        ? "Tap play to load the privacy-enhanced YouTube player."
                        : "Embedding is unavailable for this lesson."}
                  </p>
                </div>
              </div>
            )}
          </div>
          {openUrl && (
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 text-sm sm:px-6">
              <span className="text-white/70">YouTube player · loads only when you press play</span>
              <a
                href={openUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white/10 px-4 font-semibold text-white hover:bg-white/20"
              >
                Open on YouTube <ExternalLink aria-hidden="true" size={15} />
              </a>
            </div>
          )}
        </div>
      ) : (
        <EmptyState
          title="Video lesson coming soon"
          description="This sample has no YouTube link yet. No video is embedded or linked until a real source is provided and verified."
        />
      )}

      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold">{title || video.title || "Video lesson coming soon"}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {video.channelName && video.channelUrl ? (
              <>Credit: <a href={video.channelUrl} target="_blank" rel="noreferrer" className="font-semibold text-primary underline-offset-4 hover:underline">{video.channelName} <ArrowUpRight aria-hidden="true" className="inline" size={13} /></a></>
            ) : (
              "Channel credit pending — no channel has been provided for this sample."
            )}
          </p>
        </div>
        <Button type="button" variant="outline" disabled title="Watched tracking is planned for Stage 3">
          Mark as watched <span className="text-xs font-normal text-muted-foreground">TODO</span>
        </Button>
      </div>
    </div>
  );
}
