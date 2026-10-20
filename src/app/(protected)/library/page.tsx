import { Breadcrumb, BackButton } from "@/components/breadcrumb";
import { VideoLibrary } from "@/components/video-library";
import { videos } from "@/lib/videos/catalog";

export default function LibraryPage() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 md:py-12">
      <BackButton href="/dashboard" />
      <Breadcrumb items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Library" }]} />
      <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">Search & filters</p>
      <h1 className="mt-2 font-display text-5xl font-semibold">Lesson library</h1>
      <p className="mb-7 mt-3 leading-7 text-muted-foreground">Search the catalog and narrow lessons by grade, stream, subject, and unit. Unverified entries are clearly marked.</p>
      <VideoLibrary videos={videos} />
    </section>
  );
}
