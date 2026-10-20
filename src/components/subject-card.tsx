"use client";

import Link from "next/link";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Subject } from "@/lib/videos/schema";
import { slugifySubject } from "@/lib/videos/routes";
import { cardEntrance } from "./page-motion";

export function SubjectCard({
  stream,
  grade,
  subject,
  available,
  needsVerification,
}: {
  stream: "natural" | "social";
  grade: number;
  subject: Subject;
  available: boolean;
  needsVerification: boolean;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div variants={cardEntrance} whileHover={reduceMotion ? undefined : { y: -3 }} whileTap={reduceMotion ? undefined : { scale: 0.99 }}>
      <Link href={`/${stream}/${grade}/${slugifySubject(subject)}`} className="group block rounded-2xl focus-visible:outline-none">
        <Card className="flex min-h-32 items-center justify-between rounded-2xl border-border bg-card p-5 shadow-sm group-hover:border-primary/40">
          <div className="flex items-center gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
              <BookOpen aria-hidden="true" size={19} />
            </span>
            <div>
              <h3 className="text-lg font-bold">{subject}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {available ? needsVerification ? "Lessons need review" : "Lessons available" : "Videos coming soon"}
              </p>
              {needsVerification && <Badge variant="warning" className="mt-2 text-[10px]">Needs verification</Badge>}
            </div>
          </div>
          <ArrowUpRight aria-hidden="true" className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" size={19} />
        </Card>
      </Link>
    </motion.div>
  );
}
