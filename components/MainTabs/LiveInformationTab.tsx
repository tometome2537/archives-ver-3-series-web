import { useApiDataContext } from "@/contexts/ApiDataContext";
import type { LiveInformation } from "@/contexts/ApiDataContext";
import { useAppleMusic } from "@/contexts/AppleMusicContext";
import { Box, Button, Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Fragment } from "react";
import type { PlayerItem } from "../PlayerView";

type LiveInformationTabProps = {
    playerItem: PlayerItem | undefined;
};

// アルバム定数
const ALBUMS = {
    FUTURE_GAZER: "l.bwDIIkb",
    ITSU_NO_MANI: "l.t3Hwh4j",
};

// イベント表示コンポーネント
const EventCard = ({ event }: { event: LiveInformation }) => (
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
        <Typography variant="h6">{event.タイトル}</Typography>
        {/* <Typography variant="body1">
            {event.description.value.split("<br>").map((line, index) => (
                <Typography key={`${event.uid.value}-line-${index}`}>
                    {unescapeHtml(line.replaceAll(/<[^>]+>/g, ""))}
                </Typography>
            ))}
        </Typography> */}
    </Paper>
);

// Apple Music操作コンポーネント
const AppleMusicControls = ({
    musicKit,
}: { musicKit: ReturnType<typeof useAppleMusic> }) => {
    const playAlbum = (albumId: string) => {
        musicKit.instance?.setQueue({
            album: albumId,
            startPlaying: true,
        });
        musicKit.instance?.play();
    };

    return (
        <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid xs={12}>
                <Typography variant="h6">Apple Music認証</Typography>
            </Grid>
            <Grid>
                <Button
                    variant="contained"
                    onClick={() => musicKit.instance?.authorize()}
                >
                    認証開始
                </Button>
            </Grid>
            <Grid>
                <Button
                    variant="outlined"
                    onClick={() => musicKit.instance?.unauthorize()}
                >
                    認証解除
                </Button>
            </Grid>
            <Grid xs={12}>
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

            <Grid xs={12} sx={{ mt: 2 }}>
                <Typography variant="h6">アルバム再生</Typography>
            </Grid>
            <Grid>
                <Button
                    variant="contained"
                    onClick={() => playAlbum(ALBUMS.FUTURE_GAZER)}
                >
                    future gazer 再生
                </Button>
            </Grid>
            <Grid>
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
    const musicKit = useAppleMusic();

    const apiData = useApiDataContext("LiveInformation");

    return (
        <Fragment>
            {/* イベント一覧 */}
            <Typography variant="h6" sx={{ mb: 2 }}>
                イベント情報
            </Typography>
            {apiData.LiveInformation.data.length > 0 ? (
                apiData.LiveInformation.data.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))
            ) : (
                <Typography>イベント情報はありません</Typography>
            )}

            {/* Apple Music コントロール */}
            <AppleMusicControls musicKit={musicKit} />

            {/* プレーヤー情報 */}
            {props.playerItem && (
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6">現在の再生情報</Typography>
                    <pre>{JSON.stringify(props.playerItem, null, 2)}</pre>
                </Box>
            )}
        </Fragment>
    );
}
