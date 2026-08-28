import type { Ask } from "./ask";
import type { Channel } from "./channel";
import type { Call, TrackRecord } from "./call";
import type { IdeaBoard } from "./trend";
import type { WeakSpots } from "./weakness";

export interface DashboardData {
  channel: Channel;
  mindName: string;
  nextCall: Call | null;
  trackRecord: TrackRecord;
  asks: Ask[];
  ideaBoard: IdeaBoard | null;
  weakSpots: WeakSpots | null;
  checkedAt: string;
}
