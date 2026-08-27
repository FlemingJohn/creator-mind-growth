import type { Comment } from "@/types/channel";

const requestMarkers = [
  "can you",
  "could you",
  "please make",
  "please do",
  "would love",
  "would like",
  "how do",
  "how does",
  "how to",
  "show us",
  "show me",
  "tutorial on",
  "video on",
  "video about",
  "part 2",
  "part two",
  "deep dive",
  "explain",
  "walk through",
  "walkthrough",
  "cover"
];

export function looksLikeRequest(text: string): boolean {
  const lowered = text.toLowerCase();
  if (lowered.includes("?")) {
    return true;
  }
  return requestMarkers.some(function hasMarker(marker) {
    return lowered.includes(marker);
  });
}

export function readRequestLines(comments: Comment[]): Comment[] {
  return comments.filter(function keepRequests(comment) {
    return looksLikeRequest(comment.text);
  });
}
