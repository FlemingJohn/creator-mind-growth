import type { NextRequest } from "next/server";
import type { Comment, Video } from "@/types/channel";
import type { Result } from "@/types/result";
import { readChannelLink } from "@/lib/youtube/readChannelLink";
import { readChannel } from "@/lib/youtube/readChannel";
import { readVideos } from "@/lib/youtube/readVideos";
import { readChannelComments, readVideoComments } from "@/lib/youtube/readComments";
import { readUsualViewCount } from "@/lib/youtube/readUsualViewCount";
import { findAsks } from "@/lib/asks/findAsks";
import { splitByMonth } from "@/lib/asks/splitByMonth";
import { connectToMinds } from "@/lib/minds/connectToMinds";
import { wakeMind } from "@/lib/minds/wakeMind";
import { teachMindHistory } from "@/lib/minds/teachMindHistory";
import { saveChannelRecord } from "@/lib/store/saveChannelRecord";
import { readEnvKey } from "@/lib/errors/readEnvKey";
import { describeFailure, readFailureFromError } from "@/lib/errors/describeFailure";
import { replyWithFailure, replyWithValue } from "@/lib/errors/replyWithFailure";

export const maxDuration = 300;

const maxVideosToRead = 60;
const maxCommentsToRead = 1200;

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { link?: string };
    const link = readChannelLink(body.link ?? "");
    if (!link.ok) {
      return replyWithFailure(link.failure);
    }

    const youtubeKey = readEnvKey("YOUTUBE_API_KEY");
    if (!youtubeKey.ok) {
      return replyWithFailure(youtubeKey.failure);
    }

    const channel = await readChannel(link.value, youtubeKey.value);
    if (!channel.ok) {
      return replyWithFailure(channel.failure);
    }

    const videos = await readVideos(channel.value.uploadsPlaylistId, youtubeKey.value, maxVideosToRead);
    if (!videos.ok) {
      return replyWithFailure(videos.failure);
    }

    const comments = await readComments(channel.value.channelId, videos.value, youtubeKey.value);
    if (!comments.ok) {
      return replyWithFailure(comments.failure);
    }

    if (comments.value.length === 0) {
      return replyWithFailure(describeFailure("nothing_stored"));
    }

    const connection = connectToMinds();
    if (!connection.ok) {
      return replyWithFailure(connection.failure);
    }

    const mind = await wakeMind(connection.value, channel.value.title, channel.value.channelId);
    if (!mind.ok) {
      return replyWithFailure(mind.failure);
    }

    const taught = await teachMindHistory(connection.value, mind.value.alias, channel.value, comments.value);
    if (!taught.ok) {
      return replyWithFailure(taught.failure);
    }

    const months = splitByMonth(comments.value);
    const recent = months.at(-1)?.comments ?? comments.value;
    const earlier = months.at(-2)?.comments ?? [];

    const saved = await saveChannelRecord({
      channel: channel.value,
      mind: mind.value,
      calls: [],
      asks: findAsks(recent, earlier, 4),
      latestLesson: null,
      usualViewCount: readUsualViewCount(videos.value),
      checkedAt: new Date().toISOString()
    });

    if (!saved.ok) {
      return replyWithFailure(saved.failure);
    }

    return replyWithValue({
      channelId: channel.value.channelId,
      monthsTaught: taught.value,
      commentsRead: comments.value.length
    });
  } catch (error) {
    return replyWithFailure(readFailureFromError(error));
  }
}

async function readComments(
  channelId: string,
  videos: Video[],
  apiKey: string
): Promise<Result<Comment[]>> {
  const wholeChannel = await readChannelComments(channelId, apiKey, maxCommentsToRead);
  if (wholeChannel.ok && wholeChannel.value.length > 0) {
    return wholeChannel;
  }
  return readVideoComments(videos, apiKey, 100);
}
