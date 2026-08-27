import type { ChannelRecord } from "@/types/store";
import type { Result } from "@/types/result";
import { fail, succeed } from "@/types/result";
import { describeFailure } from "@/lib/errors/describeFailure";
import { openStore } from "./openStore";

export async function readChannelRecord(channelId: string): Promise<Result<ChannelRecord>> {
  const store = await openStore();
  const record = store.channels[channelId];

  if (!record) {
    return fail(describeFailure("nothing_stored"));
  }

  return succeed(record);
}

export async function readFirstChannelRecord(): Promise<Result<ChannelRecord>> {
  const store = await openStore();
  const records = Object.values(store.channels);

  if (records.length === 0) {
    return fail(describeFailure("nothing_stored"));
  }

  return succeed(records[0]);
}
