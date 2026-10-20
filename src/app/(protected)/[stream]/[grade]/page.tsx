import { notFound } from "next/navigation";
import { Breadcrumb, BackButton } from "@/components/breadcrumb";
import { EmptyState } from "@/components/empty-state";
import { SubjectCard } from "@/components/subject-card";
import { StaggerGrid } from "@/components/page-motion";
import { isKnownStream, parseGrade, subjectsByStream, videos } from "@/lib/videos/catalog";

const streamName = { natural: "Natural Science", social: "Social Science" } as const;

export default async function GradePage({
  params,
}: {
  params: Promise<{ stream: string; grade: string }>;
}) {
  const { stream: streamValue, grade: gradeValue } = await params;
  if (!isKnownStream(streamValue)) notFound();
  const stream = streamValue;
  const grade = parseGrade(gradeValue);
  if (!grade) notFound();

  const subjects = subjectsByStream[stream];
  return (
    <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 md:py-12">
      <BackButton href={`/${stream}`} />
      <Breadcrumb items={[
        { label: "Dashboard", href: "/dashboard" },
        { label: streamName[stream], href: `/${stream}` },
        { label: `Grade ${grade}` },
      ]} />
      <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">{streamName[stream]}</p>
      <h1 className="mt-2 font-display text-5xl font-semibold sm:text-6xl">Grade {grade}</h1>
      <p className="mt-3 leading-7 text-muted-foreground">Choose a subject to browse units and video lessons.</p>
      {subjects.length ? (
        <StaggerGrid>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subject) => {
              const available = videos.some((video) =>
                video.grade === grade &&
                video.subject === subject &&
                video.streams.includes(stream) &&
                video.youtubeId.length > 0 &&
                video.verificationStatus === "verified",
              );
              return <SubjectCard key={subject} stream={stream} grade={grade} subject={subject} available={available} />;
            })}
          </div>
        </StaggerGrid>
      ) : (
        <div className="mt-8"><EmptyState /></div>
      )}
    </section>
  );
}
