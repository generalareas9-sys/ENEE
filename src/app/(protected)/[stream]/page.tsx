import { notFound } from "next/navigation";
import { Breadcrumb, BackButton } from "@/components/breadcrumb";
import { GradeCard } from "@/components/grade-card";
import { StaggerGrid } from "@/components/page-motion";
import { isKnownStream } from "@/lib/videos/catalog";

const streamName = {
  natural: "Natural Science",
  social: "Social Science",
} as const;

export default async function StreamPage({
  params,
}: {
  params: Promise<{ stream: string }>;
}) {
  const { stream: value } = await params;
  if (!isKnownStream(value)) notFound();
  const stream = value;

  return (
    <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 md:py-12">
      <BackButton href="/dashboard" />
      <Breadcrumb items={[
        { label: "Dashboard", href: "/dashboard" },
        { label: streamName[stream] },
      ]} />
      <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">Choose your grade</p>
      <h1 className="mt-2 font-display text-5xl font-semibold sm:text-6xl">{streamName[stream]}</h1>
      <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">Select your current grade to see the matching subjects.</p>
      <StaggerGrid>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[9, 10, 11, 12].map((grade) => <GradeCard key={grade} stream={stream} grade={grade} />)}
        </div>
      </StaggerGrid>
    </section>
  );
}
