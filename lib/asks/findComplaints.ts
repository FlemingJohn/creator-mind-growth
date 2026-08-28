import type { Comment, Video } from "@/types/channel";
import type { Complaint, ComplaintKind, ComplaintQuote } from "@/types/weakness";

const leastPeopleToCount = 3;
const quotesKept = 6;

const markers: Array<{ kind: ComplaintKind; phrases: string[] }> = [
  {
    kind: "too fast",
    phrases: ["too fast", "slow down", "had to pause", "keep up", "0.75x", "speedrun", "so quick", "rushed"]
  },
  {
    kind: "not deep enough",
    phrases: [
      "you skipped",
      "skipped the",
      "surface level",
      "show the code",
      "more detail",
      "too shallow",
      "barely explained",
      "not enough depth",
      "go deeper"
    ]
  },
  {
    kind: "too long",
    phrases: ["too long", "get to the point", "rambling", "dragged", "waffle", "10 minutes of"]
  },
  {
    kind: "misleading title",
    phrases: ["clickbait", "title said", "misleading", "not what i expected", "false advertis", "thumbnail lied"]
  },
  {
    kind: "sound and picture",
    phrases: ["audio", "the mic", "cant hear", "can't hear", "music too loud", "blurry", "volume"]
  },
  {
    kind: "wrong or outdated",
    phrases: ["this is wrong", "outdated", "does not work", "doesn't work", "deprecated", "no longer works", "incorrect"]
  },
  {
    kind: "off topic",
    phrases: ["why are you covering", "stick to", "used to be about", "off topic", "unsubscrib"]
  }
];

interface Running {
  people: Set<string>;
  timesSaid: number;
  quotes: ComplaintQuote[];
  byVideo: Map<string, number>;
}

function readKind(text: string): ComplaintKind | null {
  const lowered = text.toLowerCase();

  for (const marker of markers) {
    for (const phrase of marker.phrases) {
      if (lowered.includes(phrase)) {
        return marker.kind;
      }
    }
  }

  return null;
}

export function findComplaints(comments: Comment[], videos: Video[]): Complaint[] {
  const titleById = new Map<string, string>();
  for (const video of videos) {
    titleById.set(video.videoId, video.title);
  }

  const running = new Map<ComplaintKind, Running>();

  for (const comment of comments) {
    const kind = readKind(comment.text);
    if (!kind) {
      continue;
    }

    const seen = running.get(kind) ?? {
      people: new Set<string>(),
      timesSaid: 0,
      quotes: [],
      byVideo: new Map<string, number>()
    };

    seen.people.add(comment.authorChannelId);
    seen.timesSaid = seen.timesSaid + 1;
    seen.byVideo.set(comment.videoId, (seen.byVideo.get(comment.videoId) ?? 0) + 1);

    if (comment.text.length < 220) {
      seen.quotes.push({
        text: comment.text.trim(),
        videoId: comment.videoId,
        videoTitle: titleById.get(comment.videoId) ?? "",
        likeCount: comment.likeCount
      });
    }

    running.set(kind, seen);
  }

  const complaints: Complaint[] = [];

  for (const [kind, seen] of running) {
    if (seen.people.size < leastPeopleToCount) {
      continue;
    }

    let worstVideoTitle = "";
    let worstVideoCount = 0;

    for (const [videoId, count] of seen.byVideo) {
      if (count > worstVideoCount) {
        worstVideoCount = count;
        worstVideoTitle = titleById.get(videoId) ?? "";
      }
    }

    seen.quotes.sort(function mostLikedFirst(left, right) {
      return right.likeCount - left.likeCount;
    });

    complaints.push({
      kind,
      peopleCount: seen.people.size,
      timesSaid: seen.timesSaid,
      quotes: seen.quotes.slice(0, quotesKept),
      worstVideoTitle,
      worstVideoCount
    });
  }

  complaints.sort(function loudestFirst(left, right) {
    return right.peopleCount - left.peopleCount;
  });

  return complaints;
}
