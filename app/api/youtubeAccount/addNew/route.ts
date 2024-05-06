import { getChannelDetail } from "@/libs/YT/youtube.helper";
import supabase from "@/libs/supabase.helper";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const qChannelId = searchParams.get("channelId");
    if (qChannelId == null) return NextResponse.json({ error: "channelId is null" });

    const items = await getChannelDetail(qChannelId);
    if (items == undefined) return NextResponse.json({ error: "channel was not found" });

    const accountData: {
        "id": string,
        "active": boolean,
        "thumbnailsMediumUrl": string,
        "title": string,
        "topic": boolean,
        "unsubscribedTrailerVideoId": string | null,
        "hiddenSubscriberCount": boolean,
        "subscriberCount": number,
        "viewCount": number,
        "lastUpdated": string,
        "userName": string,
        "relatedPlaylistsUploads": string,
        "videoCountFromYTApi": number
    } = {
        "id": qChannelId,
        "active": false,
        "thumbnailsMediumUrl": items[0].snippet?.thumbnails?.medium?.url || "",
        "title": items[0].snippet?.title || "",
        "topic": (items[0].snippet?.title || "").includes(" - Topic"),
        "unsubscribedTrailerVideoId": items[0].brandingSettings?.channel?.unsubscribedTrailer || null,
        "hiddenSubscriberCount": items[0].statistics?.hiddenSubscriberCount ?? false,
        "subscriberCount": parseInt(items[0].statistics?.subscriberCount ?? "0"),
        "viewCount": parseInt(items[0].statistics?.viewCount ?? "0"),
        "lastUpdated": "1970/01/01 00:00:00",
        "userName": items[0].snippet?.customUrl ?? "",
        "relatedPlaylistsUploads": "UU" + qChannelId.substring(2),
        "videoCountFromYTApi": parseInt(items[0].statistics?.videoCount ?? "9")
    }

    const { data, error: videoError, count } = await supabase
        .from("YouTubeAccount")
        .select('*', { count: 'exact', head: true })
        .match({ id: accountData.id })

    // countがnullのときは0にする
    // countが0より大きい→データが存在する場合は追加をスキップする
    if (count ?? 0 > 0) return NextResponse.json({ status: 200, statusText: "channel already added." });

    // 新しいデータを追加する
    const { error } = await supabase.from("YouTubeAccount").insert(accountData);

    // 失敗してないなら続ける
    if (error != null) {
        // 失敗したら即エラーを吐く
        return NextResponse.json({
            status: error.code,
            statusText: error.message,
            details: {
                error: {
                    details: error.details,
                    hint: error.hint
                }
            }
        });
    }

    return NextResponse.json({ status: 200, statusText: "success" });
}
