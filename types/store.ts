import type { Ask } from "./ask";
import type { Call } from "./call";
import type { Channel } from "./channel";
import type { MindHandle } from "./mind";

export interface ChannelRecord {
  channel: Channel;
  mind: MindHandle;
  calls: Call[];
  asks: Ask[];
  latestLesson: string | null;
  usualViewCount: number;
  checkedAt: string;
}

export interface Store {
  channels: Record<string, ChannelRecord>;
}
