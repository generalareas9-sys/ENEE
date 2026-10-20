"use client";

import Link from "next/link";
import { ArrowUpRight, Atom, Compass } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Card } from "@/components/ui/card";

const streamDetails = {
  natural: {
    title: "Natural Science",
    description: "Explore the sciences and build confidence one lesson at a time.",
    icon: Atom,
    className: "bg-[#e8f2eb] text-[#155d46] dark:bg-[#233c30] dark:text-[#b8e2c7]",
    subjects: "Physics · Chemistry · Biology",
  },
  social: {
    title: "Social Science",
    description: "Connect ideas across people, places, history, and the economy.",
    icon: Compass,
    className: "bg-[#f7f0df] text-[#785c17] dark:bg-[#40351e] dark:text-[#efd88d]",
    subjects: "Geography · History · Economics",
  },
} as const;

export function StreamCard({ stream }: { stream: "natural" | "social" }) {
  const details = streamDetails[stream];
  const Icon = details.icon;
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
      whileHover={reduceMotion ? undefined : { y: -4 }}
      whileTap={reduceMotion ? undefined : { scale: 0.99 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Link href={`/${stream}`} className="group block h-full rounded-[1.5rem] focus-visible:outline-none">
        <Card className="relative flex h-full min-h-64 overflow-hidden rounded-[1.5rem] border-border bg-card p-6 shadow-[var(--shadow-card)] group-hover:border-primary/30 group-hover:shadow-lg sm:p-8">
          <div aria-hidden="true" className="absolute -right-10 -top-12 size-44 rounded-full border-[22px] border-primary/5" />
          <div className={`mb-8 grid size-14 place-items-center rounded-2xl ${details.className}`}>
            <Icon aria-hidden="true" size={26} />
          </div>
          <div className="mt-auto flex items-end justify-between gap-4">
            <div>
              <h3 className="font-display text-3xl font-semibold">{details.title}</h3>
              <p className="mt-2 max-w-sm leading-6 text-muted-foreground">{details.description}</p>
              <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-primary/80">Grades 9–12 · {details.subjects}</p>
            </div>
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition-transform group-hover:translate-x-1">
              <ArrowUpRight aria-hidden="true" size={19} />
            </span>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
