import { useAppleMusic } from "@/contexts/AppleMusicContext";
import { unescapeHtml } from "@/libs/unescapeHtml";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import type { PlayerItem } from "../PlayerView";

// 型定義
type Event = {
    dtstart: {
        value: string;
    };
    dtstamp: string;
    uid: {
        value: string;
    };
    created: string;
    description: {
        value: string;
    };
    lastModified: string;
    location: {
        value: string;
    };
    sequence: {
        value: string;
    };
    status: {
        value: "CONFIRMED" | "CANCELLED" | "TENTATIVE";
    };
    summary: {
        value: string;
    };
    transp: {
        value: "OPAQUE" | "TRANSPARENT";
    };
};

type LiveInformationTabProps = {
    playerItem: PlayerItem | undefined;
};

// アルバム定数
const ALBUMS = {
    FUTURE_GAZER: "l.bwDIIkb",
    ITSU_NO_MANI: "l.t3Hwh4j",
};

// イベント表示コンポーネント
const EventCard = ({ event }: { event: Event }) => (
    <Paper
        elevation={2}
        sx={{
            border: "1px solid",
            borderColor: "grey.400",
            borderRadius: 1,
            p: 2,
            mb: 2,
        }}
    >
        <Typography variant="h6">{event.summary.value}</Typography>
        <Typography variant="body1">
            {event.description.value.split("<br>").map((line, index) => (
                <Typography key={`${event.uid.value}-line-${index}`}>
                    {unescapeHtml(line.replaceAll(/<[^>]+>/g, ""))}
                </Typography>
            ))}
        </Typography>
    </Paper>
);

// Apple Music操作コンポーネント
const AppleMusicControls = ({ musicKit }: { musicKit: any }) => {
    const playAlbum = (albumId: string) => {
        musicKit.instance?.setQueue({
            album: albumId,
            startPlaying: true,
        });
        musicKit.instance?.play();
    };

    return (
        <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12}>
                <Typography variant="h6">Apple Music認証</Typography>
            </Grid>
            <Grid item>
                <Button
                    variant="contained"
                    onClick={() => musicKit.instance?.authorize()}
                >
                    認証開始
                </Button>
            </Grid>
            <Grid item>
                <Button
                    variant="outlined"
                    onClick={() => musicKit.instance?.unauthorize()}
                >
                    認証解除
                </Button>
            </Grid>
            <Grid item xs={12}>
                <Typography>
                    認証状態: {String(musicKit.instance?.isAuthorized)}
                </Typography>
                <Typography>
                    国コード: {String(musicKit.instance?.storefrontCountryCode)}
                </Typography>
                <Typography>
                    サブスク加入: {String(!musicKit.instance?.previewOnly)}
                </Typography>
            </Grid>

            <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="h6">アルバム再生</Typography>
            </Grid>
            <Grid item>
                <Button
                    variant="contained"
                    onClick={() => playAlbum(ALBUMS.FUTURE_GAZER)}
                >
                    future gazer 再生
                </Button>
            </Grid>
            <Grid item>
                <Button
                    variant="contained"
                    onClick={() => playAlbum(ALBUMS.ITSU_NO_MANI)}
                >
                    いつのまに 再生
                </Button>
            </Grid>
        </Grid>
    );
};

export function LiveInformationTab(props: LiveInformationTabProps) {
    const [events, setEvents] = useState<Event[]>([]);
    const musicKit = useAppleMusic();

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch("api/liveInfo");
                const data = await response.text();

                // データをパースしてイベント情報を設定する
                // 現在はコメントアウトされていますが、将来的に実装する予定のコード
                // const parsedCal = ical.parseString(data);
                // setEvents(parsedCal.events);

                // デモ用のダミーデータをセット
                setEvents([]);
            } catch (error) {
                console.error("Error fetching events data:", error);
                setEvents([]);
            }
        }

        fetchData();
    }, []);

    return (
        <Fragment>
            {/* Apple Music コントロール */}
            <AppleMusicControls musicKit={musicKit} />

            {/* プレーヤー情報 */}
            {props.playerItem && (
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6">現在の再生情報</Typography>
                    <pre>{JSON.stringify(props.playerItem, null, 2)}</pre>
                </Box>
            )}

            {/* イベント一覧 */}
            <Typography variant="h6" sx={{ mb: 2 }}>
                イベント情報
            </Typography>
            {events.length > 0 ? (
                events.map((event) => (
                    <EventCard key={event.uid.value} event={event} />
                ))
            ) : (
                <Typography>イベント情報はありません</Typography>
            )}
        </Fragment>
    );
}
