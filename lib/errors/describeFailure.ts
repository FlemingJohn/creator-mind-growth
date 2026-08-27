import type { Failure, FailureKind } from "@/types/result";

const wording: Record<FailureKind, { title: string; detail: string; canRetry: boolean }> = {
  missing_key: {
    title: "A key is missing",
    detail: "Add your YouTube and Minds keys to the .env file, then start the app again.",
    canRetry: false
  },
  bad_channel_link: {
    title: "That link does not look like a channel",
    detail: "Paste the address of a YouTube channel, such as youtube.com/@name.",
    canRetry: false
  },
  channel_not_found: {
    title: "No channel at that link",
    detail: "Check the spelling, or open the channel in YouTube and copy the address again.",
    canRetry: false
  },
  youtube_unavailable: {
    title: "YouTube did not answer",
    detail: "The connection dropped on the way. Try again in a moment.",
    canRetry: true
  },
  youtube_quota_spent: {
    title: "YouTube is done for today",
    detail: "The daily reading limit is used up. It resets at midnight Pacific time.",
    canRetry: false
  },
  mind_unavailable: {
    title: "Your Mind did not answer",
    detail: "Minds could not be reached. Try again in a moment.",
    canRetry: true
  },
  mind_took_too_long: {
    title: "Your Mind is still thinking",
    detail: "It did not finish in time. Ask again and it will pick up where it left off.",
    canRetry: true
  },
  mind_reply_unreadable: {
    title: "Your Mind replied in an odd shape",
    detail: "The answer came back but did not fit. Ask again.",
    canRetry: true
  },
  nothing_stored: {
    title: "Nothing here yet",
    detail: "Paste a channel link to get started.",
    canRetry: false
  },
  unknown: {
    title: "Something went wrong",
    detail: "That did not work, and the reason was not clear. Try again.",
    canRetry: true
  }
};

export function describeFailure(kind: FailureKind): Failure {
  const words = wording[kind];
  return {
    kind,
    title: words.title,
    detail: words.detail,
    canRetry: words.canRetry
  };
}

export function readFailureFromError(error: unknown): Failure {
  if (error instanceof Error) {
    const text = error.message.toLowerCase();
    if (text.includes("quota")) {
      return describeFailure("youtube_quota_spent");
    }
    if (text.includes("timeout") || text.includes("timed out")) {
      return describeFailure("mind_took_too_long");
    }
    if (text.includes("api key") || text.includes("unauthorized") || text.includes("403")) {
      return describeFailure("missing_key");
    }
  }
  return describeFailure("unknown");
}
