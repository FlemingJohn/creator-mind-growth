import type { Ask } from "@/types/ask";
import type { NicheTopic } from "@/types/trend";

export function askForNovelIdea(asks: Ask[], gaps: NicheTopic[]): string {
  const askLines = asks.map(function toAskLine(ask) {
    return "- " + ask.topic + ": " + ask.askCount + " people asked, " + ask.repeatAskerCount + " asked twice";
  });

  const gapLines = gaps.map(function toGapLine(gap) {
    return (
      "- " +
      gap.topic +
      ": " +
      gap.videoCount +
      " videos in the last 30 days, best one got " +
      gap.topViewCount +
      " views, this creator has covered it " +
      gap.coveredByCreator +
      " times"
    );
  });

  return [
    "Your creator's own viewers are asking for these:",
    ...askLines,
    "",
    "Meanwhile these topics are busy across their whole niche right now:",
    ...gapLines,
    "",
    "Give them one video nobody has made yet.",
    "Take a topic the niche is busy with and bend it towards what you remember about this creator.",
    "Use what you know about which of their videos have worked before.",
    "",
    "Reply in exactly this shape and nothing else:",
    "",
    "TITLE: the video title you suggest",
    "REASON: two short sentences, saying what you remembered that made you pick it",
    "RISK: one word, low or medium or high",
    "UPSIDE: one word, low or medium or high"
  ].join("\n");
}
