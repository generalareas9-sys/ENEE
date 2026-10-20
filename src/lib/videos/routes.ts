import type { Subject } from "./schema";

export function slugifySubject(subject: Subject): string {
  return subject.toLowerCase().replaceAll(" ", "-");
}

export function unitSlug(unitNumber: number): string {
  return `unit-${unitNumber}`;
}
