import Link from "next/link";
import { ArrowDown, ArrowRight, BookOpenCheck, Check, CirclePlay, GraduationCap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StreamCard } from "@/components/stream-card";
import { PageMotion, StaggerGrid } from "@/components/page-motion";
import { site } from "@/config/site";

const steps = [
  { number: "01", title: "Choose your stream", text: "Start with Natural Science or Social Science." },
  { number: "02", title: "Find your grade & subject", text: "Follow a clear path from Grade 9 to Grade 12." },
  { number: "03", title: "Learn with video", text: "Watch lessons from their original YouTube channels." },
];

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <PageMotion>
        <section className="relative isolate overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -right-40 -top-52 size-[37rem] rounded-full bg-[#e4eee5] opacity-70 blur-[2px] dark:bg-[#1b3628]" />
            <div className="soft-grid absolute right-[8%] top-20 size-64 rounded-full opacity-50" />
            <div className="absolute bottom-[-5rem] left-[42%] size-48 rounded-full border border-gold/40" />
          </div>
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-14 sm:px-8 md:grid-cols-[1.08fr_.92fr] md:pb-28 md:pt-24">
            <div>
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-card/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">
                <span className="size-2 rounded-full bg-gold" /> Your exam preparation, organized
              </p>
              <h1 className="max-w-3xl font-display text-6xl font-semibold leading-[0.94] tracking-tight sm:text-7xl lg:text-[5.5rem]">
                Prepare with <span className="text-primary">purpose.</span>
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-muted-foreground sm:text-xl">
                {site.fullName} brings video lessons together in one clear learning path for Ethiopian students in Grades 9–12.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="default" className="min-h-14">
                  <Link href="/register">Start learning <ArrowRight aria-hidden="true" size={18} /></Link>
                </Button>
                <Button asChild variant="outline" className="min-h-14">
                  <Link href="/about">How ENEE works <ArrowDown aria-hidden="true" size={16} /></Link>
                </Button>
              </div>
              <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-muted-foreground">
                <span className="inline-flex items-center gap-2"><Check aria-hidden="true" size={16} className="text-primary" /> Grades 9–12</span>
                <span className="inline-flex items-center gap-2"><Check aria-hidden="true" size={16} className="text-primary" /> Two clear study streams</span>
                <span className="inline-flex items-center gap-2"><Check aria-hidden="true" size={16} className="text-primary" /> Original YouTube embeds</span>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-[34rem]">
              <div aria-hidden="true" className="absolute inset-5 rotate-[-5deg] rounded-[2.5rem] border border-gold/40" />
              <div className="relative overflow-hidden rounded-[2.25rem] bg-[#174d3c] p-6 text-white shadow-2xl sm:p-9">
                <div aria-hidden="true" className="absolute -right-16 -top-20 size-64 rounded-full border-[35px] border-white/5" />
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white/65">A learning path that makes sense</p>
                    <p className="mt-2 font-display text-3xl font-semibold">One step at a time</p>
                  </div>
                  <span className="grid size-12 place-items-center rounded-2xl bg-gold text-[#18231f]">
                    <GraduationCap aria-hidden="true" size={24} />
                  </span>
                </div>
                <div className="relative mt-8 space-y-3">
                  {["Choose a stream", "Select your grade", "Find a subject", "Watch a lesson"].map((step, index) => (
                    <div key={step} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.07] p-4">
                      <span className="grid size-9 place-items-center rounded-xl bg-white/10 text-sm font-bold text-[#efd68c]">0{index + 1}</span>
                      <span className="flex-1 font-semibold">{step}</span>
                      {index === 3 && <CirclePlay aria-hidden="true" size={19} className="text-[#efd68c]" />}
                    </div>
                  ))}
                </div>
                <p className="relative mt-6 inline-flex items-center gap-2 text-sm text-white/65">
                  <ShieldCheck aria-hidden="true" size={16} /> Lessons stay on YouTube
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-24">
          <div className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Choose a learning path</p>
              <h2 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">Two streams. Your next step.</h2>
            </div>
            <p className="max-w-md leading-7 text-muted-foreground">Shared subjects like English, Mathematics, and SAT are available from either stream.</p>
          </div>
          <StaggerGrid>
            <div className="grid gap-5 md:grid-cols-2">
              <StreamCard stream="natural" />
              <StreamCard stream="social" />
            </div>
          </StaggerGrid>
        </section>

        <section className="border-y border-border bg-card/60 py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Simple by design</p>
              <h2 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">How it works</h2>
              <p className="mt-4 leading-7 text-muted-foreground">A focused video-course experience, organized around your school journey.</p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {steps.map((step) => (
                <article key={step.number} className="rounded-3xl border border-border bg-background p-6 sm:p-7">
                  <span className="text-sm font-bold tracking-widest text-gold">{step.number}</span>
                  <h3 className="mt-6 font-display text-2xl font-semibold">{step.title}</h3>
                  <p className="mt-2 leading-7 text-muted-foreground">{step.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-24">
          <div className="flex flex-col items-start justify-between gap-6 rounded-[2rem] bg-[#f2ead3] p-7 dark:bg-[#302a1d] sm:flex-row sm:items-center sm:p-10">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 text-sm font-bold text-[#74580e] dark:text-[#efd68c]">
                <BookOpenCheck aria-hidden="true" size={18} /> Start at your own pace
              </span>
              <h2 className="mt-3 font-display text-4xl font-semibold">Make your next study session count.</h2>
              <p className="mt-3 max-w-xl leading-7 text-muted-foreground">Create an account to explore the organized course path. The current catalog contains clearly marked sample placeholders only.</p>
            </div>
            <Button asChild variant="gold" className="shrink-0">
              <Link href="/register">Create your account <ArrowRight aria-hidden="true" size={17} /></Link>
            </Button>
          </div>
        </section>
      </PageMotion>
      <SiteFooter />
    </>
  );
}
