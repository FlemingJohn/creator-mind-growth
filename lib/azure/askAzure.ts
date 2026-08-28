import type { Result } from "@/types/result";
import { fail, succeed } from "@/types/result";
import { describeFailure } from "@/lib/errors/describeFailure";

const defaultApiVersion = "2025-01-01-preview";
const answerRoom = 700;

interface ChatShape {
  choices?: Array<{ message?: { content?: string } }>;
}

function readSetting(names: string[]): string {
  for (const name of names) {
    const value = process.env[name];
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }
  return "";
}

function readEndpoint(): string {
  return readSetting(["AZURE_OPENAI_ENDPOINT"]).replace(/\/+$/, "");
}

function readApiKey(): string {
  return readSetting(["AZURE_OPENAI_API_KEY"]);
}

function readDeployment(): string {
  return readSetting(["AZURE_OPENAI_DEPLOYMENT_NAME", "AZURE_OPENAI_DEPLOYMENT"]);
}

function readApiVersion(): string {
  return readSetting(["AZURE_API_VERSION", "AZURE_OPENAI_API_VERSION"]) || defaultApiVersion;
}

function usesNewRoute(endpoint: string): boolean {
  return endpoint.endsWith("/openai/v1");
}

function buildAddress(endpoint: string, deployment: string): string {
  if (usesNewRoute(endpoint)) {
    return endpoint + "/chat/completions";
  }
  return endpoint + "/openai/deployments/" + deployment + "/chat/completions?api-version=" + readApiVersion();
}

function buildBody(endpoint: string, deployment: string, question: string): string {
  const messages = [
    {
      role: "system",
      content:
        "You look after one YouTube creator. Answer only in the shape the person asks for, using the counts they give you."
    },
    { role: "user", content: question }
  ];

  if (usesNewRoute(endpoint)) {
    return JSON.stringify({ model: deployment, messages, max_completion_tokens: answerRoom });
  }

  return JSON.stringify({ messages, max_tokens: answerRoom });
}

export function canAskAzure(): boolean {
  return readEndpoint().length > 0 && readApiKey().length > 0 && readDeployment().length > 0;
}

export async function askAzure(question: string): Promise<Result<string>> {
  if (!canAskAzure()) {
    return fail(describeFailure("missing_key"));
  }

  const endpoint = readEndpoint();
  const deployment = readDeployment();
  const apiKey = readApiKey();

  let response: Response;

  try {
    response = await fetch(buildAddress(endpoint, deployment), {
      method: "POST",
      headers: {
        Authorization: "Bearer " + apiKey,
        "api-key": apiKey,
        "Content-Type": "application/json"
      },
      body: buildBody(endpoint, deployment, question),
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
