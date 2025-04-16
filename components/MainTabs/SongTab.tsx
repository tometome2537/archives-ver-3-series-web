import type { InputValue } from "@/components/Navbar/SearchBar/SearchBar";
import { useApiDataContext } from "@/contexts/ApiDataContext";
import { useBrowserInfoContext } from "@/contexts/BrowserInfoContext";
import { Box } from "@mui/material";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import Album from "../Album";
import type { PlayerItem, PlayerPlaylist } from "../PlayerView";
import Thumbnail from "../Thumbnail";

type SongTabProps = {
    inputValue: InputValue[];

    playerItem: PlayerItem | undefined;
    setPlayerItem: Dispatch<SetStateAction<PlayerItem | undefined>>;
    setPlayerPlaylist: Dispatch<SetStateAction<PlayerPlaylist | undefined>>;
};

export default function SongTab(props: SongTabProps) {
    const apiData = useApiDataContext("YouTubeAccount");
    // ブラウザ情報を取得
    const { isMobile } = useBrowserInfoContext();

    return (
        <>
            <div>SongTab</div>
        </>
    );
}
