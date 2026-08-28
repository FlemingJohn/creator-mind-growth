import type { Result } from "@/types/result";
import { fail, succeed } from "@/types/result";
import { describeFailure } from "@/lib/errors/describeFailure";

const defaultApiVersion = "2024-10-21";

interface ChatShape {
  choices?: Array<{ message?: { content?: string } }>;
}

export function canAskAzure(): boolean {
  return (
    readSetting("AZURE_OPENAI_ENDPOINT").length > 0 &&
    readSetting("AZURE_OPENAI_API_KEY").length > 0 &&
    readSetting("AZURE_OPENAI_DEPLOYMENT").length > 0
  );
}

function readSetting(name: string): string {
  const value = process.env[name];
  if (typeof value !== "string") {
    return "";
  }
  return value.trim();
}

export async function askAzure(question: string): Promise<Result<string>> {
  if (!canAskAzure()) {
    return fail(describeFailure("missing_key"));
  }

  const endpoint = readSetting("AZURE_OPENAI_ENDPOINT").replace(/\/+$/, "");
  const deployment = readSetting("AZURE_OPENAI_DEPLOYMENT");
  const apiKey = readSetting("AZURE_OPENAI_API_KEY");
  const apiVersion = readSetting("AZURE_OPENAI_API_VERSION") || defaultApiVersion;

  const address =
    endpoint + "/openai/deployments/" + deployment + "/chat/completions?api-version=" + apiVersion;

  let response: Response;

  try {
    response = await fetch(address, {
      method: "POST",
      headers: { "api-key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content:
              "You look after one YouTube creator. Answer only in the shape the person asks for, using the counts they give you."
          },
          { role: "user", content: question }
        ],
        temperature: 0.4,
        max_tokens: 500
      }),
      cache: "no-store"
    });
  } catch {
    return fail(describeFailure("mind_unavailable"));
  }

  if (response.status === 401 || response.status === 403) {
    return fail(describeFailure("missing_key"));
  }

  if (!response.ok) {
    return fail(describeFailure("mind_unavailable"));
  }

  let parsed: ChatShape;

  try {
    parsed = (await response.json()) as ChatShape;
  } catch {
    return fail(describeFailure("mind_reply_unreadable"));
  }

  const text = parsed.choices?.[0]?.message?.content ?? "";

  if (text.trim().length === 0) {
    return fail(describeFailure("mind_reply_unreadable"));
  }

  return succeed(text.trim());
}
