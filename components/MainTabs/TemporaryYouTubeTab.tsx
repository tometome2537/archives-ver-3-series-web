import VideoTemporaryView from "@/components/VideoTemporaryView";
import { type Dispatch, Fragment, type SetStateAction } from "react";
import type { EntityObj } from "../EntitySelector";
import type { PlayerItem } from "../PlayerView";
import SuperSearchBar, {
    type InputValueSearchSuggestion,
} from "@/components/Navbar/SuperSearchBar";

export function TemporaryYouTubeTab({
    inputValue,
    playerItem,
    setPlayerItem,
    entityIds,
    setPlayerPlaylist,
    setPlayerSearchResult,
}: {
    inputValue: InputValueSearchSuggestion[];
    playerItem: PlayerItem;
    setPlayerItem: Dispatch<SetStateAction<PlayerItem>>;
    entityIds: EntityObj[];
    setPlayerPlaylist: Dispatch<SetStateAction<PlayerItem[]>>;
    setPlayerSearchResult: Dispatch<SetStateAction<PlayerItem[]>>;
}) {
    return (
        <Fragment>
            <VideoTemporaryView
                inputValue={inputValue}
                entityIds={entityIds}
                playerItem={playerItem}
                setPlayerItem={setPlayerItem}
                setPlayerPlaylist={setPlayerPlaylist}
                setPlayerSearchResult={setPlayerSearchResult}
            />
        </Fragment>
    );
}
