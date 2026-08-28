import type { IdeaBoard } from "@/types/trend";
import type { Result } from "@/types/result";
import { fail, succeed } from "@/types/result";
import { describeFailure } from "@/lib/errors/describeFailure";
import { openStore, saveStore } from "./openStore";

export async function saveIdeaBoard(channelId: string, board: IdeaBoard): Promise<Result<IdeaBoard>> {
  const store = await openStore();
  const record = store.channels[channelId];

  if (!record) {
    return fail(describeFailure("nothing_stored"));
  }

  record.ideaBoard = board;
  store.channels[channelId] = record;

  const written = await saveStore(store);
  if (!written) {
    return fail(describeFailure("unknown"));
  }

  return succeed(board);
}
