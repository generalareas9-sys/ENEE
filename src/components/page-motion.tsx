"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export function PageMotion({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.main
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.28, ease: "easeOut" }}
      className="flex-1"
    >
      {children}
    </motion.main>
  );
}

export function StaggerGrid({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.07 } },
      }}
      className="grid gap-5"
    >
      {children}
    </motion.div>
  );
}

export const cardEntrance = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
};
