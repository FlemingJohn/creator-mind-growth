import type { NextRequest } from "next/server";
import type { DashboardData } from "@/types/dashboard";
import { buildTrackRecord } from "@/lib/store/buildTrackRecord";
import { readChannelRecord, readFirstChannelRecord } from "@/lib/store/readChannelRecord";
import { readFailureFromError } from "@/lib/errors/describeFailure";
import { replyWithFailure, replyWithValue } from "@/lib/errors/replyWithFailure";

export async function GET(request: NextRequest) {
  try {
    const wanted = request.nextUrl.searchParams.get("channelId");

    const record = wanted ? await readChannelRecord(wanted) : await readFirstChannelRecord();
    if (!record.ok) {
      return replyWithFailure(record.failure);
    }

    const waiting = record.value.calls.find(function isWaiting(call) {
      return call.outcome === "waiting";
    });

    const data: DashboardData = {
      channel: record.value.channel,
      mindName: record.value.mind.name,
      nextCall: waiting ?? null,
      trackRecord: buildTrackRecord(record.value.calls, record.value.latestLesson),
      asks: record.value.asks,
      checkedAt: record.value.checkedAt
    };

    return replyWithValue(data);
  } catch (error) {
    return replyWithFailure(readFailureFromError(error));
  }
}
