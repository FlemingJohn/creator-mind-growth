export type FailureKind =
  | "missing_key"
  | "bad_channel_link"
  | "channel_not_found"
  | "youtube_unavailable"
  | "youtube_quota_spent"
  | "mind_unavailable"
  | "mind_took_too_long"
  | "mind_reply_unreadable"
  | "nothing_stored"
  | "unknown";

export interface Failure {
  kind: FailureKind;
  title: string;
  detail: string;
  canRetry: boolean;
}

export type Result<Value> =
  | { ok: true; value: Value }
  | { ok: false; failure: Failure };

export function succeed<Value>(value: Value): Result<Value> {
  return { ok: true, value };
}

export function fail<Value>(failure: Failure): Result<Value> {
  return { ok: false, failure };
}
