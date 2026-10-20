"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

export type Crumb = { label: string; href?: string };

export function Breadcrumb({ items }: { items: Crumb[] }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.nav
      aria-label="Breadcrumb"
      initial={reduceMotion ? false : { opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.2 }}
      className="mb-7 flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
    >
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="inline-flex items-center gap-2">
          {index > 0 && <ChevronRight aria-hidden="true" size={14} />}
          {item.href && index < items.length - 1 ? (
            <Link href={item.href} className="rounded-sm hover:text-primary hover:underline hover:underline-offset-4">
              {item.label}
            </Link>
          ) : (
            <span aria-current={index === items.length - 1 ? "page" : undefined} className={index === items.length - 1 ? "font-semibold text-foreground" : ""}>
              {item.label}
            </span>
          )}
        </span>
      ))}
    </motion.nav>
  );
}

export function BackButton({ href, label = "Back" }: { href: string; label?: string }) {
  return (
    <Link href={href} className="mb-5 inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground">
      <span aria-hidden="true" className="mr-2 text-lg leading-none">←</span>
      {label}
    </Link>
  );
}
