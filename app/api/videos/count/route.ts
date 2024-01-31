import prisma from "@/libs/prisma.helper";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const err = NextResponse.json({ message: "error" }, { status: 400 });

  try {
    const count = await prisma.video.count({
      where: {
        channelId: "UCBF7RSsYL2di2jc-RqXIBcA",
      },
    });

    // });
    return NextResponse.json(count, {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return err;
  }

  // return
}

/*

import prisma from "@/libs/prisma.helper";
import { NextApiRequest, NextApiResponse } from "next";

export default async function GET(req: NextApiRequest, res: NextApiResponse) {
  const err = res.status(400).end();

  try {
    const qSkip = req.query["skip"];
    const qTake = req.query["take"];
    //skipはstringかundefined
    if (Array.isArray(qSkip)) return err;
    //takeはstringのみ
    if (typeof qTake != "string") return err;
    const skip = parseInt(qSkip?.toString() || "0");
    const take = parseInt(qTake?.toString());

    const videos = await prisma.video.findMany({
      take: take,
      skip,
      select: { id: true, title: true },
    });

    return res.status(200).json(videos);
  } catch (error) {
    console.log(error);
    return err;
  }
}
*/
