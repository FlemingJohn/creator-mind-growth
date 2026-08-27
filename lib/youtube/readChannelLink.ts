import type { Result } from "@/types/result";
import { fail, succeed } from "@/types/result";
import { describeFailure } from "@/lib/errors/describeFailure";

export interface ChannelLink {
  lookupBy: "handle" | "id";
  value: string;
}

export function readChannelLink(rawLink: string): Result<ChannelLink> {
  const trimmed = rawLink.trim();
  if (trimmed.length === 0) {
    return fail(describeFailure("bad_channel_link"));
  }

  const handleOnly = trimmed.match(/^@([A-Za-z0-9._-]+)$/);
  if (handleOnly) {
    return succeed({ lookupBy: "handle", value: handleOnly[1] });
  }

  const channelId = trimmed.match(/channel\/(UC[A-Za-z0-9_-]{20,})/);
  if (channelId) {
    return succeed({ lookupBy: "id", value: channelId[1] });
  }

  const handleInLink = trimmed.match(/youtube\.com\/@([A-Za-z0-9._-]+)/);
  if (handleInLink) {
    return succeed({ lookupBy: "handle", value: handleInLink[1] });
  }

  const legacyName = trimmed.match(/youtube\.com\/(?:c|user)\/([A-Za-z0-9._-]+)/);
  if (legacyName) {
    return succeed({ lookupBy: "handle", value: legacyName[1] });
  }

  const bareId = trimmed.match(/^(UC[A-Za-z0-9_-]{20,})$/);
  if (bareId) {
    return succeed({ lookupBy: "id", value: bareId[1] });
  }

  return fail(describeFailure("bad_channel_link"));
}
