import { google, } from "googleapis";
import { youtube_v3 } from "googleapis/build/src/apis/youtube/v3";

interface PlaylistItemList {
    status: number;
    statusText: string;
    result: youtube_v3.Schema$PlaylistItem[]
}

export const getPlaylistItems = async (playlistId: string): Promise<PlaylistItemList> => {
    const part = ["id", "snippet", "status", "contentDetails"]
    const maxResults = 50;
    const result: youtube_v3.Schema$PlaylistItem[] = [];
    let nextPageToken = undefined;

    const youtube = google.youtube({
        version: "v3",
        auth: process.env["GOOGLE_API_KEY"] ?? "",
    });

    while (true) {
        const response: {
            status: number,
            statusText: string,
            data: {
                items?:
                youtube_v3.Schema$PlaylistItem[],
                nextPageToken?: string | null
            },
        } = await youtube.playlistItems.list({
            part: part,
            "maxResults": maxResults,
            "pageToken": nextPageToken ?? undefined,
            "playlistId": playlistId,
        });

        // resultに保存
        if (response.data.items != null) {
            result.push(...response.data.items)
        }

        // ネクストページトークンを保存
        nextPageToken = response.data.nextPageToken;
        if (nextPageToken == null) {
            return {
                status: response.status,
                statusText: response.statusText,
                result: result
            };
        }
    }
};