import { readPlainText } from "./keepSafeHtml";

export interface Block {
  html: string;
  text: string;
}

const separator = "|||CMGBLOCK|||";

export function splitIntoBlocks(reply: string): Block[] {
  const marked = reply
    .replace(/<\/(p|div|li|h[1-6]|blockquote)>/gi, separator)
    .replace(/<br\s*\/?>/gi, separator)
    .replace(/\r?\n/g, separator);

  const blocks: Block[] = [];

  for (const piece of marked.split(separator)) {
    const text = readPlainText(piece);
    if (text.length > 0) {
      blocks.push({ html: piece.trim(), text });
    }
  }

  return blocks;
}
