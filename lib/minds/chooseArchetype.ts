const fallbackArchetype = "mastermind";

export function chooseArchetype(): string {
  const wanted = process.env.MINDS_ARCHETYPE;
  if (typeof wanted === "string" && wanted.trim().length > 0) {
    return wanted.trim();
  }
  return fallbackArchetype;
}
