const allowedTags = new Set([
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "ul",
  "ol",
  "li",
  "code",
  "pre",
  "blockquote",
  "h3",
  "h4",
  "span"
]);

function dropDangerousBlocks(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
    .replace(/<object[\s\S]*?<\/object>/gi, "")
    .replace(/<embed[^>]*>/gi, "")
    .replace(/<link[^>]*>/gi, "")
    .replace(/<meta[^>]*>/gi, "");
}

function rebuildTag(whole: string, rawName: string): string {
  const name = rawName.toLowerCase();

  if (!allowedTags.has(name)) {
    return "";
  }

  if (whole.startsWith("</")) {
    return "</" + name + ">";
  }

  if (name === "br") {
    return "<br />";
  }

  return "<" + name + ">";
}

export function keepSafeHtml(html: string): string {
  return dropDangerousBlocks(html).replace(/<\/?([a-zA-Z0-9]+)[^>]*>/g, rebuildTag).trim();
}

export function readPlainText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|h[1-6]|blockquote)>/gi, "\n")
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

const inlineTags = new Set(["strong", "b", "em", "i", "u", "code", "br", "span"]);

function rebuildInlineTag(whole: string, rawName: string): string {
  const name = rawName.toLowerCase();

  if (!inlineTags.has(name)) {
    return "";
  }

  if (whole.startsWith("</")) {
    return "</" + name + ">";
  }

  if (name === "br") {
    return " ";
  }

  return "<" + name + ">";
}

export function keepInlineHtml(html: string): string {
  return dropDangerousBlocks(html)
    .replace(/<\/?([a-zA-Z0-9]+)[^>]*>/g, rebuildInlineTag)
    .replace(/\s+/g, " ")
    .trim();
}
