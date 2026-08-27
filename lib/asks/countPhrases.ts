import type { Comment } from "@/types/channel";
import { stopWords } from "./stopWords";

export interface PhraseCount {
  phrase: string;
  askerIds: Set<string>;
  repeatAskerIds: Set<string>;
  quotes: string[];
}

export function splitIntoWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter(function keepUseful(word) {
      return word.length > 2 && !stopWords.has(word);
    });
}

export function buildPhrases(words: string[]): string[] {
  const phrases: string[] = [];
  for (let index = 0; index < words.length; index = index + 1) {
    phrases.push(words[index]);
    if (index + 1 < words.length) {
      phrases.push(`${words[index]} ${words[index + 1]}`);
    }
  }
  return phrases;
}

export function countPhrases(comments: Comment[]): Map<string, PhraseCount> {
  const counts = new Map<string, PhraseCount>();
  const seenByAsker = new Map<string, Set<string>>();

  for (const comment of comments) {
    const phrases = new Set(buildPhrases(splitIntoWords(comment.text)));

    for (const phrase of phrases) {
      const existing = counts.get(phrase) ?? {
        phrase,
        askerIds: new Set<string>(),
        repeatAskerIds: new Set<string>(),
        quotes: []
      };

      const alreadyAsked = seenByAsker.get(comment.authorChannelId) ?? new Set<string>();
      if (alreadyAsked.has(phrase)) {
        existing.repeatAskerIds.add(comment.authorChannelId);
      }
      alreadyAsked.add(phrase);
      seenByAsker.set(comment.authorChannelId, alreadyAsked);

      existing.askerIds.add(comment.authorChannelId);
      if (existing.quotes.length < 4 && comment.text.length < 220) {
        existing.quotes.push(comment.text.trim());
      }
      counts.set(phrase, existing);
    }
  }

  return counts;
}
