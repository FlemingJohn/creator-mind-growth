export interface Channel {
  channelId: string;
  title: string;
  subscriberCount: number;
  videoCount: number;
  uploadsPlaylistId: string;
  thumbnailUrl: string;
}

export interface Video {
  videoId: string;
  title: string;
  publishedAt: string;
  viewCount: number;
}

export interface Comment {
  commentId: string;
  videoId: string;
  authorName: string;
  authorChannelId: string;
  text: string;
  likeCount: number;
  publishedAt: string;
}
