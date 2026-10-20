"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect } from "react";

export function ThemeToggle() {
  useEffect(() => {
    const saved = window.localStorage.getItem("enee-theme");
    const shouldUseDark =
      saved === "dark" ||
      (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", shouldUseDark);
  }, []);

  function toggleTheme() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem("enee-theme", next ? "dark" : "light");
  }

  return (
    <button
      type="button"
      aria-label="Toggle color theme"
      onClick={toggleTheme}
      className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-card text-foreground hover:bg-muted"
    >
      <Moon aria-hidden="true" className="dark:hidden" size={18} />
      <Sun aria-hidden="true" className="hidden dark:block" size={18} />
    </button>
  );
}
