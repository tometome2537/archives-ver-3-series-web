import { google } from "googleapis";
import { youtube_v3 } from "googleapis/build/src/apis/youtube/v3";

interface PlaylistItemList {
  status: number;
  statusText: string;
  result: youtube_v3.Schema$PlaylistItem[];
}

interface VideoStatus {
  id: string;
  removedByTheUploader: "delete" | "undefined";
}

interface VideoShortStatus {
  id: string;
  short: boolean;
}

interface ChannelStatus {
  id: string;
  officialArtistChannel: boolean;
}

export const getPlaylistItems = async (
  playlistId: string,
): Promise<PlaylistItemList> => {
  const part = ["id", "snippet", "status", "contentDetails"];
  const maxResults = 50;
  const result: youtube_v3.Schema$PlaylistItem[] = [];
  let nextPageToken = undefined;

  const youtube = google.youtube({
    version: "v3",
    auth: process.env["GOOGLE_API_KEY"] ?? "",
  });

  while (true) {
    const response: {
      status: number;
      statusText: string;
      data: {
        items?: youtube_v3.Schema$PlaylistItem[];
        nextPageToken?: string | null;
      };
    } = await youtube.playlistItems.list({
      part: part,
      maxResults: maxResults,
      pageToken: nextPageToken ?? undefined,
      playlistId: playlistId,
    });

    // resultに保存
    if (response.data.items != null) {
      result.push(...response.data.items);
    }

    // ネクストページトークンを保存
    nextPageToken = response.data.nextPageToken;
    if (nextPageToken == null) {
      return {
        status: response.status,
        statusText: response.statusText,
        result: result,
      };
    }
  }
};

export const getChannelDetail = async (
  channelId: string,
): Promise<youtube_v3.Schema$Channel[]> => {
  const part = ["id", "snippet", "statistics", "brandingSettings"];

  const youtube = google.youtube({
    version: "v3",
    auth: process.env["GOOGLE_API_KEY"] ?? "",
  });

  const response: {
    status: number;
    statusText: string;
    data: {
      items?: youtube_v3.Schema$Channel[] | undefined;
    };
  } = await youtube.channels.list({
    part: part,
    id: [channelId],
  });

  return response.data.items ?? [];
};

export const checkDeletedVideo = async (
  videoIds: string[],
): Promise<VideoStatus[]> => {
  const result: VideoStatus[] = [];
  const chunkedVideoIds = chunkArray(videoIds, 10);
  chunkedVideoIds.forEach(async (x) => {
    const response = await fetch(
      `https://yt.lemnoslife.com/videos?part=status&id=${x.join(",")}`,
    );
    const data: {
      items: { id: string; status: { removedByTheUploader: boolean } }[];
    } = await response.json();

    const items = data.items;
    items.map((item) => {
      // 削除されてない場合はundefined
      const status = item.status.removedByTheUploader ? "delete" : "undefined";
      result.push({ id: item.id, removedByTheUploader: status });
    });
  });

  return result;
};

export const checkShortVideo = async (
  videoIds: string[],
): Promise<VideoShortStatus[]> => {
  const result: VideoShortStatus[] = [];
  const chunkedVideoIds = chunkArray(videoIds, 10);
  chunkedVideoIds.forEach(async (x) => {
    const response = await fetch(
      `https://yt.lemnoslife.com/videos?part=short&id=${x.join(",")}`,
    );
    const data: {
      items: { id: string; short: { available: boolean } }[];
    } = await response.json();

    const items = data.items;
    items.map((item) => {
      const status = item.short.available;
      result.push({ id: item.id, short: status });
    });
  });

  return result;
};

export const checkOfficialArtistChannel = async (
  channelIds: string[],
): Promise<ChannelStatus[]> => {
  const result: ChannelStatus[] = [];
  const chunkedChannelIds = chunkArray(channelIds, 10);
  chunkedChannelIds.forEach(async (x) => {
    const response = await fetch(
      `https://yt.lemnoslife.com/channels?part=approval&id=${x.join(",")}`,
    );
    const data: {
      items: { id: string; approval: string }[];
    } = await response.json();

    const items = data.items;
    items.map((item) => {
      const status = item.approval === "Official Artist Channel";
      result.push({ id: item.id, officialArtistChannel: status });
    });
  });

  return result;
};

export const getPlaylistList = async (
  channelIds: string[],
): Promise<youtube_v3.Schema$Playlist[]> => {
  const part = ["id", "snippet", "status", "contentDetails"];

  const youtube = google.youtube({
    version: "v3",
    auth: process.env["GOOGLE_API_KEY"] ?? "",
  });

  const chunkedChannelIds = chunkArray(channelIds, 50);
  const result: youtube_v3.Schema$Playlist[] = [];

  chunkedChannelIds.forEach(async (x) => {
    const response = await youtube.playlists.list({
      part: part,
      id: x,
    });

    if (response.data.items != undefined) {
      result.push(...response.data.items);
    }
  });

  return result;
};

export const getVideoList = async (
  videoIds: string[],
): Promise<youtube_v3.Schema$Video[]> => {
  const part = ["snippet", "statistics", "status"];

  const youtube = google.youtube({
    version: "v3",
    auth: process.env["GOOGLE_API_KEY"] ?? "",
  });

  const chunkedvideoIds = chunkArray(videoIds, 50);
  const result: youtube_v3.Schema$Video[] = [];

  chunkedvideoIds.forEach(async (x) => {
    const response = await youtube.videos.list({
      part: part,
      id: x,
    });

    if (response.data.items != undefined) {
      result.push(...response.data.items);
    }
  });

  return result;
};

export const getChannelList = async (
  videoIds: string[],
): Promise<youtube_v3.Schema$Channel[]> => {
  const part = ["snippet", "contentDetails", "statistics", "brandingSettings"];

  const youtube = google.youtube({
    version: "v3",
    auth: process.env["GOOGLE_API_KEY"] ?? "",
  });

  const chunkedvideoIds = chunkArray(videoIds, 50);
  const result: youtube_v3.Schema$Channel[] = [];

  chunkedvideoIds.forEach(async (x) => {
    const response = await youtube.channels.list({
      part: part,
      id: x,
    });

    if (response.data.items != undefined) {
      result.push(...response.data.items);
    }
  });

  return result;
};

function chunkArray(array: any[], chunkSize: number): any[] {
  const result: any[] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
}
