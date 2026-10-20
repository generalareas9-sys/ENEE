import { Breadcrumb, BackButton } from "@/components/breadcrumb";
import { EmptyState } from "@/components/empty-state";

export default function ProgressPage() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 md:py-12">
      <BackButton href="/dashboard" />
      <Breadcrumb items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Progress" }]} />
      <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">Watched lessons · TODO</p>
      <h1 className="mt-2 mb-7 font-display text-5xl font-semibold">My progress</h1>
      <EmptyState title="Progress tracking comes in Stage 3" description="Watched videos, subject completion, recent activity, and recommended next lessons are not implemented yet." />
    </section>
  );
}
