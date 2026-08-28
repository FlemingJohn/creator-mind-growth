import type { NicheVideo } from "@/types/trend";
import type { Result } from "@/types/result";
import { fail, succeed } from "@/types/result";
import { readPlainText } from "@/lib/minds/keepSafeHtml";
import { callYouTube } from "./callYouTube";

const daysBack = 30;
const wantedResults = 50;

interface SearchShape {
  items?: Array<{
    id?: { videoId?: string };
    snippet?: { title?: string; channelTitle?: string; publishedAt?: string };
  }>;
}

interface StatsShape {
  items?: Array<{ id: string; statistics?: { viewCount?: string } }>;
}

function readSinceDate(): string {
  const since = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);
  return since.toISOString();
}

export async function searchNiche(terms: string[], apiKey: string): Promise<Result<NicheVideo[]>> {
  const query = terms.slice(0, 3).join(" ");

  if (query.trim().length === 0) {
    return succeed([]);
  }

  const found = await callYouTube<SearchShape>(
    "search",
    {
      part: "snippet",
      q: query,
      type: "video",
      order: "viewCount",
      publishedAfter: readSinceDate(),
      maxResults: String(wantedResults),
      videoDuration: "medium",
      relevanceLanguage: "en"
    },
    apiKey
  );

  if (!found.ok) {
    return fail(found.failure);
  }

  const videos: NicheVideo[] = [];

  for (const item of found.value.items ?? []) {
    const videoId = item.id?.videoId;
    if (!videoId) {
      continue;
    }
    videos.push({
      videoId,
      title: readPlainText(item.snippet?.title ?? ""),
      channelTitle: readPlainText(item.snippet?.channelTitle ?? ""),
      publishedAt: item.snippet?.publishedAt ?? "",
      viewCount: 0
    });
  }

  if (videos.length === 0) {
    return succeed([]);
  }

  const stats = await callYouTube<StatsShape>(
    "videos",
    { part: "statistics", id: videos.map(readId).join(",") },
    apiKey
  );

  if (!stats.ok) {
    return succeed(videos);
  }

  const viewsById = new Map<string, number>();
  for (const item of stats.value.items ?? []) {
    viewsById.set(item.id, Number(item.statistics?.viewCount ?? "0"));
  }

  return succeed(
    videos.map(function attachViews(video) {
      return { ...video, viewCount: viewsById.get(video.videoId) ?? 0 };
    })
  );
}

function readId(video: NicheVideo): string {
  return video.videoId;
}
