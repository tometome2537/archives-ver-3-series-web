import VideoTemporaryView from "@/components/VideoTemporaryView";
import { type Dispatch, Fragment, type SetStateAction } from "react";
import type { EntityObj } from "../EntitySelector";
import type { PlayerItem } from "../PlayerView";

export function TemporaryYouTubeTab({
    playerItem,
    setPlayerItem,
    entityIds,
    setPlayerPlaylist,
    setPlayerSearchResult,
}: {
    playerItem: PlayerItem;
    setPlayerItem: Dispatch<SetStateAction<PlayerItem>>;
    entityIds: EntityObj[];
    setPlayerPlaylist: Dispatch<SetStateAction<PlayerItem[]>>;
    setPlayerSearchResult: Dispatch<SetStateAction<PlayerItem[]>>;
}) {
    return (
        <Fragment>
            <VideoTemporaryView
                entityIds={entityIds}
                playerItem={playerItem}
                setPlayerItem={setPlayerItem}
                setPlayerPlaylist={setPlayerPlaylist}
                setPlayerSearchResult={setPlayerSearchResult}
            />
        </Fragment>
    );
}
