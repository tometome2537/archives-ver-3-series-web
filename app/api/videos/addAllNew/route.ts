import { getPlaylistItems } from "@/libs/YT/youtube.helper";
import { formatDate } from "@/libs/supabase.date";
import supabase from "@/libs/supabase.helper";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { data: channels, error: chError } = await supabase
    .from("YouTubeAccount")
    .select("id, relatedPlaylistsUploads");
  const { searchParams } = request.nextUrl;
  const qChannelId = searchParams.get("channelId");
  // とりあえずぷらそにかのみ
  if (qChannelId == null) return NextResponse.json({ error: "error" });

  const playlists = channels?.filter((x) => x.id == qChannelId);

  // // 見つからなかった
  if (playlists == undefined) return NextResponse.json(chError);
  if (playlists.length == 0)
    return NextResponse.json({
      status: 200,
      statusText: "success",
      details: {
        message: "プレイリストが見つかりませんでした。",
      },
    });
  const addedVideos = [];

  // 各チャンネルの全動画が含まれている再生リストから新着動画を探す
  for (let i = 0; i < playlists.length; i++) {
    // プレイリストからすべての動画を取得する
    const { relatedPlaylistsUploads } = playlists[i];
    const { result, status, statusText } = await getPlaylistItems(
      relatedPlaylistsUploads,
    );

    // 失敗してたら次のチャンネルへ
    if (status != 200) continue;

    for (let j = 0; j < result.length; j++) {
      const item = result[j];

      const {
        data,
        error: videoError,
        count,
      } = await supabase
        .from("Video")
        .select("*", { count: "exact", head: true })
        .match({ id: item.snippet?.resourceId?.videoId });

      // countがnullのときは0にする
      // countが0より大きい→データが存在する場合は追加をスキップする
      if (count ?? 0 > 0) continue;

      // 必要なデータをよしなに作成
      const videoData = {
        id: item.snippet?.resourceId?.videoId ?? "",
        categoryChecked: false,
        title: item.snippet?.title ?? "",
        publishedAt: formatDate(item.contentDetails?.videoPublishedAt ?? ""),
        viewCount: 0,
        commentCount: 0,
        description: item.snippet?.description ?? "",
        musicTitle: "",
        musicArtist: "",
        subscriptionUrl: "",
        channelId: item.snippet?.channelId ?? "",
        searchText: "",
        actorChecked: false,
        category: -1,
        privacyStatus: item.status?.privacyStatus ?? "undefined",
        duration: 0,
      };

      // 新しいデータを追加する
      const { error } = await supabase.from("Video").insert(videoData);

      // 失敗してないなら続ける
      if (error == null) {
        addedVideos.push(videoData.id);
        continue;
      }

      // 失敗したら即エラーを吐く
      return NextResponse.json({
        status: error.code,
        statusText: error.message,
        details: {
          error: {
            details: error.details,
            hint: error.hint,
          },
        },
      });
    }
  }

  return NextResponse.json({
    status: 200,
    statusText: "success",
    details: addedVideos,
  });
}
