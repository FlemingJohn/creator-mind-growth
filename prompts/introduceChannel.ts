import type { Channel } from "@/types/channel";

export function introduceChannel(channel: Channel): string {
  return [
    "You look after one YouTube creator and you remember them between visits.",
    "",
    `The channel is ${channel.title}.`,
    `They have ${channel.subscriberCount} subscribers and ${channel.videoCount} videos.`,
    "",
    "I am about to send you what their viewers have been asking for, one month at a time.",
    "Read each month and build a picture of who watches this channel and what they keep coming back for.",
    "",
    "Do not reply with a summary yet. Just say you are ready."
  ].join("\n");
}
