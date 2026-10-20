import Link from "next/link";
import { ArrowRight, Bookmark, CirclePlay, Sparkles } from "lucide-react";
import { Breadcrumb, BackButton } from "@/components/breadcrumb";
import { ProgressRing } from "@/components/progress-bar";
import { StreamCard } from "@/components/stream-card";
import { StaggerGrid } from "@/components/page-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 md:py-12">
      <BackButton href="/" label="Back to home" />
      <Breadcrumb items={[{ label: "Dashboard" }]} />
      <div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">Your learning space</p>
          <h1 className="mt-2 font-display text-5xl font-semibold sm:text-6xl">Welcome to ENEE</h1>
          <p className="mt-3 max-w-xl leading-7 text-muted-foreground">Choose a stream to find lessons for your grade and subject.</p>
        </div>
        <Link href="/library" className="inline-flex min-h-12 items-center gap-2 self-start rounded-full border border-border bg-card px-5 font-semibold hover:bg-muted sm:self-auto">
          <Bookmark aria-hidden="true" size={17} /> Browse library <span className="text-xs text-muted-foreground">TODO</span>
        </Link>
      </div>

      <section id="streams" aria-labelledby="streams-heading">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 id="streams-heading" className="font-display text-3xl font-semibold sm:text-4xl">Choose your stream</h2>
          <span className="hidden text-sm text-muted-foreground sm:inline">You can change this any time.</span>
        </div>
        <StaggerGrid>
          <div className="grid gap-5 md:grid-cols-2">
            <StreamCard stream="natural" />
            <StreamCard stream="social" />
          </div>
        </StaggerGrid>
      </section>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.25fr_.75fr]">
        <Card className="overflow-hidden rounded-3xl border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-xs font-bold text-secondary-foreground">
                <Sparkles aria-hidden="true" size={14} /> CONTINUE LEARNING
              </span>
              <h2 className="mt-4 font-display text-3xl font-semibold">Continue where you left off</h2>
              <p className="mt-2 leading-7 text-muted-foreground">Saved course-path persistence is a TODO. Choose a stream to begin exploring lessons.</p>
              <Button asChild className="mt-5">
                <Link href="/natural">Choose a stream <ArrowRight aria-hidden="true" size={17} /></Link>
              </Button>
            </div>
            <span className="grid size-20 shrink-0 place-items-center rounded-3xl bg-accent text-accent-foreground">
              <CirclePlay aria-hidden="true" size={32} />
            </span>
          </div>
        </Card>
        <Card className="flex items-center gap-5 rounded-3xl border-border bg-card p-6 shadow-sm">
          <ProgressRing value={null} label="Progress tracking TODO" />
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">Progress summary · TODO</p>
            <h2 className="mt-1 text-lg font-bold">Tracking comes later</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">Watched lessons and subject completion are planned for Stage 3.</p>
          </div>
        </Card>
      </div>
    </section>
  );
}
