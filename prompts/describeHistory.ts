import type { Ask } from "@/types/ask";
import type { Channel } from "@/types/channel";

export interface MonthSummary {
  month: string;
  videoCount: number;
  commentCount: number;
  asks: Ask[];
}

export function describeHistory(channel: Channel, months: MonthSummary[]): string {
  const lines: string[] = [
    "You look after one YouTube creator and you remember them between visits.",
    "",
    "The channel is " + channel.title + ".",
    "They have " + channel.subscriberCount + " subscribers and " + channel.videoCount + " videos.",
    "",
    "Here is what their viewers have asked for, month by month."
  ];

  for (const month of months) {
    lines.push("");
    lines.push(month.month + ": " + month.videoCount + " videos, " + month.commentCount + " comments");
    for (const ask of month.asks) {
      lines.push(
        "- " + ask.topic + ": " + ask.askCount + " people asked, " + ask.repeatAskerCount + " asked more than once"
      );
    }
  }

  lines.push("");
  lines.push("Remember all of this. Reply with two short sentences saying what stands out.");

  return lines.join("\n");
}
