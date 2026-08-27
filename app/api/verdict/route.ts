import type { NextRequest } from "next/server";
import { connectToMinds } from "@/lib/minds/connectToMinds";
import { askMind } from "@/lib/minds/askMind";
import { readVerdictFromReply } from "@/lib/minds/readCallFromReply";
import { askForVerdict } from "@/prompts/askForVerdict";
import { readChannelRecord } from "@/lib/store/readChannelRecord";
import { saveVerdict } from "@/lib/store/saveCall";
import { describeFailure, readFailureFromError } from "@/lib/errors/describeFailure";
import { replyWithFailure, replyWithValue } from "@/lib/errors/replyWithFailure";

export const maxDuration = 300;

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      channelId?: string;
      callId?: string;
      videoTitle?: string;
      viewCount?: number;
      videoId?: string;
    };

    const record = await readChannelRecord(body.channelId ?? "");
    if (!record.ok) {
      return replyWithFailure(record.failure);
    }

    const call = record.value.calls.find(function hasId(saved) {
      return saved.callId === body.callId;
    });

    if (!call) {
      return replyWithFailure(describeFailure("nothing_stored"));
    }

    const connection = connectToMinds();
    if (!connection.ok) {
      return replyWithFailure(connection.failure);
    }

    const question = askForVerdict(
      call.title,
      new Date(call.madeOn).toLocaleDateString("en-GB", { day: "numeric", month: "long" }),
      body.videoTitle ?? call.title,
      body.viewCount ?? 0,
      record.value.usualViewCount
    );

    const reply = await askMind(connection.value, record.value.mind.alias, question);
    if (!reply.ok) {
      return replyWithFailure(reply.failure);
    }

    const verdict = readVerdictFromReply(reply.value.text);
    if (!verdict.ok) {
      return replyWithFailure(verdict.failure);
    }

    const saved = await saveVerdict(
      record.value.channel.channelId,
      call.callId,
      verdict.value.outcome,
      verdict.value.lesson,
      body.videoId ?? ""
    );

    if (!saved.ok) {
      return replyWithFailure(saved.failure);
    }

    return replyWithValue(saved.value);
  } catch (error) {
    return replyWithFailure(readFailureFromError(error));
  }
}
