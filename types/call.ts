export type AnsweredBy = "mind" | "fallback";

export type CallOutcome = "waiting" | "hit" | "miss";

export interface Call {
  callId: string;
  channelId: string;
  title: string;
  reason: string;
  risk: string;
  upside: string;
  madeOn: string;
  outcome: CallOutcome;
  matchedVideoId: string | null;
  verdict: string | null;
  judgedOn: string | null;
  answeredBy: AnsweredBy;
}

export interface TrackRecord {
  calls: Call[];
  hitCount: number;
  judgedCount: number;
  latestLesson: string | null;
}
