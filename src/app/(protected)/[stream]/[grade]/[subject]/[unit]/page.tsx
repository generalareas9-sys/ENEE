import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Breadcrumb, BackButton } from "@/components/breadcrumb";
import { EmptyState } from "@/components/empty-state";
import { LessonList, type LessonLink } from "@/components/lesson-list";
import { VideoPlayer } from "@/components/video-player";
import { Button } from "@/components/ui/button";
import {
  isKnownStream,
  parseGrade,
  parseSubjectSlug,
  parseUnitSlug,
  videosForPath,
} from "@/lib/videos/catalog";

const streamName = { natural: "Natural Science", social: "Social Science" } as const;

export default async function UnitPage({
  params,
  searchParams,
}: {
  params: Promise<{ stream: string; grade: string; subject: string; unit: string }>;
  searchParams: Promise<{ lesson?: string }>;
}) {
  const [
    { stream: streamValue, grade: gradeValue, subject: subjectValue, unit: unitValue },
    query,
  ] = await Promise.all([params, searchParams]);
  if (!isKnownStream(streamValue)) notFound();
  const stream = streamValue;
  const grade = parseGrade(gradeValue);
  if (!grade) notFound();
  const subject = parseSubjectSlug(subjectValue, stream);
  if (!subject) notFound();
  const unitNumber = parseUnitSlug(unitValue);
  if (!unitNumber) notFound();

  const subjectVideos = videosForPath(stream, grade, subject);
  const unitVideos = subjectVideos
    .filter((video) => video.unitNumber === unitNumber)
    .sort((a, b) => a.lessonNumber - b.lessonNumber);
  if (!unitVideos.length) {
    return (
      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 md:py-12">
        <BackButton href={`/${stream}/${grade}/${subjectValue}`} />
        <Breadcrumb items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: streamName[stream], href: `/${stream}` },
          { label: `Grade ${grade}`, href: `/${stream}/${grade}` },
          { label: subject, href: `/${stream}/${grade}/${subjectValue}` },
          { label: `Unit ${unitNumber}` },
        ]} />
        <EmptyState />
      </section>
    );
  }

  const selectedIndex = unitVideos.findIndex((video) => video.id === query.lesson);
  const currentIndex = selectedIndex >= 0 ? selectedIndex : 0;
  const currentVideo = unitVideos[currentIndex];
  const sampleOnly = unitVideos.every((video) => !video.youtubeId);
  const unitName = unitVideos.find((video) => video.unitName)?.unitName;
  const unitLabel = unitName || (sampleOnly ? "Unit details pending" : `Unit ${unitNumber}`);
  const unitHref = `/${stream}/${grade}/${subjectValue}/${unitValue}`;
  const lessonLinks: LessonLink[] = unitVideos.map((video, index) => ({
    id: video.id,
    title: video.title || "Video lesson coming soon",
    href: `${unitHref}?lesson=${encodeURIComponent(video.id)}`,
    lessonNumber: video.lessonNumber,
    active: index === currentIndex,
    needsVerification: video.verificationStatus === "needs_verification",
  }));
  const previous = unitVideos[currentIndex - 1];
  const next = unitVideos[currentIndex + 1];

  return (
    <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 md:py-12">
      <BackButton href={`/${stream}/${grade}/${subjectValue}`} label="Back to units" />
      <Breadcrumb items={[
        { label: "Dashboard", href: "/dashboard" },
        { label: streamName[stream], href: `/${stream}` },
        { label: `Grade ${grade}`, href: `/${stream}/${grade}` },
        { label: subject, href: `/${stream}/${grade}/${subjectValue}` },
        { label: unitLabel },
      ]} />
      <div className="mb-7">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">{subject} · Grade {grade}</p>
        <h1 className="mt-2 font-display text-4xl font-semibold sm:text-5xl">{unitLabel}</h1>
      </div>
      <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,.62fr)]">
        <div className="space-y-6">
          <VideoPlayer video={currentVideo} />
          <div className="flex flex-col justify-between gap-3 border-t border-border pt-5 sm:flex-row">
            {previous ? (
              <Button asChild variant="outline">
                <Link href={`${unitHref}?lesson=${encodeURIComponent(previous.id)}`}><ArrowLeft aria-hidden="true" /> Previous lesson</Link>
              </Button>
            ) : <span />}
            {next ? (
              <Button asChild>
                <Link href={`${unitHref}?lesson=${encodeURIComponent(next.id)}`}>Next lesson <ArrowRight aria-hidden="true" /></Link>
              </Button>
            ) : <span />}
          </div>
        </div>
        <LessonList lessons={lessonLinks} />
      </div>
    </section>
  );
}
