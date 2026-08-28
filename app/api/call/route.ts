import type { NextRequest } from "next/server";
import { connectToMinds } from "@/lib/minds/connectToMinds";
import { askMind } from "@/lib/minds/askMind";
import { readCallFromReply } from "@/lib/minds/readCallFromReply";
import { askAzure, canAskAzure } from "@/lib/azure/askAzure";
import { askForNextCall } from "@/prompts/askForNextCall";
import { readChannelRecord } from "@/lib/store/readChannelRecord";
import { saveCall } from "@/lib/store/saveCall";
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

    const connection = connectToMinds();
    if (!connection.ok) {
      return replyWithFailure(connection.failure);
    }

    const question = askForNextCall();
    const reply = await askMind(connection.value, record.value.mind.alias, question);

    let call = null;

    if (reply.ok) {
      const fromMind = readCallFromReply(reply.value.text, record.value.channel.channelId, "mind");
      if (fromMind.ok) {
        call = fromMind;
      }
    }

    if (!call && canAskAzure()) {
      const spare = await askAzure(question);
      if (spare.ok) {
        const fromSpare = readCallFromReply(spare.value, record.value.channel.channelId, "fallback");
        if (fromSpare.ok) {
          call = fromSpare;
        }
      }
    }

    if (!call) {
      return replyWithFailure(describeFailure("mind_reply_unreadable"));
    }

    const saved = await saveCall(record.value.channel.channelId, call.value);
    if (!saved.ok) {
      return replyWithFailure(saved.failure);
    }

    return replyWithValue(saved.value);
  } catch (error) {
    return replyWithFailure(readFailureFromError(error));
  }
}
