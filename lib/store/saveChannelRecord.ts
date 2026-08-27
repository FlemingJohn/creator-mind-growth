import type { ChannelRecord } from "@/types/store";
import type { Result } from "@/types/result";
import { fail, succeed } from "@/types/result";
import { describeFailure } from "@/lib/errors/describeFailure";
import { openStore, saveStore } from "./openStore";

export async function saveChannelRecord(record: ChannelRecord): Promise<Result<ChannelRecord>> {
  const store = await openStore();
  store.channels[record.channel.channelId] = record;

  const written = await saveStore(store);
  if (!written) {
    return fail(describeFailure("unknown"));
  }

  return succeed(record);
}
