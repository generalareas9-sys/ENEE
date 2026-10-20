import { Breadcrumb, BackButton } from "@/components/breadcrumb";
import { EmptyState } from "@/components/empty-state";

export default function LibraryPage() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 md:py-12">
      <BackButton href="/dashboard" />
      <Breadcrumb items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Library" }]} />
      <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">Search & filters · TODO</p>
      <h1 className="mt-2 mb-7 font-display text-5xl font-semibold">Lesson library</h1>
      <EmptyState title="Library search is a TODO" description="Search and filtering are planned for a later stage. Browse lessons from your stream, grade, and subject instead." />
    </section>
  );
}
