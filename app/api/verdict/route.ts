import type { NextRequest } from "next/server";
import { connectToMinds } from "@/lib/minds/connectToMinds";
import { askMind } from "@/lib/minds/askMind";
import { readVerdictFromReply } from "@/lib/minds/readCallFromReply";
import { askAzure, canAskAzure } from "@/lib/azure/askAzure";
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

    let verdict = null;

    if (reply.ok) {
      const fromMind = readVerdictFromReply(reply.value.text);
      if (fromMind.ok) {
        verdict = fromMind.value;
      }
    }

    if (!verdict && canAskAzure()) {
      const spare = await askAzure(question);
      if (spare.ok) {
        const fromSpare = readVerdictFromReply(spare.value);
        if (fromSpare.ok) {
          verdict = fromSpare.value;
        }
      }
    }

    if (!verdict) {
      return replyWithFailure(describeFailure("mind_reply_unreadable"));
    }

    const saved = await saveVerdict(
      record.value.channel.channelId,
      call.callId,
      verdict.outcome,
      verdict.lesson,
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
