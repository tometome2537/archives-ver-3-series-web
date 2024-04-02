import "@/libs/supabase.count";
import supabase from "@/libs/supabase.helper";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const err = NextResponse.json({ message: "error" }, { status: 400 });

  try {
    const { searchParams } = request.nextUrl;
    const qSearch = searchParams.get("search");
    const search = qSearch || null;

    const count = await supabase.count("Video");

    // if (error) throw error;

    return NextResponse.json(count, {
      status: 200,
    });

    // const count = await prisma.video.count({
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


  } catch (error) {
    console.log(error);
    return err;
  }
}