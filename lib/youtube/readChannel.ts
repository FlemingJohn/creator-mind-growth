import type { Channel } from "@/types/channel";
import type { Result } from "@/types/result";
import { fail, succeed } from "@/types/result";
import { describeFailure } from "@/lib/errors/describeFailure";
import { callYouTube } from "./callYouTube";
import type { ChannelLink } from "./readChannelLink";

interface ChannelListShape {
  items?: Array<{
    id: string;
    snippet: {
      title: string;
      thumbnails: { medium?: { url: string }; default?: { url: string } };
    };
    statistics: { subscriberCount?: string; videoCount?: string };
    contentDetails: { relatedPlaylists: { uploads: string } };
  }>;
}

export async function readChannel(link: ChannelLink, apiKey: string): Promise<Result<Channel>> {
  const params: Record<string, string> = {
    part: "snippet,statistics,contentDetails"
  };

  if (link.lookupBy === "handle") {
    params.forHandle = link.value;
  } else {
    params.id = link.value;
  }

  const outcome = await callYouTube<ChannelListShape>("channels", params, apiKey);
  if (!outcome.ok) {
    return fail(outcome.failure);
  }

  const found = outcome.value.items?.[0];
  if (!found) {
    return fail(describeFailure("channel_not_found"));
  }

  return succeed({
    channelId: found.id,
    title: found.snippet.title,
    subscriberCount: Number(found.statistics.subscriberCount ?? "0"),
    videoCount: Number(found.statistics.videoCount ?? "0"),
    uploadsPlaylistId: found.contentDetails.relatedPlaylists.uploads,
    thumbnailUrl: found.snippet.thumbnails.medium?.url ?? found.snippet.thumbnails.default?.url ?? ""
  });
}
