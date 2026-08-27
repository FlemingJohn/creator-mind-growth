import type { Call } from "@/types/call";
import type { Result } from "@/types/result";
import { fail, succeed } from "@/types/result";
import { describeFailure } from "@/lib/errors/describeFailure";
import { readPlainText } from "./keepSafeHtml";
import { readLabelled, readLabelledHtml, readWordChoice } from "./readReply";

export function readCallFromReply(replyText: string, channelId: string): Result<Call> {
  const title = readLabelled(replyText, "TITLE");
  const reason = readLabelledHtml(replyText, "REASON", ["RISK", "UPSIDE"]);

  if (title.length === 0 || reason.length === 0) {
    return fail(describeFailure("mind_reply_unreadable"));
  }

  return succeed({
    callId: `${channelId}-${Date.now().toString(36)}`,
    channelId,
    title: stripQuotes(title),
    reason,
    risk: readWordChoice(replyText, "RISK", ["low", "medium", "high"]),
    upside: readWordChoice(replyText, "UPSIDE", ["high", "medium", "low"]),
    madeOn: new Date().toISOString(),
    outcome: "waiting",
    matchedVideoId: null,
    verdict: null,
    judgedOn: null
  });
}

export function readVerdictFromReply(replyText: string): Result<{ outcome: "hit" | "miss"; lesson: string }> {
  const word = readLabelled(replyText, "VERDICT").toLowerCase();
  const lesson = readLabelledHtml(replyText, "LESSON", []);

  if (word.length === 0) {
    return fail(describeFailure("mind_reply_unreadable"));
  }

  return succeed({
    outcome: word.includes("miss") ? "miss" : "hit",
    lesson: readPlainText(lesson).length > 0 ? lesson : replyText
  });
}

function stripQuotes(text: string): string {
  return text.replace(/^["'“”]+|["'“”]+$/g, "").trim();
}
