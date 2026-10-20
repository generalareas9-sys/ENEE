"use client";

import { motion, useReducedMotion } from "framer-motion";

export function ProgressBar({
  value,
  label,
  showValue = true,
}: {
  value: number;
  label: string;
  showValue?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const safeValue = Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0;
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
        <span className="font-medium">{label}</span>
        {showValue && <span className="text-muted-foreground">{safeValue}%</span>}
      </div>
      <div
        className="h-2.5 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={safeValue}
      >
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: safeValue / 100 }}
          transition={{ duration: reduceMotion ? 0 : 0.7, ease: "easeOut" }}
          className="h-full w-full origin-left rounded-full bg-primary"
        />
      </div>
    </div>
  );
}

export function ProgressRing({ value, label }: { value: number | null; label: string }) {
  const reduceMotion = useReducedMotion();
  const safeValue = value === null || !Number.isFinite(value) ? 0 : Math.max(0, Math.min(100, value));
  const circumference = 2 * Math.PI * 20;
  return (
    <div className="relative grid size-24 place-items-center" role="img" aria-label={`${label}: ${value === null ? "not available" : `${safeValue}%`}`}>
      <motion.svg
        viewBox="0 0 48 48"
        className="absolute inset-0 size-full -rotate-90"
        aria-hidden="true"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.5, ease: "easeOut" }}
      >
        <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="4" className="text-muted" />
        <circle
          cx="24"
          cy="24"
          r="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - safeValue / 100)}
          className="text-primary"
        />
      </motion.svg>
      <span className="text-xl font-bold">{value === null ? "—" : `${safeValue}%`}</span>
    </div>
  );
}
