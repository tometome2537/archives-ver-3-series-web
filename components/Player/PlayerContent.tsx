import type { YouTubePlayerState } from "@/components/YouTubePlayerView";
import YouTubePlayerView from "@/components/YouTubePlayerView";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { Box } from "@mui/material";
import Image from "next/image";
import type { YouTubePlayer } from "react-youtube";
import { type PlayerItem, PlayerType } from "./types";

type PlayerContentProps = {
    isFullscreen: boolean;
    isMobile: boolean;
    playerItem?: PlayerItem;
    youTubePlayerState?: YouTubePlayerState;
    youTubePlayer?: YouTubePlayer;
    setYouTubePlayer: (player: YouTubePlayer) => void;
    setYouTubePlayerState: (state: YouTubePlayerState) => void;
    setIsFullscreen: (value: boolean) => void;
    artworkUrl?: string;
    artworkAlt?: string;
    aspectRatio: number;
    width: number;
};

export default function PlayerContent({
    isFullscreen,
    isMobile,
    playerItem,
    youTubePlayerState,
    youTubePlayer,
    setYouTubePlayer,
    setYouTubePlayerState,
    setIsFullscreen,
    artworkUrl,
    artworkAlt,
    aspectRatio,
    width,
}: PlayerContentProps) {
    // 再生/一時停止ボタンのクリックハンドラー
    const handlePlayPause = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!youTubePlayer) return;

        if (youTubePlayerState?.state === "playing") {
            youTubePlayer.pauseVideo();
        } else {
            youTubePlayer.playVideo();
        }
    };

    // プレイヤーアイテムのクリックハンドラー
    const handlePlayerItemClick = () => {
        setIsFullscreen(!isFullscreen);
    };

    return (
        <>
            {/* プレイヤー */}
            {playerItem?.type === PlayerType.YouTube ? (
                <YouTubePlayerView
                    videoId={playerItem?.mediaId || ""}
                    aspectRatio={aspectRatio}
                    width={width}
                    style={{
                        margin: "0 auto",
                        maxWidth: "100%",
                        maxHeight: "100%",
                    }}
                    playerRadius={
                        !(isMobile && isFullscreen && aspectRatio !== 1)
                    }
                    setPlayer={setYouTubePlayer}
                    setPlayerState={setYouTubePlayerState}
                />
            ) : (
                <Box
                    style={{
                        height: width / aspectRatio,
                        margin: "0 auto",
                        maxWidth: "100%",
                        maxHeight: "100%",
                    }}
                >
                    <Image
                        width={width}
                        height={width / aspectRatio}
                        src={artworkUrl || ""}
                        alt={artworkAlt || ""}
                        style={{ borderRadius: "0.6em" }}
                    />
                </Box>
            )}

            {/* ミニプレイヤービュー */}
            {!isFullscreen && (
                <>
                    <Box
                        onClick={handlePlayerItemClick}
                        onKeyPress={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                e.currentTarget.click();
                            }
                        }}
                        tabIndex={0}
                        role="button"
                        aria-label="Toggle player fullscreen"
                        sx={{
                            cursor: "pointer",
                            maxWidth: "40%",
                            height: "auto",
                            margin: "auto 0",
                        }}
                    >
                        <Box
                            sx={{
                                display: "block",
                                width: "auto",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {playerItem?.title ||
                                youTubePlayerState?.getVideoData.title}
                        </Box>
                        <Box
                            sx={{
                                display: "block",
                                width: "auto",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {(
                                playerItem?.author ||
                                youTubePlayerState?.getVideoData.author ||
                                ""
                            ).replace(" - Topic", "")}
                        </Box>
                    </Box>

                    {/* ミニプレイヤー再生/一時停止ボタン */}
                    <Box
                        sx={{
                            maxWidth: "20%",
                            margin: "auto",
                        }}
                    >
                        {youTubePlayerState?.state === "playing" ? (
                            <PauseIcon
                                sx={{ height: "100%", margin: "auto" }}
                                onClick={handlePlayPause}
                            />
                        ) : (
                            <PlayArrowIcon
                                sx={{ height: "100%", margin: "auto" }}
                                onClick={handlePlayPause}
                            />
                        )}
                    </Box>
                </>
            )}
        </>
    );
}
