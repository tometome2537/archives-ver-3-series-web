import prisma from "@/libs/prisma.helper";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const err = NextResponse.json({ message: "error" }, { status: 400 });

  const query = request.nextUrl.searchParams;
  const qSearch = query.get("search");
  const search = qSearch || null;

  try {
    const count = await prisma.video.count({
      where: search ? {
        OR: [
          {
            title: {
              search: search
            }
          },
          {
            description: {
              search: search
            }
          }
        ]
      } : {},
    });

    return NextResponse.json(count, {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return err;
  }
}