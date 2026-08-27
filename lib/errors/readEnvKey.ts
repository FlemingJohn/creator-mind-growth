import type { Result } from "@/types/result";
import { fail, succeed } from "@/types/result";
import { describeFailure } from "./describeFailure";

export function readEnvKey(name: string): Result<string> {
  const value = process.env[name];
  if (typeof value !== "string" || value.trim().length === 0) {
    return fail(describeFailure("missing_key"));
  }
  return succeed(value.trim());
}
