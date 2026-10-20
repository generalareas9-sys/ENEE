import { ExternalLink } from "lucide-react";
import type { Video } from "@/lib/videos/schema";

export function ChannelCredits({ videos }: { videos: Video[] }) {
  const channels = Array.from(
    new Map(
      videos
        .filter((video) => video.channelName && video.channelUrl)
        .map((video) => [video.channelUrl, { name: video.channelName, url: video.channelUrl }]),
    ).values(),
  );

  return (
    <aside aria-label="YouTube channel credits" className="mt-8 rounded-2xl border border-border bg-card px-5 py-4">
      <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Channel credit</h2>
      {channels.length ? (
        <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
          {channels.map((channel) => (
            <li key={channel.url}>
              <a href={channel.url} target="_blank" rel="noreferrer" className="inline-flex min-h-8 items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                {channel.name} <ExternalLink aria-hidden="true" size={13} />
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">Channel credit pending until a verified source is added.</p>
      )}
    </aside>
  );
}
