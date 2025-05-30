import type { useAppleMusic } from "@/contexts/AppleMusicContext";
import { Button, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

// アルバム定数
const ALBUMS = {
    FUTURE_GAZER: "l.bwDIIkb",
    ITSU_NO_MANI: "l.t3Hwh4j",
};

interface AppleMusicControlsProps {
    musicKit: ReturnType<typeof useAppleMusic>;
}

export const AppleMusicControls = ({ musicKit }: AppleMusicControlsProps) => {
    const playAlbum = (albumId: string) => {
        musicKit.instance?.setQueue({
            album: albumId,
            startPlaying: true,
        });
        musicKit.instance?.play();
    };

    return (
        <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12 }}>
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
            <Grid size={{ xs: 12 }}>
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

            <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
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
