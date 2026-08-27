import type { Comment } from "@/types/channel";

export interface MonthOfComments {
  month: string;
  comments: Comment[];
}

export function readMonthLabel(isoDate: string): string {
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) {
    return "unknown";
  }
  return parsed.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

export function splitByMonth(comments: Comment[]): MonthOfComments[] {
  const buckets = new Map<string, Comment[]>();

  for (const comment of comments) {
    const label = readMonthLabel(comment.publishedAt);
    const existing = buckets.get(label) ?? [];
    existing.push(comment);
    buckets.set(label, existing);
  }

  return Array.from(buckets.entries())
    .map(function toMonth(entry) {
      return { month: entry[0], comments: entry[1] };
    })
    .sort(function oldestFirst(left, right) {
      const leftDate = new Date(left.comments[0]?.publishedAt ?? 0).getTime();
      const rightDate = new Date(right.comments[0]?.publishedAt ?? 0).getTime();
      return leftDate - rightDate;
    });
}
