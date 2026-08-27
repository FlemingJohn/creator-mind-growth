import type { Ask, AskDirection } from "@/types/ask";
import type { Comment } from "@/types/channel";
import { countPhrases } from "./countPhrases";
import { readRequestLines } from "./readRequestLines";

function readDirection(nowCount: number, beforeCount: number): AskDirection {
  if (beforeCount === 0 && nowCount > 0) {
    return "new";
  }
  if (nowCount > beforeCount * 1.4) {
    return "rising";
  }
  if (nowCount < beforeCount * 0.6) {
    return "fading";
  }
  return "steady";
}

export function findAsks(recent: Comment[], earlier: Comment[], howMany: number): Ask[] {
  const recentCounts = countPhrases(readRequestLines(recent));
  const earlierCounts = countPhrases(readRequestLines(earlier));

  const asks: Ask[] = [];

  for (const [phrase, count] of recentCounts) {
    const askCount = count.askerIds.size;
    if (askCount < 3) {
      continue;
    }

    const beforeCount = earlierCounts.get(phrase)?.askerIds.size ?? 0;

    asks.push({
      topic: phrase,
      askCount,
      repeatAskerCount: count.repeatAskerIds.size,
      direction: readDirection(askCount, beforeCount),
      sampleQuotes: count.quotes
    });
  }

  asks.sort(function strongestFirst(left, right) {
    const leftWeight = left.askCount + left.repeatAskerCount * 2;
    const rightWeight = right.askCount + right.repeatAskerCount * 2;
    return rightWeight - leftWeight;
  });

  return removeOverlaps(asks).slice(0, howMany);
}

function removeOverlaps(asks: Ask[]): Ask[] {
  const kept: Ask[] = [];

  for (const ask of asks) {
    const overlaps = kept.some(function sharesWords(existing) {
      return existing.topic.includes(ask.topic) || ask.topic.includes(existing.topic);
    });
    if (!overlaps) {
      kept.push(ask);
    }
  }

  return kept;
}
