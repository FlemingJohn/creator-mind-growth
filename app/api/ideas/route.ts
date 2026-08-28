import type { NextRequest } from "next/server";
import type { Ask } from "@/types/ask";
import type { Idea, IdeaBoard, NicheTopic } from "@/types/trend";
import { searchNiche } from "@/lib/youtube/searchNiche";
import { findNicheGaps } from "@/lib/asks/findNicheGaps";
import { readChannelWords } from "@/lib/asks/readChannelWords";
import { connectToMinds } from "@/lib/minds/connectToMinds";
import { askMind } from "@/lib/minds/askMind";
import { readCallFromReply } from "@/lib/minds/readCallFromReply";
import { askForNovelIdea } from "@/prompts/askForNovelIdea";
import { askAzure, canAskAzure } from "@/lib/azure/askAzure";
import { readChannelRecord } from "@/lib/store/readChannelRecord";
import { saveIdeaBoard } from "@/lib/store/saveIdeaBoard";
import { readEnvKey } from "@/lib/errors/readEnvKey";
import { readFailureFromError } from "@/lib/errors/describeFailure";
import { replyWithFailure, replyWithValue } from "@/lib/errors/replyWithFailure";

export const maxDuration = 300;

function buildSignalIdea(topic: string, askCount: number, repeatCount: number): Idea {
  const shown = topic.charAt(0).toUpperCase() + topic.slice(1);

  return {
    kind: "signal",
    title: "More on " + shown,
    reason:
      askCount +
      " of your viewers asked for " +
      topic +
      ", more than any other topic, and " +
      repeatCount +
      " of them came back to ask again.",
    risk: "low",
    upside: "medium",
    source: "from your comments"
  };
}

function buildWaveIdea(gap: NicheTopic): Idea {
  return {
    kind: "wave",
    title: gap.topTitle,
    reason:
      gap.videoCount +
      " videos on " +
      gap.topic +
      " landed in the last 30 days and the best one reached " +
      gap.topViewCount +
      " views. You have covered it " +
      gap.coveredByCreator +
      " times.",
    risk: gap.coveredByCreator === 0 ? "medium" : "low",
    upside: "high",
    source: "from your niche"
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { channelId?: string };
    const record = await readChannelRecord(body.channelId ?? "");
    if (!record.ok) {
      return replyWithFailure(record.failure);
    }

    const youtubeKey = readEnvKey("YOUTUBE_API_KEY");
    if (!youtubeKey.ok) {
      return replyWithFailure(youtubeKey.failure);
    }

    const askTerms = record.value.asks.slice(0, 2).map(function toTerm(ask) {
      return ask.topic;
    });

    const channelTerms = readChannelWords(record.value.videos ?? [], 1);
    const terms = [...askTerms, ...channelTerms].slice(0, 3);

    const nicheVideos = await searchNiche(terms, youtubeKey.value);
    if (!nicheVideos.ok) {
      return replyWithFailure(nicheVideos.failure);
    }

    const gaps = findNicheGaps(nicheVideos.value, record.value.videos ?? [], 5);

    const ideas: Idea[] = [];

    const strongest = record.value.asks[0];
    if (strongest) {
      ideas.push(buildSignalIdea(strongest.topic, strongest.askCount, strongest.repeatAskerCount));
    }

    const widest = gaps[0];
    if (widest) {
      ideas.push(buildWaveIdea(widest));
    }

    const novel = await readNovelIdea(
      record.value.mind.alias,
      record.value.asks,
      gaps,
      record.value.channel.channelId
    );
    if (novel) {
      ideas.push(novel);
    }

    const board: IdeaBoard = { ideas, gaps, searchedAt: new Date().toISOString() };

    const saved = await saveIdeaBoard(record.value.channel.channelId, board);
    if (!saved.ok) {
      return replyWithFailure(saved.failure);
    }

    return replyWithValue(board);
  } catch (error) {
    return replyWithFailure(readFailureFromError(error));
  }
}

async function readNovelIdea(
  alias: string,
  asks: Ask[],
  gaps: NicheTopic[],
  channelId: string
): Promise<Idea | null> {
  if (asks.length === 0 || gaps.length === 0) {
    return null;
  }

  const question = askForNovelIdea(asks, gaps);
  const connection = connectToMinds();

  let call = null;

  if (connection.ok) {
    const reply = await askMind(connection.value, alias, question);
    if (reply.ok) {
      const fromMind = readCallFromReply(reply.value.text, channelId, "mind");
      if (fromMind.ok) {
        call = fromMind.value;
      }
    }
  }

  if (!call && canAskAzure()) {
    const spare = await askAzure(question);
    if (spare.ok) {
      const fromSpare = readCallFromReply(spare.value, channelId, "fallback");
      if (fromSpare.ok) {
        call = fromSpare.value;
      }
    }
  }

  if (!call) {
    return null;
  }

  return {
    kind: "new",
    title: call.title,
    reason: call.reason,
    risk: call.risk,
    upside: call.upside,
    source: call.answeredBy === "mind" ? "from your Mind" : "from the standby model"
  };
}
