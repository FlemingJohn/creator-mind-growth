import type { NextRequest } from "next/server";
import { connectToMinds } from "@/lib/minds/connectToMinds";
import { askMind } from "@/lib/minds/askMind";
import { readCallFromReply } from "@/lib/minds/readCallFromReply";
import { askAzure, canAskAzure } from "@/lib/azure/askAzure";
import { askForNextCall } from "@/prompts/askForNextCall";
import { readChannelRecord } from "@/lib/store/readChannelRecord";
import { saveCall } from "@/lib/store/saveCall";
import { readFailureFromError } from "@/lib/errors/describeFailure";
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

    let answerText = "";
    let answeredBy: "mind" | "fallback" = "mind";

    if (reply.ok) {
      answerText = reply.value.text;
    } else if (canAskAzure()) {
      const spare = await askAzure(question);
      if (!spare.ok) {
        return replyWithFailure(reply.failure);
      }
      answerText = spare.value;
      answeredBy = "fallback";
    } else {
      return replyWithFailure(reply.failure);
    }

    const call = readCallFromReply(answerText, record.value.channel.channelId, answeredBy);
    if (!call.ok) {
      return replyWithFailure(call.failure);
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
