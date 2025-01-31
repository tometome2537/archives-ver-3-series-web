import { unescapeHtml } from "@/libs/unescapeHtml";
import { Box, Divider, Typography } from "@mui/material";
// import ical from "cal-parser";
import { Fragment, useEffect, useState } from "react";
import { useAppleMusic } from "@/contexts/AppleMusicContext";
import type { PlayerItem } from "../PlayerView";

type Event = {
    dtstart: {
        value: string; // ISO 8601 datetime string
    };
    dtstamp: string; // ISO 8601 datetime string
    uid: {
        value: string; // Unique identifier string
    };
    created: string; // ISO 8601 datetime string
    description: {
        value: string; // HTML content as a string
    };
    lastModified: string; // ISO 8601 datetime string
    location: {
        value: string; // Address or location details
    };
    sequence: {
        value: string; // Sequence number as a string
    };
    status: {
        value: "CONFIRMED" | "CANCELLED" | "TENTATIVE"; // Status of the event
    };
    summary: {
        value: string; // Event title or summary
    };
    transp: {
        value: "OPAQUE" | "TRANSPARENT"; // Transparency status
    };
};

type LiveInformationTabProps = {
    playerItem: PlayerItem | undefined;
};

export function LiveInformationTab(props: LiveInformationTabProps) {
    const [events, setEvents] = useState<Event[]>([]);
    const musicKit = useAppleMusic();

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch("api/liveInfo");
                const data = await response.text();
                // const parsedCal = ical.parseString(data);

                // setEvents(parsedCal.events);
            } catch (error) {
                console.error("Error fetching YouTube accounts:", error);
            }
        }

        fetchData();
    }, []);

    return (
        <Fragment>
            <button
                type="button"
                onClick={() => {
                    musicKit.instance?.authorize();
                }}
            >
                認証開始
            </button>
            <button
                type="button"
                onClick={() => {
                    musicKit.instance?.unauthorize();
                }}
            >
                認証解除
            </button>
            <br />
            認証{String(musicKit.instance?.isAuthorized)}
            <br />
            国コード{String(musicKit.instance?.storefrontCountryCode)}
            <br />
            サブスク加入の有無
            {String(!musicKit.instance?.previewOnly)}
            <br />
            {/* ↓ 画像のみ */}
            {/* <apple-music-artwork width="250"></apple-music-artwork> */}
            {/* ↓ 再生ボタン付き */}
            {/* <apple-music-artwork-lockup /> */}
            {/* <apple-music-card-player width="500"></apple-music-card-player>
            <apple-music-video-player></apple-music-video-player>
            <apple-music-playback-controls />
            <apple-music-progress></apple-music-progress>
            <apple-music-volume></apple-music-volume> */}
            んんん{JSON.stringify(props.playerItem)}
            <br />
            <button
                type="button"
                onClick={() => {
                    musicKit.instance?.setQueue({
                        album: "l.bwDIIkb",
                        startPlaying: true,
                    });
                    musicKit.instance?.play();
                    console.log(musicKit.instance?.nowPlayingItem);
                }}
            >
                future gazer 再生
            </button>
            <button
                type="button"
                onClick={() => {
                    musicKit.instance?.setQueue({
                        album: "l.t3Hwh4j",
                        startPlaying: true,
                    });
                    musicKit.instance?.play();
                    console.log(musicKit.instance?.nowPlayingItem);
                }}
            >
                いつのまに 再生
            </button>
            {events.map((x) => {
                return (
                    <Box
                        key={x.uid.value}
                        sx={{
                            border: "1px solid",
                            borderColor: "grey.400",
                            borderRadius: 1,
                            p: 2,
                            mb: 2,
                        }}
                    >
                        <Typography variant="h6">{x.summary.value}</Typography>
                        <Typography variant="body1">
                            {x.description.value.split("<br>").map((line) => (
                                <Typography key={line}>
                                    {unescapeHtml(
                                        line.replaceAll(/<[^>]+>/g, ""),
                                    )}
                                </Typography>
                            ))}
                        </Typography>
                    </Box>
                );
            })}
        </Fragment>
    );
}
