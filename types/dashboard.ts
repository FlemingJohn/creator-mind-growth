import type { Ask } from "./ask";
import type { Channel } from "./channel";
import type { Call, TrackRecord } from "./call";

export interface DashboardData {
  channel: Channel;
  mindName: string;
  nextCall: Call | null;
  trackRecord: TrackRecord;
  asks: Ask[];
  checkedAt: string;
}
