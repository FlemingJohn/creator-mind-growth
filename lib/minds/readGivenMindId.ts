export function readGivenMindId(): string {
  const given = process.env.MINDS_MIND_ID;
  if (typeof given === "string" && given.trim().length > 0) {
    return given.trim();
  }
  return "";
}
