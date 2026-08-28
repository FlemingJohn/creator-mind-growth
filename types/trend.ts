export interface NicheVideo {
  videoId: string;
  title: string;
  channelTitle: string;
  publishedAt: string;
  viewCount: number;
}

export interface NicheTopic {
  topic: string;
  videoCount: number;
  topViewCount: number;
  topTitle: string;
  coveredByCreator: number;
}

export type IdeaKind = "signal" | "wave" | "new";

export interface Idea {
  kind: IdeaKind;
  title: string;
  reason: string;
  risk: string;
  upside: string;
  source: string;
}

export interface IdeaBoard {
  ideas: Idea[];
  gaps: NicheTopic[];
  searchedAt: string;
}
