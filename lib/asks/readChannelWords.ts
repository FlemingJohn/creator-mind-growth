import type { Video } from "@/types/channel";
import { splitIntoWords } from "./countPhrases";

export function readChannelWords(videos: Video[], howMany: number): string[] {
  const counts = new Map<string, number>();

  for (const video of videos) {
    for (const word of new Set(splitIntoWords(video.title))) {
      counts.set(word, (counts.get(word) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .filter(function keepRepeated(entry) {
      return entry[1] >= 2 && entry[0].length > 2;
    })
    .sort(function commonestFirst(left, right) {
      return right[1] - left[1];
    })
    .slice(0, howMany)
    .map(function toWord(entry) {
      return entry[0];
    });
}
