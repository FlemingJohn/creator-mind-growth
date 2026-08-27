import { NextResponse } from "next/server";
import type { Failure } from "@/types/result";

export function replyWithFailure(failure: Failure): NextResponse {
  const status = readStatus(failure.kind);
  return NextResponse.json({ ok: false, failure }, { status });
}

export function replyWithValue<Value>(value: Value): NextResponse {
  return NextResponse.json({ ok: true, value });
}

function readStatus(kind: Failure["kind"]): number {
  if (kind === "missing_key") {
    return 500;
  }
  if (kind === "bad_channel_link") {
    return 400;
  }
  if (kind === "channel_not_found" || kind === "nothing_stored") {
    return 404;
  }
  if (kind === "youtube_quota_spent") {
    return 429;
  }
  if (kind === "mind_took_too_long") {
    return 504;
  }
  return 502;
}
