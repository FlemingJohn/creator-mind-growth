export type AskDirection = "rising" | "steady" | "fading" | "new";

export interface Ask {
  topic: string;
  askCount: number;
  repeatAskerCount: number;
  direction: AskDirection;
  sampleQuotes: string[];
}
