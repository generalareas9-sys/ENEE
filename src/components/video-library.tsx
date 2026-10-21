"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, CirclePlay, Search, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subjectsByStream } from "@/lib/videos/catalog";
import { slugifySubject, unitSlug } from "@/lib/videos/routes";
import type { Stream, Subject, Video } from "@/lib/videos/schema";

const filterClassName =
  "h-12 w-full rounded-xl border border-input bg-card px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30";

export function VideoLibrary({ videos }: { videos: Video[] }) {
  const [search, setSearch] = useState("");
  const [grade, setGrade] = useState("");
  const [stream, setStream] = useState("");
  const [subject, setSubject] = useState("");
  const [unit, setUnit] = useState("");

  const availableSubjects = useMemo(() => {
    if (stream === "natural" || stream === "social") return subjectsByStream[stream];
    return [...new Set([...subjectsByStream.natural, ...subjectsByStream.social])];
  }, [stream]);

  const availableUnits = useMemo(
    () =>
      [...new Map(
        videos
          .filter((video) =>
            (!grade || video.grade === Number(grade)) &&
            (!stream || video.streams.includes(stream as Stream)) &&
            (!subject || video.subject === subject),
          )
          .map((video) => [video.unitNumber, video.unitName]),
      ).entries()].sort(([left], [right]) => left - right),
    [grade, stream, subject, videos],
  );

  const results = useMemo(() => {
    const term = search.trim().toLocaleLowerCase();
    return videos.filter((video) => {
      const matchesSearch =
        !term ||
        [video.title, video.subject, video.unitName, video.channelName]
          .some((value) => value.toLocaleLowerCase().includes(term));
      return matchesSearch &&
        (!grade || video.grade === Number(grade)) &&
        (!stream || video.streams.includes(stream as Stream)) &&
        (!subject || video.subject === subject) &&
        (!unit || video.unitNumber === Number(unit));
    });
  }, [grade, search, stream, subject, unit, videos]);

  function updateStream(value: string) {
    setStream(value);
    if (subject && value && !subjectsByStream[value as Stream].includes(subject as Subject)) {
      setSubject("");
    }
  }

  function clearFilters() {
    setSearch("");
    setGrade("");
    setStream("");
    setSubject("");
    setUnit("");
  }

  return (
    <div>
      <section aria-label="Search and filter lessons" className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="sm:col-span-2 lg:col-span-2">
            <label htmlFor="library-search" className="mb-2 block text-sm font-semibold">Search lessons</label>
            <div className="relative">
              <Search aria-hidden="true" size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="library-search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search a title, subject, or channel"
                className="pl-11"
              />
            </div>
          </div>
          <div>
            <label htmlFor="library-grade" className="mb-2 block text-sm font-semibold">Grade</label>
            <select id="library-grade" value={grade} onChange={(event) => setGrade(event.target.value)} className={filterClassName}>
              <option value="">All grades</option>
              {[9, 10, 11, 12].map((item) => <option key={item} value={item}>Grade {item}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="library-stream" className="mb-2 block text-sm font-semibold">Stream</label>
            <select id="library-stream" value={stream} onChange={(event) => updateStream(event.target.value)} className={filterClassName}>
              <option value="">All streams</option>
              <option value="natural">Natural Science</option>
              <option value="social">Social Science</option>
            </select>
          </div>
          <div>
            <label htmlFor="library-subject" className="mb-2 block text-sm font-semibold">Subject</label>
            <select id="library-subject" value={subject} onChange={(event) => setSubject(event.target.value)} className={filterClassName}>
              <option value="">All subjects</option>
              {availableSubjects.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="library-unit" className="mb-2 block text-sm font-semibold">Unit</label>
            <select id="library-unit" value={unit} onChange={(event) => setUnit(event.target.value)} className={filterClassName}>
              <option value="">All units</option>
              {availableUnits.map(([number, name]) => (
                <option key={number} value={number}>Unit {number}{name ? ` · ${name}` : ""}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <p role="status" aria-live="polite" className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <SlidersHorizontal aria-hidden="true" size={15} /> {results.length} {results.length === 1 ? "lesson" : "lessons"} found
          </p>
          <Button variant="outline" size="sm" type="button" onClick={clearFilters}>Clear filters</Button>
        </div>
      </section>

      {results.length ? (
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          {results.map((video) => {
            const preferredStream = video.streams[0] as Stream;
            const courseQuery = video.courseLabel ? `?course=${encodeURIComponent(video.id)}` : "";
            const href = `/${preferredStream}/${video.grade}/${slugifySubject(video.subject)}/${unitSlug(video.unitNumber)}${courseQuery}`;
            return (
              <li key={video.id} className="rounded-3xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-start gap-4">
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-secondary text-primary">
                    <CirclePlay aria-hidden="true" size={23} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap gap-2">
                      {video.verificationStatus === "needs_verification"
                        ? <Badge variant="warning">Needs verification</Badge>
                        : <Badge variant="success">Verified</Badge>}
                      {!video.embeddable && video.youtubeId && <Badge variant="outline">Open on YouTube</Badge>}
                    </div>
                    <h2 className="mt-3 break-words font-display text-2xl font-semibold">
                      {video.courseLabel ? `${video.courseLabel} — ` : ""}
                      {video.title || "Video lesson coming soon"}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      Grade {video.grade} · {video.streams.join(" & ")} · {video.subject} · Unit {video.unitNumber}{video.unitName ? `: ${video.unitName}` : ""}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Credit: {video.channelName && video.channelUrl
                        ? <a href={video.channelUrl} target="_blank" rel="noreferrer" className="font-semibold text-primary hover:underline">{video.channelName}</a>
                        : "channel credit pending"}
                    </p>
                    <Link href={href} className="mt-4 inline-flex min-h-11 items-center gap-2 font-semibold text-primary hover:underline">
                      View unit <ArrowUpRight aria-hidden="true" size={16} />
                    </Link>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-6 rounded-2xl border border-dashed border-border bg-card px-6 py-10 text-center leading-7 text-muted-foreground">
          No lessons match those filters. Try clearing a filter or choose a different search.
        </p>
      )}
    </div>
  );
}
