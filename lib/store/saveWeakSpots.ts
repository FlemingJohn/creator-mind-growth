import type { WeakSpots } from "@/types/weakness";
import type { Result } from "@/types/result";
import { fail, succeed } from "@/types/result";
import { describeFailure } from "@/lib/errors/describeFailure";
import { openStore, saveStore } from "./openStore";

export async function saveWeakSpots(channelId: string, spots: WeakSpots): Promise<Result<WeakSpots>> {
  const store = await openStore();
  const record = store.channels[channelId];

  if (!record) {
    return fail(describeFailure("nothing_stored"));
  }

  record.weakSpots = spots;
  store.channels[channelId] = record;

  const written = await saveStore(store);
  if (!written) {
    return fail(describeFailure("unknown"));
  }

  return succeed(spots);
}
