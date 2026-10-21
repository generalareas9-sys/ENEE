export type PlaylistLessonTitle = {
  title: string;
};

export type PlaylistUnitGroup<T extends PlaylistLessonTitle> = {
  unitNumber: number;
  unitName: string;
  lessons: T[];
};

export type PlaylistUnitGrouping<T extends PlaylistLessonTitle> = {
  groups: PlaylistUnitGroup<T>[];
  unassignedLessons: T[];
};

export function parseUnitReference(title: string): { unitNumber: number; unitName: string } | null {
  const match = /\bunit\s*(\d+)\b/i.exec(title);
  if (!match) return null;

  const unitNumber = Number(match[1]);
  if (!Number.isSafeInteger(unitNumber) || unitNumber < 1) return null;

  const remainder = title.slice(match.index + match[0].length).trim();
  const name = remainder
    .replace(/^[:\-–—\s]+/, "")
    .split("|", 1)[0]
    .replace(/^part\s*\d+\s*[:\-–—]?\s*/i, "")
    .replace(/\s+(?:part|lesson)\s*[-:]?\s*\d+\b.*$/i, "")
    .replace(/\s+(?:new|old)\s+curriculum\b.*$/i, "")
    .trim()
    .replace(/[:\-–—]+$/, "")
    .trim();

  return {
    unitNumber,
    unitName: name || `Unit ${unitNumber}`,
  };
}

export function groupPlaylistLessons<T extends PlaylistLessonTitle>(
  lessons: T[],
  playlistTitle: string,
): PlaylistUnitGrouping<T> {
  const byUnit = new Map<number, PlaylistUnitGroup<T>>();
  const unassignedLessons: T[] = [];
  const hasVideoUnitReferences = lessons.some((lesson) => parseUnitReference(lesson.title));
  const playlistUnit = parseUnitReference(playlistTitle);

  if (!hasVideoUnitReferences && !playlistUnit) {
    return {
      groups: [{ unitNumber: 1, unitName: "Full Course", lessons: [...lessons] }],
      unassignedLessons: [],
    };
  }

  for (const lesson of lessons) {
    const reference = parseUnitReference(lesson.title);
    if (!reference) {
      if (!hasVideoUnitReferences && playlistUnit) {
        const group = byUnit.get(playlistUnit.unitNumber) ?? {
          unitNumber: playlistUnit.unitNumber,
          unitName: playlistUnit.unitName,
          lessons: [],
        };
        group.lessons.push(lesson);
        byUnit.set(group.unitNumber, group);
      } else {
        unassignedLessons.push(lesson);
      }
      continue;
    }

    const group = byUnit.get(reference.unitNumber) ?? {
      unitNumber: reference.unitNumber,
      unitName: reference.unitName,
      lessons: [],
    };
    if (group.unitName === `Unit ${reference.unitNumber}` && reference.unitName !== group.unitName) {
      group.unitName = reference.unitName;
    }
    group.lessons.push(lesson);
    byUnit.set(group.unitNumber, group);
  }

  return {
    groups: [...byUnit.values()].sort((left, right) => left.unitNumber - right.unitNumber),
    unassignedLessons,
  };
}
