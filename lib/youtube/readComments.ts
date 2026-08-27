import type { Comment, Video } from "@/types/channel";
import type { Result } from "@/types/result";
import { fail, succeed } from "@/types/result";
import { callYouTube } from "./callYouTube";

interface CommentThreadShape {
  items?: Array<{
    snippet: {
      videoId?: string;
      topLevelComment: {
        id: string;
        snippet: {
          authorDisplayName: string;
          authorChannelId?: { value: string };
          textOriginal: string;
          likeCount: number;
          publishedAt: string;
        };
      };
    };
  }>;
  nextPageToken?: string;
}

export async function readChannelComments(
  channelId: string,
  apiKey: string,
  maxComments: number
): Promise<Result<Comment[]>> {
  const gathered = await gatherThreads(
    { part: "snippet", allThreadsRelatedToChannelId: channelId, maxResults: "100", order: "time", textFormat: "plainText" },
    apiKey,
    maxComments
  );

  if (gathered.ok && gathered.value.length > 0) {
    return gathered;
  }
  return gathered;
}

export async function readVideoComments(
  videos: Video[],
  apiKey: string,
  maxPerVideo: number
): Promise<Result<Comment[]>> {
  const gathered: Comment[] = [];

  for (const video of videos) {
    const page = await gatherThreads(
      { part: "snippet", videoId: video.videoId, maxResults: "100", order: "time", textFormat: "plainText" },
      apiKey,
      maxPerVideo
    );
    if (!page.ok) {
      if (page.failure.kind === "youtube_quota_spent") {
        return fail(page.failure);
      }
      continue;
    }
    gathered.push(...page.value);
  }

  return succeed(gathered);
}

async function gatherThreads(
  params: Record<string, string>,
  apiKey: string,
  maxComments: number
): Promise<Result<Comment[]>> {
  const gathered: Comment[] = [];
  let pageToken = "";

  while (gathered.length < maxComments) {
    const nextParams = pageToken.length > 0 ? { ...params, pageToken } : params;
    const page = await callYouTube<CommentThreadShape>("commentThreads", nextParams, apiKey);
    if (!page.ok) {
      if (gathered.length > 0) {
        return succeed(gathered);
      }
      return fail(page.failure);
    }

    const items = page.value.items ?? [];
    for (const item of items) {
      const top = item.snippet.topLevelComment;
      gathered.push({
        commentId: top.id,
        videoId: item.snippet.videoId ?? "",
        authorName: top.snippet.authorDisplayName,
        authorChannelId: top.snippet.authorChannelId?.value ?? top.snippet.authorDisplayName,
        text: top.snippet.textOriginal,
        likeCount: top.snippet.likeCount,
        publishedAt: top.snippet.publishedAt
      });
    }

    if (!page.value.nextPageToken || items.length === 0) {
      break;
    }
    pageToken = page.value.nextPageToken;
  }

  return succeed(gathered.slice(0, maxComments));
}
