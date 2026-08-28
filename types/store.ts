import type { Ask } from "./ask";
import type { Call } from "./call";
import type { Channel, Video } from "./channel";
import type { MindHandle } from "./mind";
import type { IdeaBoard } from "./trend";
import type { WeakSpots } from "./weakness";

export interface ChannelRecord {
  channel: Channel;
  mind: MindHandle;
  calls: Call[];
  asks: Ask[];
  videos: Video[];
  ideaBoard: IdeaBoard | null;
  weakSpots: WeakSpots | null;
  latestLesson: string | null;
  usualViewCount: number;
  checkedAt: string;
}

export interface Store {
  channels: Record<string, ChannelRecord>;
}
