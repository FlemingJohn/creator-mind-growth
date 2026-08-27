import type { Channel, Comment } from "@/types/channel";
import type { Result } from "@/types/result";
import { fail, succeed } from "@/types/result";
import { findAsks } from "@/lib/asks/findAsks";
import { splitByMonth } from "@/lib/asks/splitByMonth";
import type { MonthSummary } from "@/prompts/describeHistory";
import { describeHistory } from "@/prompts/describeHistory";
import type { MindsClient } from "./connectToMinds";
import { tellMind } from "./askMind";

const monthsToTeach = 6;

export async function teachMindHistory(
  client: MindsClient,
  alias: string,
  channel: Channel,
  comments: Comment[]
): Promise<Result<number>> {
  const months = splitByMonth(comments).slice(-monthsToTeach);
  const summaries: MonthSummary[] = [];

  for (let index = 0; index < months.length; index = index + 1) {
    const month = months[index];
    const earlier = months[index - 1]?.comments ?? [];
    const asks = findAsks(month.comments, earlier, 6);

    if (asks.length === 0) {
      continue;
    }

    summaries.push({
      month: month.month,
      videoCount: countVideos(month.comments),
      commentCount: month.comments.length,
      asks
    });
  }

  if (summaries.length === 0) {
    return succeed(0);
  }

  const sent = await tellMind(client, alias, describeHistory(channel, summaries));
  if (!sent.ok) {
    return fail(sent.failure);
  }

  return succeed(summaries.length);
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
