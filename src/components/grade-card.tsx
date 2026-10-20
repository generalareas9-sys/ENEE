"use client";

import Link from "next/link";
import { ArrowRight, GraduationCap } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { cardEntrance } from "./page-motion";

export function GradeCard({ stream, grade }: { stream: "natural" | "social"; grade: number }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div variants={cardEntrance} whileHover={reduceMotion ? undefined : { y: -3 }} whileTap={reduceMotion ? undefined : { scale: 0.99 }}>
      <Link href={`/${stream}/${grade}`} className="group block rounded-2xl focus-visible:outline-none">
        <Card className="flex min-h-36 items-center justify-between rounded-2xl border-border bg-card p-6 shadow-sm group-hover:border-primary/40 group-hover:bg-secondary/40">
          <div>
            <span className="mb-3 grid size-10 place-items-center rounded-xl bg-secondary text-primary">
              <GraduationCap aria-hidden="true" size={20} />
            </span>
            <h3 className="font-display text-2xl font-semibold">Grade {grade}</h3>
          </div>
          <ArrowRight aria-hidden="true" className="text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
        </Card>
      </Link>
    </motion.div>
  );
}
