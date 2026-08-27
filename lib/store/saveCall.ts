import type { Call } from "@/types/call";
import type { Result } from "@/types/result";
import { fail, succeed } from "@/types/result";
import { describeFailure } from "@/lib/errors/describeFailure";
import { openStore, saveStore } from "./openStore";

export async function saveCall(channelId: string, call: Call): Promise<Result<Call>> {
  const store = await openStore();
  const record = store.channels[channelId];

  if (!record) {
    return fail(describeFailure("nothing_stored"));
  }

  record.calls = [call, ...record.calls];
  store.channels[channelId] = record;

  const written = await saveStore(store);
  if (!written) {
    return fail(describeFailure("unknown"));
  }

  return succeed(call);
}

export async function saveVerdict(
  channelId: string,
  callId: string,
  outcome: "hit" | "miss",
  lesson: string,
  matchedVideoId: string
): Promise<Result<Call>> {
  const store = await openStore();
  const record = store.channels[channelId];

  if (!record) {
    return fail(describeFailure("nothing_stored"));
  }

  const found = record.calls.find(function hasId(call) {
    return call.callId === callId;
  });

  if (!found) {
    return fail(describeFailure("nothing_stored"));
  }

  found.outcome = outcome;
  found.verdict = lesson;
  found.judgedOn = new Date().toISOString();
  found.matchedVideoId = matchedVideoId;
  record.latestLesson = lesson;

  store.channels[channelId] = record;

  const written = await saveStore(store);
  if (!written) {
    return fail(describeFailure("unknown"));
  }

  return succeed(found);
}
