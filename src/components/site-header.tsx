import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/config/site";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { SignOutButton } from "./sign-out-button";

export function Brand() {
  return (
    <Link href="/" aria-label={`${site.shortName} home`} className="group inline-flex items-center gap-3">
      <span className="grid size-11 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:rotate-[-4deg]">
        <span className="font-display text-2xl font-bold leading-none">E</span>
      </span>
      <span className="text-lg font-extrabold tracking-tight">{site.shortName}</span>
    </Link>
  );
}

export function SiteHeader({ protectedArea = false }: { protectedArea?: boolean }) {
  return (
    <header className="relative z-20 border-b border-border/80 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Brand />
        <nav aria-label="Main navigation" className="flex items-center gap-2 sm:gap-3">
          {protectedArea ? (
            <>
              <Link className="hidden rounded-full px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground sm:inline-flex" href="/dashboard">
                My courses
              </Link>
              <Link className="hidden rounded-full px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground sm:inline-flex" href="/library">
                Library <span className="ml-1 text-[10px] uppercase tracking-wide">TODO</span>
              </Link>
              <Link className="hidden rounded-full px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground sm:inline-flex" href="/progress">
                Progress <span className="ml-1 text-[10px] uppercase tracking-wide">TODO</span>
              </Link>
              <Link href="/dashboard#streams" className="rounded-full px-3 py-2 text-xs font-semibold text-primary sm:text-sm">
                <span className="sm:hidden">Streams</span>
                <span className="hidden sm:inline">Change stream</span>
              </Link>
            </>
          ) : (
            <Link className="hidden rounded-full px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground sm:inline-flex" href="/about">
              About
            </Link>
          )}
          <ThemeToggle />
          {protectedArea ? (
            <SignOutButton />
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register" className="gap-1">
                  Get started <ArrowUpRight aria-hidden="true" size={16} />
                </Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
