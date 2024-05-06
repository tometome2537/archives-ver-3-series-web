import "@/libs/supabase.count";
import supabase from "@/libs/supabase.helper";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const err = NextResponse.json({ message: "error" }, { status: 400 });

  try {
    const { searchParams } = request.nextUrl;
    const qSearch = searchParams.get("search");
    const search = qSearch || null;

    let foundCount = 0;
    if (search) {
      //TODO: 検索用のインデックスを作成する必要あり
      //  CREATE OR REPLACE FUNCTION video_title_description("Video")
      //    RETURNS text AS $$
      //      SELECT $1.title || ' ' || $1.description;
      //    $$ LANGUAGE SQL;
      //
      //    CREATE INDEX video_title_description_idx ON "Video"
      //    USING GIN(to_tsvector("Video", title || ' ' || description));
      const { data, error, count } = await supabase
        .from("Video")
        .select('*', { count: 'exact', head: true })
        .textSearch('video_title_description', search);
      foundCount = count || 0;
    } else {
      const { data, error, count } = await supabase
        .from("Video")
        .select('*', { count: 'exact', head: true });
      foundCount = count || 0;
    }

    return NextResponse.json(foundCount, {
      status: 200,
    });

  } catch (error) {
    console.log(error);
    return err;
  }
}