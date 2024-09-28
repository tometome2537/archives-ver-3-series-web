import supabase from "@/libs/supabase.helper";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const videoData: {
    id: string;
    categoryChecked: boolean;
    title: string;
    publishedAt: string;
    viewCount: number;
    commentCount: number;
    description: string;
    musicTitle: string;
    musicArtist: string;
    subscriptionUrl: string;
    channelId: string;
    searchText: string;
    actorChecked: boolean;
    category: number;
    privacyStatus: string;
    duration: number;
  } = await request.json();

  const {
    data,
    error: videoError,
    count,
  } = await supabase
    .from("Video")
    .select("*", { count: "exact", head: true })
    .match({ id: videoData.id });

  // countがnullのときは0にする
  // countが0より大きい→データが存在する場合は追加をスキップする
  if (count ?? 0 > 0)
    return NextResponse.json({ status: 200, statusText: "already added." });

  // 新しいデータを追加する
  const { error } = await supabase.from("Video").insert(videoData);

  // 失敗してないなら続ける
  if (error != null) {
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

  return NextResponse.json({ status: 200, statusText: "success" });
}
