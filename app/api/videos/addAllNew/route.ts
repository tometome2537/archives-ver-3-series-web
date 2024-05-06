import { getPlaylistItems } from "@/libs/YT/youtube.helper";
import { formatDate } from "@/libs/supabase.date";
import supabase from "@/libs/supabase.helper";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { data: channels, error } = await supabase.from("YouTubeAccount").select("id, relatedPlaylistsUploads");
    const playlists = channels?.filter(x => x.id == "UCZx7esGXyW6JXn98byfKEIA");

    if (playlists == undefined) return NextResponse.json(error);

    for (let i = 0; i < playlists.length; i++) {
        const { relatedPlaylistsUploads } = playlists[i];
        const { result: data, status, statusText } = await getPlaylistItems(relatedPlaylistsUploads);

        if (status != 200) continue;

        for (let j = 0; j < data.length; j++) {
            const item = data[j];
            const videoData = {
                "id": item.snippet?.resourceId?.videoId ?? "",
                "categoryChecked": false,
                "title": item.snippet?.title ?? "",
                "publishedAt": formatDate(item.contentDetails?.videoPublishedAt ?? ""),
                "viewCount": 0,
                "commentCount": 0,
                "description": item.snippet?.description ?? "",
                "musicTitle": "",
                "musicArtist": "",
                "subscriptionUrl": "",
                "channelId": item.snippet?.channelId ?? "",
                "searchText": "",
                "actorChecked": false,
                "category": -1,
                "privacyStatus": item.status?.privacyStatus ?? "undefined",
                "duration": 0,
            }

            const { error } = await supabase.from("Video").insert(videoData);
            if (error) {
                return NextResponse.json(error);
            }
        }
    }

    return NextResponse.json({ status: "success" });
}
