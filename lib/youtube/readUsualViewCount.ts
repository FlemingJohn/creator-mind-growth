import type { Video } from "@/types/channel";

export function readUsualViewCount(videos: Video[]): number {
  const counted = videos
    .map(function toViews(video) {
      return video.viewCount;
    })
    .filter(function isReal(views) {
      return views > 0;
    })
    .sort(function smallestFirst(left, right) {
      return left - right;
    });

  if (counted.length === 0) {
    return 0;
  }

  const middle = Math.floor(counted.length / 2);

  if (counted.length % 2 === 1) {
    return counted[middle];
  }

  return Math.round((counted[middle - 1] + counted[middle]) / 2);
}
