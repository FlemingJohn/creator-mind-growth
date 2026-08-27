import type { Result } from "@/types/result";
import { fail, succeed } from "@/types/result";
import { describeFailure } from "@/lib/errors/describeFailure";

const baseAddress = "https://www.googleapis.com/youtube/v3";

export async function callYouTube<Shape>(
  path: string,
  params: Record<string, string>,
  apiKey: string
): Promise<Result<Shape>> {
  const query = new URLSearchParams({ ...params, key: apiKey });

  let response: Response;
  try {
    response = await fetch(`${baseAddress}/${path}?${query.toString()}`, {
      headers: { Accept: "application/json" },
      cache: "no-store"
    });
  } catch {
    return fail(describeFailure("youtube_unavailable"));
  }

  if (response.status === 403) {
    const body = await response.text();
    if (body.includes("quotaExceeded") || body.includes("rateLimitExceeded")) {
      return fail(describeFailure("youtube_quota_spent"));
    }
    return fail(describeFailure("missing_key"));
  }

  if (response.status === 404) {
    return fail(describeFailure("channel_not_found"));
  }

  if (!response.ok) {
    return fail(describeFailure("youtube_unavailable"));
  }

  try {
    const parsed = (await response.json()) as Shape;
    return succeed(parsed);
  } catch {
    return fail(describeFailure("youtube_unavailable"));
  }
}
