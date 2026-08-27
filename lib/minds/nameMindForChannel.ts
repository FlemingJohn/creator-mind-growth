export function nameMindForChannel(channelTitle: string, channelId: string): string {
  const cleaned = channelTitle
    .normalize("NFKD")
    .replace(/[^A-Za-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 24);

  const tail = channelId.slice(-6);

  if (cleaned.length === 0) {
    return `cmg-${tail}`;
  }

  return `cmg-${cleaned}-${tail}`;
}

export function nameAliasForChannel(channelId: string): string {
  return `cmg-${channelId.toLowerCase().replace(/[^a-z0-9-]/g, "").slice(-20)}`;
}

export function nameFreshAliasForChannel(channelId: string): string {
  const stamp = Date.now().toString(36);
  return `${nameAliasForChannel(channelId)}-fresh-${stamp}`;
}
