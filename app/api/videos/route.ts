import prisma from "@/libs/prisma.helper";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const err = NextResponse.json({ message: "error" }, { status: 400 });

  try {
    const query = request.nextUrl.searchParams;
    const qTake = query.get("take");
    const qSort = query.get("sort");
    //takeはstringのみ
    if (qTake == null) return err;
    if (qSort != null && qSort != "pop" && qSort != "new" && qSort != "old")
      return err;

    const skip = parseInt(query.get("skip") || "0");
    const take = parseInt(qTake);
    //人気順、新しい順、古い順
    //デフォルトは人気順
    const sort: "pop" | "new" | "old" | null = qSort || "pop";
    let sortQuery: any;
    switch (sort) {
      case "pop":
        sortQuery = {
          //視聴回数多い順
          viewCount: "desc",
        };
        break;
      case "new":
        sortQuery = {
          publishedAt: "desc",
        };
        break;
      case "old":
        sortQuery = {
          publishedAt: "asc",
        };
        break;
    }

    const videos = await prisma.video.findMany({
      take: take,
      skip,
      select: { id: true, title: true },
      orderBy: sortQuery,
      where: {
        channelId: "UCBF7RSsYL2di2jc-RqXIBcA",
      },
    });

    //BigInt対応のために仕方ないのだ :)
    // return NextResponse.json(JSONBI.serializable(videos), {
    //   status: 200,
    // });
    return NextResponse.json(videos, {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return err;
  }
}
