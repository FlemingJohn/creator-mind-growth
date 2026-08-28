import type { Complaint, WeakVideo } from "@/types/weakness";

export function askWhatToStop(complaints: Complaint[], weakVideos: WeakVideo[]): string {
  const complaintLines = complaints.map(function toLine(complaint) {
    return (
      "- " +
      complaint.kind +
      ": " +
      complaint.peopleCount +
      " people said this, " +
      complaint.timesSaid +
      " times, mostly on \"" +
      complaint.worstVideoTitle +
      "\""
    );
  });

  const videoLines = weakVideos.map(function toLine(video) {
    return (
      "- \"" +
      video.title +
      "\" got " +
      video.viewCount +
      " views against a usual " +
      video.usualViewCount +
      ", down " +
      video.shortfall +
      " percent"
    );
  });

  return [
    "Here is what viewers complain about on this channel:",
    ...complaintLines,
    "",
    "And these videos landed well below what this creator normally gets:",
    ...videoLines,
    "",
    "What is hurting this channel, and what should they stop doing?",
    "Use what you remember about them. Be direct, do not soften it.",
    "",
    "Reply with three short sentences and nothing else. No headings, no list."
  ].join("\n");
}
