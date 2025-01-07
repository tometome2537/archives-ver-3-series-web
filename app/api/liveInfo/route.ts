import { NextResponse } from "next/server";

export async function GET() {
    const response = await fetch(
        "https://calendar.google.com/calendar/ical/0acd49bb41caff2484e929b9be0fd18371e9abfafc71b8ef50f0c5af2b4d50c8%40group.calendar.google.com/public/basic.ics",
        {
            cache: "no-store",
        },
    );
    const data = await response.text();

    return new NextResponse(data, {
        headers: {
            "Content-Type": "text/calendar; charset=utf-8",
        },
    });
}
