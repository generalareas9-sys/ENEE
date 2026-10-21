"use client";

import Link from "next/link";
import { ArrowRight, CirclePlay } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { unitSlug } from "@/lib/videos/routes";
import { cardEntrance } from "./page-motion";

export function UnitCard({
  stream,
  grade,
  subjectSlug,
  unitNumber,
  unitName,
  courseLabel,
  courseKey,
  playlistCount,
  sampleOnly,
  needsVerification,
}: {
  stream: "natural" | "social";
  grade: number;
  subjectSlug: string;
  unitNumber: number;
  unitName: string;
  courseLabel?: "Course A" | "Course B";
  courseKey?: string;
  playlistCount: number;
  sampleOnly: boolean;
  needsVerification: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const unitHref = `/${stream}/${grade}/${subjectSlug}/${unitSlug(unitNumber)}${courseKey ? `?course=${encodeURIComponent(courseKey)}` : ""}`;
  return (
    <motion.div variants={cardEntrance} whileHover={reduceMotion ? undefined : { y: -3 }} whileTap={reduceMotion ? undefined : { scale: 0.99 }}>
      <Link href={unitHref} className="group block rounded-2xl focus-visible:outline-none">
        <Card className="flex min-h-32 items-center justify-between rounded-2xl border-border bg-card p-5 shadow-sm group-hover:border-primary/40">
          <div className="flex items-center gap-4">
            <span className="grid size-11 place-items-center rounded-xl bg-accent text-accent-foreground">
              <CirclePlay aria-hidden="true" size={20} />
            </span>
            <div>
              {courseLabel && <p className="text-sm font-bold text-primary">{courseLabel}</p>}
              <h3 className="font-display text-2xl font-semibold">
                {unitName || (sampleOnly ? "Unit details pending" : `Unit ${unitNumber}`)}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {sampleOnly
                  ? "SAMPLE entry · no real lesson provided"
                  : `${playlistCount} ${playlistCount === 1 ? "playlist" : "playlists"}`}
              </p>
              {needsVerification && <Badge variant="warning" className="mt-2">Needs verification</Badge>}
            </div>
          </div>
          <ArrowRight aria-hidden="true" className="text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
        </Card>
      </Link>
    </motion.div>
  );
}
