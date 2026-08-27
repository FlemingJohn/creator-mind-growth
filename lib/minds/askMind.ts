import type { MindReply } from "@/types/mind";
import type { Result } from "@/types/result";
import { fail, succeed } from "@/types/result";
import { describeFailure } from "@/lib/errors/describeFailure";
import { readPlainText } from "./keepSafeHtml";
import type { MindsClient } from "./connectToMinds";

const waitLimitInMs = 280000;

export async function askMind(
  client: MindsClient,
  alias: string,
  question: string
): Promise<Result<MindReply>> {
  let markBefore = "";

  try {
    markBefore = (await client.getLatestHistoryFingerprint(alias)) ?? "";
  } catch {
    markBefore = "";
  }

  try {
    await client.sendMessage({ alias, messageText: question });
  } catch {
    return fail(describeFailure("mind_unavailable"));
  }

  try {
    const outcome = await client.waitForReply({
      alias,
      timeoutMs: waitLimitInMs,
      afterFingerprint: markBefore.length > 0 ? markBefore : undefined,
      sentMessageText: question
    });

    if (outcome.timedOut) {
      return fail(describeFailure("mind_took_too_long"));
    }

    const text = outcome.reply?.messageText ?? "";
    if (readPlainText(text).length === 0) {
      return fail(describeFailure("mind_reply_unreadable"));
    }

    return succeed({ text: text.trim(), arrivedAt: new Date().toISOString() });
  } catch {
    return fail(describeFailure("mind_unavailable"));
  }
}

export async function tellMind(
  client: MindsClient,
  alias: string,
  statement: string
): Promise<Result<true>> {
  try {
    await client.sendMessage({ alias, messageText: statement });
    return succeed(true);
  } catch {
    return fail(describeFailure("mind_unavailable"));
  }
}
