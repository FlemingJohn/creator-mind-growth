import type { Failure, Result } from "@/types/result";
import { fail, succeed } from "@/types/result";
import { describeFailure } from "@/lib/errors/describeFailure";

interface ApiShape<Value> {
  ok: boolean;
  value?: Value;
  failure?: Failure;
}

export async function callApi<Value>(
  path: string,
  method: "GET" | "POST",
  body?: unknown
): Promise<Result<Value>> {
  let response: Response;

  try {
    response = await fetch(path, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined
    });
  } catch {
    return fail(describeFailure("unknown"));
  }

  let parsed: ApiShape<Value>;

  try {
    parsed = (await response.json()) as ApiShape<Value>;
  } catch {
    return fail(describeFailure("unknown"));
  }

  if (!parsed.ok || parsed.value === undefined) {
    return fail(parsed.failure ?? describeFailure("unknown"));
  }

  return succeed(parsed.value);
}
