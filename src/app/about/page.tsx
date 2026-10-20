import { CirclePlay, ExternalLink, ShieldCheck } from "lucide-react";
import { PageMotion } from "@/components/page-motion";
import { BackButton, Breadcrumb } from "@/components/breadcrumb";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { EmptyState } from "@/components/empty-state";
import { videos } from "@/lib/videos/catalog";

export default function AboutPage() {
  const credits = Array.from(new Map([
    ["https://www.youtube.com/@zsecrettraininginstitute", {
      name: "@zsecrettraininginstitute",
      url: "https://www.youtube.com/@zsecrettraininginstitute",
    }],
    ...videos
      .filter((video) => video.channelName && video.channelUrl)
      .map((video) => [video.channelUrl, { name: video.channelName, url: video.channelUrl }] as const),
  ]).values());

  return (
    <>
      <SiteHeader />
      <PageMotion>
        <section className="mx-auto max-w-4xl px-5 py-14 sm:px-8 md:py-20">
          <BackButton href="/" label="Back to home" />
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "About" }]} />
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">About ENEE</p>
          <h1 className="mt-3 font-display text-5xl font-semibold sm:text-6xl">A focused place to prepare.</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            ENEE organizes video lessons for Ethiopian students preparing for the national university entrance exam in Grades 9–12. Students browse by stream, grade, subject, and unit, then watch lessons through YouTube’s official player.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <article className="rounded-3xl border border-border bg-card p-6">
              <CirclePlay aria-hidden="true" className="text-primary" size={25} />
              <h2 className="mt-4 font-display text-2xl font-semibold">Videos remain on YouTube</h2>
              <p className="mt-2 leading-7 text-muted-foreground">ENEE embeds lessons using YouTube’s privacy-enhanced player. It does not download or re-upload videos.</p>
            </article>
            <article className="rounded-3xl border border-border bg-card p-6">
              <ShieldCheck aria-hidden="true" className="text-primary" size={25} />
              <h2 className="mt-4 font-display text-2xl font-semibold">Clear, honest catalog</h2>
              <p className="mt-2 leading-7 text-muted-foreground">Collected playlists are review-only until approved. Unverified entries are clearly marked, and original channel credits are shown throughout the course.</p>
            </article>
          </div>
          <section className="mt-12" aria-labelledby="credits-heading">
            <h2 id="credits-heading" className="font-display text-3xl font-semibold">YouTube channel credits</h2>
            <p className="mt-2 leading-7 text-muted-foreground">Every channel used in the catalog is credited here.</p>
            {credits.length ? (
              <ul className="mt-5 space-y-3">
                {credits.map((credit) => (
                  <li key={credit.url} className="rounded-2xl border border-border bg-card px-5 py-4">
                    <a href={credit.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-semibold text-primary hover:underline">
                      {credit.name} <ExternalLink aria-hidden="true" size={15} />
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-5">
                <EmptyState
                  title="No channels in the sample catalog"
                  description="No real YouTube channels are used yet. Channel names and links will be credited here when verified videos are added."
                />
              </div>
            )}
          </section>
        </section>
      </PageMotion>
      <SiteFooter />
    </>
  );
}
