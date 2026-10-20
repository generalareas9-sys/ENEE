import { BookOpenCheck } from "lucide-react";

export function EmptyState({
  title = "Videos coming soon",
  description = "We’re preparing this part of the course. Check back when lessons are ready.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center rounded-[2rem] border border-dashed border-border bg-card px-7 py-12 text-center">
      <span className="mb-5 grid size-16 place-items-center rounded-3xl bg-secondary text-primary">
        <BookOpenCheck aria-hidden="true" size={28} />
      </span>
      <h2 className="font-display text-3xl font-semibold">{title}</h2>
      <p className="mt-3 max-w-md leading-7 text-muted-foreground">{description}</p>
    </section>
  );
}
