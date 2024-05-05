import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    return NextResponse.json({ message: "error" }, { status: 400 });
    // const err = (type: string) =>
    //     NextResponse.json({ message: `error:${type}` }, { status: 400 });

    // const youtubeAccount = await supabase.from("YouTubeAccount").select("")

    // try {
    //     const { searchParams } = request.nextUrl;
    //     const qTake = searchParams.get("take");
    //     const qPage = searchParams.get("page");
    //     const qSort = searchParams.get("sort");
    //     const qSearch = searchParams.get("search");

    //     //takeはstringのみ
    //     if (qTake == null) return err("take is null");
    //     if (qSort != null && isSortOrder(qSort) == false) return err("sort is not valid");

    //     const page = parseInt(qPage || "0", 10);
    //     const take = parseInt(qTake, 10);
    //     const search = qSearch || null;
    //     //人気順、新しい順、古い順
    //     //デフォルトは人気順
    //     const sort: SortOrder | null = qSort || "pop";

    //     let videos: {
    //         id: any;
    //         title: any;
    //     }[] | null
    //         = [];
    //     if (search) {
    //         const { data, error, count } = await supabase
    //             .from("Video")
    //             .select("id, title")
    //             .textSearch('video_title_description', search)
    //             .range(page * take, (page + 1) * take - 1)
    //             .order(order.colum, { ascending: order.ascending });
    //         videos = data;
    //         console.log(search)
    //     } else {
    //         const { data, error, count } = await supabase
    //             .from("Video")
    //             .select("id, title")
    //             .range(page * take, (page + 1) * take - 1)
    //             .order(order.colum, { ascending: order.ascending });
    //         videos = data;
    //     }
    //     return NextResponse.json(videos, {
    //         status: 200,
    //     });
    // } catch (error: any) {
    //     console.log(error);
    //     return err(error.toString());
    // }
}
