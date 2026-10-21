import { notFound } from "next/navigation";
import { Breadcrumb, BackButton } from "@/components/breadcrumb";
import { ChannelCredits } from "@/components/channel-credits";
import { EmptyState } from "@/components/empty-state";
import { StaggerGrid } from "@/components/page-motion";
import { UnitCard } from "@/components/unit-card";
import {
  isKnownStream,
  parseGrade,
  parseSubjectSlug,
  videosForPath,
} from "@/lib/videos/catalog";

const streamName = { natural: "Natural Science", social: "Social Science" } as const;

export default async function SubjectPage({
  params,
}: {
  params: Promise<{ stream: string; grade: string; subject: string }>;
}) {
  const { stream: streamValue, grade: gradeValue, subject: subjectValue } = await params;
  if (!isKnownStream(streamValue)) notFound();
  const stream = streamValue;
  const grade = parseGrade(gradeValue);
  if (!grade) notFound();
  const subject = parseSubjectSlug(subjectValue, stream);
  if (!subject) notFound();
  const subjectVideos = videosForPath(stream, grade, subject);
  const units = Array.from(
    subjectVideos.reduce((groups, video) => {
      const key = video.courseLabel
        ? `${video.youtubeId}:${video.unitNumber}`
        : `unit:${video.unitNumber}`;
      const existing = groups.get(key) ?? [];
      existing.push(video);
      groups.set(key, existing);
      return groups;
    }, new Map<string, typeof subjectVideos>()),
  ).sort(([, left], [, right]) =>
    left[0].unitNumber - right[0].unitNumber ||
    (left[0].courseLabel ?? "").localeCompare(right[0].courseLabel ?? ""),
  );

  return (
    <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 md:py-12">
      <BackButton href={`/${stream}/${grade}`} />
      <Breadcrumb items={[
        { label: "Dashboard", href: "/dashboard" },
        { label: streamName[stream], href: `/${stream}` },
        { label: `Grade ${grade}`, href: `/${stream}/${grade}` },
        { label: subject },
      ]} />
      <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">Course units</p>
      <h1 className="mt-2 font-display text-5xl font-semibold sm:text-6xl">{subject}</h1>
      <p className="mt-3 leading-7 text-muted-foreground">Grade {grade} · Select a unit to view its video lessons.</p>
      {units.length ? (
        <StaggerGrid>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {units.map(([groupKey, unitVideos]) => {
              const unitNumber = unitVideos[0].unitNumber;
              const sampleOnly = unitVideos.every((video) => !video.youtubeId);
              return (
                <UnitCard
                  key={groupKey}
                  stream={stream}
                  grade={grade}
                  subjectSlug={subjectValue}
                  unitNumber={unitNumber}
                  unitName={unitVideos.find((video) => video.unitName)?.unitName ?? ""}
                  courseLabel={unitVideos[0].courseLabel}
                  courseKey={unitVideos[0].courseLabel ? unitVideos[0].id : undefined}
                  playlistCount={unitVideos.filter((video) => video.youtubeId.length > 0).length}
                  sampleOnly={sampleOnly}
                  needsVerification={unitVideos.some((video) => video.verificationStatus === "needs_verification")}
                />
              );
            })}
          </div>
        </StaggerGrid>
      ) : (
        <div className="mt-8"><EmptyState /></div>
      )}
      <ChannelCredits videos={subjectVideos} />
    </section>
  );
}
