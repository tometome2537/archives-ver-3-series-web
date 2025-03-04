import Thumbnail from "@/components/Thumbnail";
import { Box } from "@mui/material";
import type { Dispatch, SetStateAction } from "react";
import type { PlayerItem, PlayerPlaylist as PlaylistType } from "./types";

type PlayerPlaylistProps = {
    isFullscreen: boolean;
    isMobile: boolean;
    playerPlaylist?: PlaylistType;
    setPlayerItem: Dispatch<SetStateAction<PlayerItem | undefined>>;
};

export default function PlayerPlaylist({
    isFullscreen,
    isMobile,
    playerPlaylist,
    setPlayerItem,
}: PlayerPlaylistProps) {
    if (!playerPlaylist || (!isMobile && !isFullscreen)) return null;

    const handleItemClick = (item: PlayerItem) => (e: React.MouseEvent) => {
        e.stopPropagation();
        setPlayerItem(item);
    };

    // モバイル表示用プレイリスト
    if (isMobile && isFullscreen) {
        return (
            <>
                <h3>{playerPlaylist.title}</h3>
                {playerPlaylist.videos.map((item: PlayerItem) => (
                    <Box
                        key={item.mediaId}
                        sx={{
                            maxWidth: "80vw",
                            margin: "0 auto",
                        }}
                    >
                        <Thumbnail
                            videoId={item.mediaId || ""}
                            thumbnailType="list"
                            title={item.title}
                            viewCount={item.viewCount}
                            channelTitle={item.author}
                            duration={item.duration}
                            publishedAt={item.publishedAt}
                            onClick={handleItemClick(item)}
                        />
                    </Box>
                ))}
            </>
        );
    }

    // デスクトップ用プレイリスト（右カラム）
    if (!isMobile && isFullscreen && playerPlaylist.videos.length > 0) {
        return (
            <Box
                style={{
                    display: "block",
                    width: "30%",
                }}
            >
                <Box
                    style={{
                        overflowY: "auto",
                        maxHeight: "100vh",
                        paddingBottom: "25vh",
                    }}
                >
                    <h3>{playerPlaylist.title}</h3>
                    {playerPlaylist.videos.map((item: PlayerItem) => (
                        <Box
                            key={item.mediaId}
                            sx={{
                                maxWidth: "25vw",
                                margin: "0 auto",
                            }}
                        >
                            <Thumbnail
                                videoId={item.mediaId || ""}
                                title={item.title}
                                viewCount={item.viewCount}
                                channelTitle={item.author}
                                publishedAt={item.publishedAt}
                                onClick={handleItemClick(item)}
                            />
                        </Box>
                    ))}
                </Box>
            </Box>
        );
    }

    return null;
}
