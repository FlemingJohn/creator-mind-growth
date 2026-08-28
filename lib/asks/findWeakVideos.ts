import type { Video } from "@/types/channel";
import type { WeakVideo } from "@/types/weakness";

const missesBelow = 0.7;

export function findWeakVideos(videos: Video[], usualViewCount: number, howMany: number): WeakVideo[] {
  if (usualViewCount <= 0) {
    return [];
  }

  const weak: WeakVideo[] = [];

  for (const video of videos) {
    if (video.viewCount <= 0) {
      continue;
    }

    const share = video.viewCount / usualViewCount;
    if (share >= missesBelow) {
      continue;
    }

    weak.push({
      videoId: video.videoId,
      title: video.title,
      viewCount: video.viewCount,
      usualViewCount,
      shortfall: Math.round((1 - share) * 100)
    });
  }

  weak.sort(function worstFirst(left, right) {
    return right.shortfall - left.shortfall;
  });

  return weak.slice(0, howMany);
}
