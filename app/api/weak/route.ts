import type { NextRequest } from "next/server";
import { connectToMinds } from "@/lib/minds/connectToMinds";
import { askMind } from "@/lib/minds/askMind";
import { askAzure, canAskAzure } from "@/lib/azure/askAzure";
import { keepInlineHtml, readPlainText } from "@/lib/minds/keepSafeHtml";
import { looksLikeRefusal } from "@/lib/minds/readReply";
import { askWhatToStop } from "@/prompts/askWhatToStop";
import { readChannelRecord } from "@/lib/store/readChannelRecord";
import { saveWeakSpots } from "@/lib/store/saveWeakSpots";
import { describeFailure, readFailureFromError } from "@/lib/errors/describeFailure";
import { replyWithFailure, replyWithValue } from "@/lib/errors/replyWithFailure";

export const maxDuration = 300;

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { channelId?: string };
    const record = await readChannelRecord(body.channelId ?? "");
    if (!record.ok) {
      return replyWithFailure(record.failure);
    }

    const spots = record.value.weakSpots;
    if (!spots || spots.complaints.length === 0) {
      return replyWithFailure(describeFailure("nothing_stored"));
    }

    const question = askWhatToStop(spots.complaints, spots.weakVideos);

    let answer = "";
    let saidBy = "mind";

    const connection = connectToMinds();

    if (connection.ok) {
      const reply = await askMind(connection.value, record.value.mind.alias, question);
      if (reply.ok && readPlainText(reply.value.text).length > 40 && !looksLikeRefusal(reply.value.text)) {
        answer = reply.value.text;
      }
    }

    if (answer.length === 0 && canAskAzure()) {
      const spare = await askAzure(question);
      if (spare.ok) {
        answer = spare.value;
        saidBy = "fallback";
      }
    }

    if (answer.length === 0) {
      return replyWithFailure(describeFailure("mind_reply_unreadable"));
    }

    const saved = await saveWeakSpots(record.value.channel.channelId, {
      ...spots,
      whatToStop: keepInlineHtml(answer),
      stopSaidBy: saidBy
    });

    if (!saved.ok) {
      return replyWithFailure(saved.failure);
    }

    return replyWithValue(saved.value);
  } catch (error) {
    return replyWithFailure(readFailureFromError(error));
  }
}
