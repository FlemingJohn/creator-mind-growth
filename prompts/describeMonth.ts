import type { Ask } from "@/types/ask";

export function describeMonth(month: string, videoCount: number, commentCount: number, asks: Ask[]): string {
  const lines = asks.map(function toLine(ask) {
    return `- ${ask.topic}: ${ask.askCount} people asked, ${ask.repeatAskerCount} of them asked more than once`;
  });

  return [
    `In ${month} this creator published ${videoCount} videos and ${commentCount} people left comments.`,
    "",
    "Here is what viewers asked for:",
    ...lines,
    "",
    "Remember this. Reply with one short sentence saying what stood out."
  ].join("\n");
}
