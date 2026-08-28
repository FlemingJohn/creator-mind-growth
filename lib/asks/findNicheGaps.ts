import type { Video } from "@/types/channel";
import type { NicheTopic, NicheVideo } from "@/types/trend";
import { splitIntoWords } from "./countPhrases";
import { stopWords } from "./stopWords";

const formatWords = new Set([
  "shorts",
  "short",
  "video",
  "videos",
  "trending",
  "viral",
  "funny",
  "amp",
  "center",
  "full",
  "live",
  "official",
  "episode",
  "part",
  "vlog",
  "reaction",
  "status",
  "song",
  "movie",
  "trailer"
]);

const leastVideosToCount = 3;

interface Running {
  topic: string;
  videoIds: Set<string>;
  topViewCount: number;
  topTitle: string;
}

export function findNicheGaps(
  nicheVideos: NicheVideo[],
  creatorVideos: Video[],
  howMany: number
): NicheTopic[] {
  const running = new Map<string, Running>();

  for (const video of nicheVideos) {
    for (const word of new Set(splitIntoWords(video.title))) {
      const seen = running.get(word) ?? {
        topic: word,
        videoIds: new Set<string>(),
        topViewCount: 0,
        topTitle: ""
      };

      seen.videoIds.add(video.videoId);

      if (video.viewCount > seen.topViewCount) {
        seen.topViewCount = video.viewCount;
        seen.topTitle = video.title;
      }

      running.set(word, seen);
    }
  }

  const creatorWords = new Map<string, number>();
  for (const video of creatorVideos) {
    for (const word of new Set(splitIntoWords(video.title))) {
      creatorWords.set(word, (creatorWords.get(word) ?? 0) + 1);
    }
  }

  const topics: NicheTopic[] = [];

  for (const [topic, seen] of running) {
    if (seen.videoIds.size < leastVideosToCount) {
      continue;
    }

    if (formatWords.has(topic) || stopWords.has(topic) || topic.length < 3) {
      continue;
    }

    topics.push({
      topic,
      videoCount: seen.videoIds.size,
      topViewCount: seen.topViewCount,
      topTitle: seen.topTitle,
      coveredByCreator: creatorWords.get(topic) ?? 0
    });
  }

  topics.sort(function widestGapFirst(left, right) {
    const leftGap = left.videoCount * (left.coveredByCreator === 0 ? 2 : 1);
    const rightGap = right.videoCount * (right.coveredByCreator === 0 ? 2 : 1);
    return rightGap - leftGap;
  });

  return topics.slice(0, howMany);
}
