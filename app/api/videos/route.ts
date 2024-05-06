import supabase from "@/libs/supabase.helper";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type SortOrder = "pop" | "new" | "old";

const isSortOrder = (str: string): str is SortOrder =>
  str === "pop" || str === "new" || str === "old";

export async function GET(request: NextRequest) {
  const err = (type: string) =>
    NextResponse.json({ message: `error:${type}` }, { status: 400 });

  try {
    const { searchParams } = request.nextUrl;
    const qTake = searchParams.get("take");
    const qPage = searchParams.get("page");
    const qSort = searchParams.get("sort");
    const qSearch = searchParams.get("search");

    //takeはstringのみ
    if (qTake == null) return err("take is null");
    if (qSort != null && isSortOrder(qSort) == false) return err("sort is not valid");

    const page = parseInt(qPage || "0", 10);
    const take = parseInt(qTake, 10);
    const search = qSearch || null;
    //人気順、新しい順、古い順
    //デフォルトは人気順
    const sort: SortOrder | null = qSort || "pop";
    // let sortQuery: any;
    // switch (sort) {
    //   case "pop":
    //     sortQuery = {
    //       //視聴回数多い順
    //       viewCount: "desc",
    //     };
    //     break;
    //   case "new":
    //     sortQuery = {
    //       publishedAt: "desc",
    //     };
    //     break;
    //   case "old":
    //     sortQuery = {
    //       publishedAt: "asc",
    //     };
    //     break;
    // }

    const order = {
      pop: { colum: "viewCount", ascending: false },
      new: { colum: "publishedAt", ascending: false },
      old: { colum: "publishedAt", ascending: true }
    }[sort];

    let videos: {
      id: any;
      title: any;
    }[] | null
      = [];
    if (search) {
      const { data, error, count } = await supabase
        .from("Video")
        .select("id, title")
        .textSearch('video_title_description', search)
        .range(page * take, (page + 1) * take - 1)
        .order(order.colum, { ascending: order.ascending });
      videos = data;
      console.log(search)
    } else {
      const { data, error, count } = await supabase
        .from("Video")
        .select("id, title")
        .range(page * take, (page + 1) * take - 1)
        .order(order.colum, { ascending: order.ascending });
      videos = data;
    }

    // const videos = await prisma.video.findMany({
    //   take: take,
    //   skip: page * take,
    //   select: { id: true, title: true },
    //   orderBy: sortQuery,
    //   where: search ? {
    //     OR: [
    //       {
    //         title: {
    //           search: search
    //         }
    //       },
    //       {
    //         description: {
    //           search: search
    //         }
    //       }
    //     ]
    //   } : {},
    // });

    //BigInt対応のために仕方ないのだ :)
    // return NextResponse.json(JSONBI.serializable(videos), {
    //   status: 200,
    // });
    return NextResponse.json(videos, {
      status: 200,
    });
  } catch (error: any) {
    console.log(error);
    return err(error.toString());
  }
}
