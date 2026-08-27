export function stripTags(text: string): string {
  return text
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|h[1-6])>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function readLabelName(line: string): string {
  const found = line.match(/^\s*([A-Za-z][A-Za-z ]{1,18}):/);
  if (!found) {
    return "";
  }
  return found[1].trim().toUpperCase();
}

function readTextAfterLabel(line: string): string {
  const colonAt = line.indexOf(":");
  if (colonAt < 0) {
    return "";
  }
  return line.slice(colonAt + 1).trim();
}

export function readLabelled(text: string, label: string): string {
  const wanted = label.toUpperCase();

  for (const line of stripTags(text).split(/\r?\n/)) {
    if (readLabelName(line) === wanted) {
      return readTextAfterLabel(line);
    }
  }

  return "";
}

export function readMultiLineLabelled(text: string, label: string, nextLabels: string[]): string {
  const wanted = label.toUpperCase();
  const stops = nextLabels.map(function toUpper(name) {
    return name.toUpperCase();
  });

  const collected: string[] = [];
  let collecting = false;

  for (const line of stripTags(text).split(/\r?\n/)) {
    const name = readLabelName(line);

    if (name === wanted) {
      collecting = true;
      const opening = readTextAfterLabel(line);
      if (opening.length > 0) {
        collected.push(opening);
      }
      continue;
    }

    if (collecting && name.length > 0) {
      if (stops.length === 0 || stops.includes(name)) {
        break;
      }
    }

    if (collecting && line.trim().length > 0) {
      collected.push(line.trim());
    }
  }

  return collected.join(" ").trim();
}

export function readWordChoice(text: string, label: string, allowed: string[]): string {
  const raw = readLabelled(text, label).toLowerCase();

  const match = allowed.find(function isMentioned(option) {
    return raw.includes(option);
  });

  return match ?? allowed[0];
}
