import type { Ask } from "@/types/ask";

export function askForNextCall(asks: Ask[]): string {
  const lines = asks.map(function toLine(ask) {
    return "- " + ask.topic + ": " + ask.askCount + " people asked, " + ask.repeatAskerCount + " asked more than once";
  });

  return [
    "Here is what this creator's viewers are asking for right now:",
    ...lines,
    "",
    "Pick one video they should make next.",
    "Use everything you remember about this channel as well as these counts.",
    "Say why in plain words a person would understand.",
    "",
    "Reply in exactly this shape and nothing else:",
    "",
    "TITLE: the video title you suggest",
    "REASON: two short sentences saying why, using the counts",
    "RISK: one word, low or medium or high",
    "UPSIDE: one word, low or medium or high"
  ].join("\n");
}
