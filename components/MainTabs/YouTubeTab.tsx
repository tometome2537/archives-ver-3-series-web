import Sidebar from "@/components/Navbar/Sidebar";
import type { PlayerItem } from "@/components/PlayerView";
import VideoView from "@/components/VideoView";
import { type Dispatch, Fragment, type SetStateAction } from "react";

interface YouTubeTabProps {
    setPlayerSize: Dispatch<SetStateAction<number>>;
    setIsLargePlayer: Dispatch<SetStateAction<boolean>>;
    playerItem: PlayerItem;
    setPlayerItem: Dispatch<SetStateAction<PlayerItem>>;
    setPlayerSearchResult: Dispatch<SetStateAction<PlayerItem[]>>;
    playerSize: number;
    isLargePlayer: boolean;
    searchQuery: string;
}

export function YouTubeTab({
    setPlayerSize,
    setIsLargePlayer,
    playerItem,
    setPlayerItem,
    setPlayerSearchResult,
    playerSize,
    isLargePlayer,
    searchQuery,
}: YouTubeTabProps) {
    return (
        <Fragment>
            <Sidebar
                setPlayerSize={setPlayerSize}
                setIsLargePlayer={setIsLargePlayer}
            />
            <VideoView
                playerItem={playerItem}
                setPlayerItem={setPlayerItem}
                setPlayerSearchResult={setPlayerSearchResult}
                playerSize={playerSize}
                isLargePlayer={isLargePlayer}
                searchQuery={searchQuery}
            />
        </Fragment>
    );
}
