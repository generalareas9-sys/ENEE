import { describe, expect, it } from "vitest";
import { parseCsv, toCsv } from "../../../scripts/youtube/common";
import { parsePlaylistTitle } from "../../../scripts/youtube/suggestions";
import { groupPlaylistLessons } from "./playlist-units";
import { videoSchema } from "./schema";

describe("YouTube import helpers", () => {
  it("suggests only title-backed playlist metadata and derives allowed streams", () => {
    expect(parsePlaylistTitle("Grade 12 Maths Unit 3 New curriculum")).toMatchObject({
      suggestedGrade: "12",
      suggestedSubject: "Mathematics",
      suggestedStreams: "natural|social",
      suggestedUnitNumber: "3",
      suggestedUnitName: "",
      curriculum: "new",
    });
    expect(parsePlaylistTitle("Econ sessions")).toMatchObject({
      suggestedGrade: "",
      suggestedSubject: "Economics",
      suggestedStreams: "social",
      suggestedUnitNumber: "",
      suggestedUnitName: "",
      curriculum: "unknown",
    });
    expect(parsePlaylistTitle("Grade 10 Biology Unit 2")).toMatchObject({
      suggestedStreams: "natural",
      suggestedUnitName: "",
    });
  });

  it("round-trips quoted fields, commas, and line breaks in the review CSV", () => {
    const headers = ["playlistTitle", "notes"];
    const source = [{ playlistTitle: 'Grade 11, "Maths"', notes: "Line one\nLine two" }];
    expect(parseCsv(toCsv(headers, source))).toEqual([
      headers,
      ['Grade 11, "Maths"', "Line one\nLine two"],
    ]);
  });

  it("groups playlist lessons only when their titles state a unit", () => {
    const grouping = groupPlaylistLessons(
      [
        { title: "Grade 12 Physics Unit 1: Mechanics Part 1", position: 0 },
        { title: "Grade 12 Physics Unit 1: Mechanics Part 2", position: 1 },
        { title: "Grade 12 Physics Unit 2 Waves Part 1", position: 2 },
        { title: "Additional video without a unit", position: 3 },
      ],
      "Grade 12 Physics",
    );

    expect(grouping.groups.map(({ unitNumber, unitName, lessons }) => ({
      unitNumber,
      unitName,
      positions: lessons.map((lesson) => lesson.position),
    }))).toEqual([
      { unitNumber: 1, unitName: "Mechanics", positions: [0, 1] },
      { unitNumber: 2, unitName: "Waves", positions: [2] },
    ]);
    expect(grouping.unassignedLessons).toEqual([
      { title: "Additional video without a unit", position: 3 },
    ]);
  });

  it("uses one Full Course unit when no title provides unit information", () => {
    expect(groupPlaylistLessons(
      [{ title: "Course lesson 1" }, { title: "Course lesson 2" }],
      "Grade 12 Physics",
    )).toEqual({
      groups: [{
        unitNumber: 1,
        unitName: "Full Course",
        lessons: [{ title: "Course lesson 1" }, { title: "Course lesson 2" }],
      }],
      unassignedLessons: [],
    });
  });

  it("rejects subject and stream combinations that violate the course rules", () => {
    const base = {
      id: "test-physics-stream-rule",
      title: "",
      grade: 12,
      streams: ["social"],
      subject: "Physics",
      unitNumber: 1,
      unitName: "",
      lessonNumber: 1,
      youtubeType: "playlist",
      youtubeId: "",
      channelName: "",
      channelUrl: "",
      curriculum: "unknown",
      language: "",
      embeddable: false,
      verificationStatus: "needs_verification",
    };
    expect(videoSchema.safeParse(base).success).toBe(false);
  });
});
