import Link from "next/link";
import { CheckCircle2, CirclePlay } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type LessonLink = {
  id: string;
  title: string;
  href: string;
  lessonNumber: number;
  active: boolean;
  needsVerification: boolean;
};

export function LessonList({ lessons }: { lessons: LessonLink[] }) {
  return (
    <section aria-labelledby="lesson-list-heading" className="rounded-3xl border border-border bg-card p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 id="lesson-list-heading" className="font-display text-2xl font-semibold">Lessons in this unit</h2>
        <span className="text-sm text-muted-foreground">{lessons.length} listed</span>
      </div>
      <ol className="space-y-2">
        {lessons.map((lesson) => (
          <li key={lesson.id}>
            <Link
              href={lesson.href}
              aria-current={lesson.active ? "page" : undefined}
              className={`flex min-h-14 items-center gap-3 rounded-xl px-3 py-2 ${
                lesson.active
                  ? "bg-secondary text-secondary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              {lesson.active ? (
                <CheckCircle2 aria-hidden="true" className="shrink-0 text-primary" size={19} />
              ) : (
                <CirclePlay aria-hidden="true" className="shrink-0 text-muted-foreground" size={19} />
              )}
              <span className="min-w-0 flex-1 truncate text-sm font-medium">
                Lesson {lesson.lessonNumber}: {lesson.title}
              </span>
              {lesson.needsVerification && <Badge variant="warning" className="hidden sm:inline-flex">Needs verification</Badge>}
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
