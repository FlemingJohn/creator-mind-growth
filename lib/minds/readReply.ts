import { dropEmptyTags, keepInlineHtml, readPlainText } from "./keepSafeHtml";
import { splitIntoBlocks } from "./splitIntoBlocks";

function readLabelName(text: string): string {
  const found = text.match(/^\s*([A-Za-z][A-Za-z ]{1,18}):/);
  if (!found) {
    return "";
  }
  return found[1].trim().toUpperCase();
}

function readTextAfterLabel(text: string): string {
  const colonAt = text.indexOf(":");
  if (colonAt < 0) {
    return "";
  }
  return text.slice(colonAt + 1).trim();
}

function dropLabelFromHtml(html: string, label: string): string {
  const pattern = new RegExp(label + "\\s*:", "i");
  return html.replace(pattern, "");
}

export function readLabelled(reply: string, label: string): string {
  const wanted = label.toUpperCase();

  for (const block of splitIntoBlocks(reply)) {
    if (readLabelName(block.text) === wanted) {
      return readTextAfterLabel(block.text);
    }
  }

  return "";
}

export function readLabelledHtml(reply: string, label: string, nextLabels: string[]): string {
  const wanted = label.toUpperCase();
  const stops = nextLabels.map(function toUpper(name) {
    return name.toUpperCase();
  });

  const collected: string[] = [];
  let collecting = false;

  for (const block of splitIntoBlocks(reply)) {
    const name = readLabelName(block.text);

    if (name === wanted) {
      collecting = true;
      const opening = keepInlineHtml(dropLabelFromHtml(block.html, label));
      if (readPlainText(opening).length > 0) {
        collected.push(opening);
      }
      continue;
    }

    if (collecting && name.length > 0) {
      if (stops.length === 0 || stops.includes(name)) {
        break;
      }
    }

    if (collecting) {
      const safe = keepInlineHtml(block.html);
      if (readPlainText(safe).length > 0) {
        collected.push(safe);
      }
    }
  }

  return dropEmptyTags(collected.join(" ")).replace(/\s+/g, " ").trim();
}

export function readWordChoice(reply: string, label: string, allowed: string[]): string {
  const raw = readLabelled(reply, label).toLowerCase();

  const match = allowed.find(function isMentioned(option) {
    return raw.includes(option);
  });

  return match ?? allowed[0];
}
