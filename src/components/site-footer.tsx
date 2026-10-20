import Link from "next/link";
import { site } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card/70">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>{site.fullName}</p>
        <div className="flex items-center gap-5">
          <Link href="/about" className="underline-offset-4 hover:text-foreground hover:underline">About</Link>
          <span>Video lessons hosted by their original YouTube channels.</span>
        </div>
      </div>
    </footer>
  );
}
