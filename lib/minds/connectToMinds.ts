import { createMindsClient } from "@animocabrands/minds-client-lib";
import type { Result } from "@/types/result";
import { fail, succeed } from "@/types/result";
import { readEnvKey } from "@/lib/errors/readEnvKey";

export type MindsClient = ReturnType<typeof createMindsClient>;

export function connectToMinds(): Result<MindsClient> {
  const key = readEnvKey("MINDS_BUILDER_API_KEY");
  if (!key.ok) {
    return fail(key.failure);
  }

  try {
    const client = createMindsClient({ builderApiKey: key.value });
    return succeed(client);
  } catch {
    return fail({
      kind: "mind_unavailable",
      title: "Could not reach Minds",
      detail: "The Minds connection could not be opened. Check your key and try again.",
      canRetry: true
    });
  }
}
