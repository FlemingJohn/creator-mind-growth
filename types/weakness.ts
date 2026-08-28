export type ComplaintKind =
  | "too fast"
  | "not deep enough"
  | "too long"
  | "misleading title"
  | "sound and picture"
  | "wrong or outdated"
  | "off topic";

export interface ComplaintQuote {
  text: string;
  videoId: string;
  videoTitle: string;
  likeCount: number;
}

export interface Complaint {
  kind: ComplaintKind;
  peopleCount: number;
  timesSaid: number;
  quotes: ComplaintQuote[];
  worstVideoTitle: string;
  worstVideoCount: number;
}

export interface WeakVideo {
  videoId: string;
  title: string;
  viewCount: number;
  usualViewCount: number;
  shortfall: number;
}

export interface WeakSpots {
  complaints: Complaint[];
  weakVideos: WeakVideo[];
  commentsRead: number;
  whatToStop: string | null;
  stopSaidBy: string | null;
}
