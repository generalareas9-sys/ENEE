export type PlaylistSuggestions = {
  suggestedGrade: string;
  suggestedSubject: string;
  suggestedStreams: string;
  suggestedUnitNumber: string;
  suggestedUnitName: string;
  curriculum: "new" | "old" | "unknown";
  notes: string;
};

export function parsePlaylistTitle(title: string): PlaylistSuggestions {
  const grade = /\bgrade\s*(9|10|11|12)\b/i.exec(title)?.[1] ?? "";
  const unit = /\bunit\s*(\d+)\b(?:\s*[:\-–—]\s*([^|,;]+))?/i.exec(title);
  const subjectPatterns: Array<[RegExp, string]> = [
    [/\b(?:mathematics|maths|math)\b/i, "Mathematics"],
    [/\benglish\b/i, "English"],
    [/\bsat\b/i, "SAT"],
    [/\bphysics\b/i, "Physics"],
    [/\bchemistry\b/i, "Chemistry"],
    [/\bbiology\b/i, "Biology"],
    [/\bgeography\b/i, "Geography"],
    [/\bhistory\b/i, "History"],
    [/\b(?:economics|econ)\b/i, "Economics"],
  ];
  const subject = subjectPatterns.find(([pattern]) => pattern.test(title))?.[1] ?? "";
  const streams = subject
    ? ["Physics", "Chemistry", "Biology"].includes(subject)
      ? "natural"
      : ["Geography", "History", "Economics"].includes(subject)
        ? "social"
        : "natural|social"
    : "";
  const curriculum = /\bnew\s+curriculum\b/i.test(title)
    ? "new"
    : /\bold\s+curriculum\b/i.test(title)
      ? "old"
      : "unknown";

  return {
    suggestedGrade: grade,
    suggestedSubject: subject,
    suggestedStreams: streams,
    suggestedUnitNumber: unit?.[1] ?? "",
    suggestedUnitName: unit?.[2]
      ?.replace(/\s+(?:-|–|—)\s*(?:new|old)\s+curriculum\b.*$/i, "")
      .trim() ?? "",
    curriculum,
    notes: [
      /\bgrade\b/i.test(title) && !grade ? "Grade not parsed from an explicit 'Grade N' phrase." : "",
      !subject ? "Subject not parsed; review manually." : "",
      !unit ? "Unit number not parsed; review manually." : "",
      unit && !unit[2] ? "Unit name not explicit after the unit number." : "",
      curriculum === "unknown" ? "Curriculum not specified; confirm if known." : "",
    ].filter(Boolean).join(" "),
  };
}

export const reviewHeaders = [
  "playlistId",
  "playlistTitle",
  "videoCount",
  "allEmbeddable",
  "suggestedGrade",
  "suggestedSubject",
  "suggestedStreams",
  "suggestedUnitNumber",
  "suggestedUnitName",
  "curriculum",
  "status",
  "notes",
] as const;
