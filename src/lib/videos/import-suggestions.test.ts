import { describe, expect, it } from "vitest";
import { parseCsv, toCsv } from "../../../scripts/youtube/common";
import { parsePlaylistTitle } from "../../../scripts/youtube/suggestions";
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
