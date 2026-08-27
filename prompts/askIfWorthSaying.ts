import type { Ask } from "@/types/ask";

export function askIfWorthSaying(asks: Ask[]): string {
  const lines = asks.map(function toLine(ask) {
    return `- ${ask.topic}: ${ask.askCount} asked this week, ${ask.repeatAskerCount} asked more than once`;
  });

  return [
    "Here is what viewers asked for since we last spoke:",
    ...lines,
    "",
    "Is any of this worth waking the creator up for? You decide.",
    "",
    "Reply in exactly this shape and nothing else:",
    "",
    "WORTH: yes or no",
    "MESSAGE: one short sentence to send them, or leave empty if no"
  ].join("\n");
}
