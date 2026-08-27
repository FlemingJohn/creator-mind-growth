import type { Video } from "@/types/channel";
import type { Result } from "@/types/result";
import { fail, succeed } from "@/types/result";
import { callYouTube } from "./callYouTube";

interface PlaylistShape {
  items?: Array<{
    contentDetails: { videoId: string; videoPublishedAt?: string };
    snippet: { title: string };
  }>;
  nextPageToken?: string;
}

interface VideoStatsShape {
  items?: Array<{ id: string; statistics: { viewCount?: string } }>;
}

export async function readVideos(
  uploadsPlaylistId: string,
  apiKey: string,
  maxVideos: number
): Promise<Result<Video[]>> {
  const collected: Video[] = [];
  let pageToken = "";

  while (collected.length < maxVideos) {
    const params: Record<string, string> = {
      part: "contentDetails,snippet",
      playlistId: uploadsPlaylistId,
      maxResults: "50"
    };
    if (pageToken.length > 0) {
      params.pageToken = pageToken;
    }

    const page = await callYouTube<PlaylistShape>("playlistItems", params, apiKey);
    if (!page.ok) {
      return fail(page.failure);
    }

    const items = page.value.items ?? [];
    for (const item of items) {
      collected.push({
        videoId: item.contentDetails.videoId,
        title: item.snippet.title,
        publishedAt: item.contentDetails.videoPublishedAt ?? "",
        viewCount: 0
      });
    }

    if (!page.value.nextPageToken || items.length === 0) {
      break;
    }
    pageToken = page.value.nextPageToken;
  }

  const trimmed = collected.slice(0, maxVideos);
  const withViews = await addViewCounts(trimmed, apiKey);
  if (!withViews.ok) {
    return succeed(trimmed);
  }
  return succeed(withViews.value);
}

async function addViewCounts(videos: Video[], apiKey: string): Promise<Result<Video[]>> {
  const viewsById = new Map<string, number>();

  for (let start = 0; start < videos.length; start = start + 50) {
    const batch = videos.slice(start, start + 50);
    const stats = await callYouTube<VideoStatsShape>(
      "videos",
      { part: "statistics", id: batch.map(readVideoId).join(",") },
      apiKey
    );
    if (!stats.ok) {
      return fail(stats.failure);
    }
    for (const item of stats.value.items ?? []) {
      viewsById.set(item.id, Number(item.statistics.viewCount ?? "0"));
    }
  }

  return succeed(
    videos.map(function attachViews(video) {
      return { ...video, viewCount: viewsById.get(video.videoId) ?? 0 };
    })
  );
}

function readVideoId(video: Video): string {
  return video.videoId;
}
