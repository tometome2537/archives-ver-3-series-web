import { Repeat } from "@mui/icons-material";
import { KeyboardArrowDown } from "@mui/icons-material";
import YouTubeIcon from "@mui/icons-material/YouTube";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";
import { PlayerType } from "./types";

type PlayerControlsProps = {
    isFullscreen: boolean;
    setIsFullscreen: (value: boolean) => void;
    playerType?: PlayerType;
    mediaId?: string;
    title?: string;
    repeat: boolean;
    setRepeat: (value: boolean) => void;
    width: number;
};

export default function PlayerControls({
    isFullscreen,
    setIsFullscreen,
    playerType,
    mediaId,
    title,
    repeat,
    setRepeat,
    width,
}: PlayerControlsProps) {
    const theme = useTheme();

    if (!isFullscreen) return null;

    return (
        <Box
            sx={{
                display: "flex",
                alignContent: "left",
                width: width,
                maxWidth: "100%",
                margin: "0 auto",
            }}
        >
            <Box sx={{ flexGrow: 0.02 }} />
            <IconButton
                sx={{ marginY: 1 }}
                onClick={() => setIsFullscreen(false)}
            >
                <KeyboardArrowDown sx={{ fontSize: "2rem" }} />
            </IconButton>
            <Box sx={{ flexGrow: 0.01 }} />

            {playerType === PlayerType.YouTube && (
                <>
                    <IconButton
                        sx={{ marginY: 1 }}
                        component="a"
                        href={`https://m.youtube.com/watch?v=${mediaId}`}
                        target="_blank"
                    >
                        <YouTubeIcon
                            sx={{ fontSize: "1.5rem", color: "rgb(236,44,46)" }}
                        />
                    </IconButton>
                    <Box sx={{ flexGrow: 0.015 }} />
                    <IconButton
                        sx={{ marginY: 1 }}
                        component="a"
                        href={`https://music.youtube.com/watch?v=${mediaId}`}
                        target="_blank"
                    >
                        <Image
                            src="/ytm.png"
                            alt="YouTube Music リンク"
                            width={20}
                            height={20}
                            style={{ fontSize: "1.5rem" }}
                        />
                    </IconButton>
                </>
            )}

            {playerType === PlayerType.AppleMusic && (
                <IconButton
                    sx={{ marginY: 1 }}
                    component="a"
                    href={`https://music.apple.com/jp/album/${title?.replace(" |　", "-")}/${mediaId}?i=${mediaId}`}
                    target="_blank"
                >
                    <Image
                        src="/apple_music_logo.png"
                        alt="Apple Music リンク"
                        width={20}
                        height={20}
                        style={{ fontSize: "1.5rem" }}
                    />
                </IconButton>
            )}

            <Box sx={{ flexGrow: 1 }} />
            <IconButton onClick={() => setRepeat(!repeat)}>
                <Repeat
                    sx={{
                        color: repeat ? theme.palette.primary.main : "",
                        fontSize: "1.5rem",
                    }}
                />
            </IconButton>
            <Box sx={{ flexGrow: 0.02 }} />
        </Box>
    );
}
