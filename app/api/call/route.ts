import type { NextRequest } from "next/server";
import { connectToMinds } from "@/lib/minds/connectToMinds";
import { askMind } from "@/lib/minds/askMind";
import { readCallFromReply } from "@/lib/minds/readCallFromReply";
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

    const reply = await askMind(connection.value, record.value.mind.alias, askForNextCall());
    if (!reply.ok) {
      return replyWithFailure(reply.failure);
    }

    const call = readCallFromReply(reply.value.text, record.value.channel.channelId);
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
