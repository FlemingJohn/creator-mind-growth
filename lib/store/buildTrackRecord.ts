import type { Call, TrackRecord } from "@/types/call";

export function buildTrackRecord(calls: Call[], latestLesson: string | null): TrackRecord {
  const judged = calls.filter(function wasJudged(call) {
    return call.outcome !== "waiting";
  });

  const hits = judged.filter(function wasHit(call) {
    return call.outcome === "hit";
  });

  return {
    calls,
    hitCount: hits.length,
    judgedCount: judged.length,
    latestLesson
  };
}
