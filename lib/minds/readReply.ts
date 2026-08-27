export function readLabelled(text: string, label: string): string {
  const pattern = new RegExp(`^\s*${label}\s*:\s*(.+)$`, "im");
  const found = text.match(pattern);
  if (!found) {
    return "";
  }
  return found[1].trim();
}

export function readMultiLineLabelled(text: string, label: string, nextLabels: string[]): string {
  const stop = nextLabels.length > 0 ? `(?=^\s*(?:${nextLabels.join("|")})\s*:)` : "$";
  const pattern = new RegExp(`^\s*${label}\s*:\s*([\s\S]*?)${stop}`, "im");
  const found = text.match(pattern);
  if (!found) {
    return "";
  }
  return found[1].trim();
}

export function readWordChoice(text: string, label: string, allowed: string[]): string {
  const raw = readLabelled(text, label).toLowerCase();
  const match = allowed.find(function isMentioned(option) {
    return raw.includes(option);
  });
  return match ?? allowed[0];
}
