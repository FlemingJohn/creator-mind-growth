export function askForNextCall(): string {
  return [
    "Based on everything you remember about this channel, pick one video they should make next.",
    "",
    "Pick the thing viewers are asking for most, and say why in plain words a person would understand.",
    "Use real numbers from what I sent you.",
    "",
    "Reply in exactly this shape and nothing else:",
    "",
    "TITLE: the video title you suggest",
    "REASON: two short sentences saying why, using counts",
    "RISK: one word, low or medium or high",
    "UPSIDE: one word, low or medium or high"
  ].join("\n");
}
