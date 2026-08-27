import type { Comment } from "@/types/channel";
import type { Channel } from "@/types/channel";
import type { Result } from "@/types/result";
import { fail, succeed } from "@/types/result";
import { findAsks } from "@/lib/asks/findAsks";
import { splitByMonth } from "@/lib/asks/splitByMonth";
import { describeMonth } from "@/prompts/describeMonth";
import { introduceChannel } from "@/prompts/introduceChannel";
import type { MindsClient } from "./connectToMinds";
import { askMind, tellMind } from "./askMind";

const monthsToTeach = 8;

export async function teachMindHistory(
  client: MindsClient,
  alias: string,
  channel: Channel,
  comments: Comment[]
): Promise<Result<number>> {
  const opened = await askMind(client, alias, introduceChannel(channel));
  if (!opened.ok) {
    return fail(opened.failure);
  }

  const months = splitByMonth(comments).slice(-monthsToTeach);
  let taught = 0;

  for (let index = 0; index < months.length; index = index + 1) {
    const month = months[index];
    const earlier = months[index - 1]?.comments ?? [];
    const asks = findAsks(month.comments, earlier, 6);

    if (asks.length === 0) {
      continue;
    }

    const videoCount = countVideos(month.comments);
    const message = describeMonth(month.month, videoCount, month.comments.length, asks);

    const sent = await tellMind(client, alias, message);
    if (!sent.ok) {
      return fail(sent.failure);
    }
    taught = taught + 1;
  }

  return succeed(taught);
}

function countVideos(comments: Comment[]): number {
  const ids = new Set<string>();
  for (const comment of comments) {
    if (comment.videoId.length > 0) {
      ids.add(comment.videoId);
    }
  }
  return ids.size;
}
