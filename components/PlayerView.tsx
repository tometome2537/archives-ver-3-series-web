import type { InputValue } from "@/components/Navbar/SearchBar/SearchBar";
import { useAppleMusic } from "@/contexts/AppleMusicContext";
import { useBrowserInfoContext } from "@/contexts/BrowserInfoContext";
import rgbToHex from "@/libs/colorConverter";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { YouTubePlayer } from "react-youtube";
import type { MultiSearchBarSearchSuggestion } from "./Navbar/SearchBar/MultiSearchBar";
import type { YouTubePlayerState } from "./YouTubePlayerView";

import PlayerContent from "./Player/PlayerContent";
// プレイヤー関連のコンポーネントとフック
import PlayerControls from "./Player/PlayerControls";
import PlayerInfo from "./Player/PlayerInfo";
import PlayerPlaylist from "./Player/PlayerPlaylist";
import {
    useAppleMusicEvents,
    usePlaybackEndHandling,
    usePlayerLayout,
    usePlayerSwitching,
} from "./Player/hooks";
import {
    type PlayerItem,
    PlayerType,
    type PlayerPlaylist as PlaylistType,
} from "./Player/types";

// タイプを再エクスポート
export {
    PlayerType,
    type PlayerItem,
    type PlayerPlaylist,
} from "./Player/types";

type PlayerProps = {
    // マルチサーチバー
    inputValue: InputValue[];
    setInputValue: Dispatch<SetStateAction<InputValue[]>>;
    searchSuggestion: MultiSearchBarSearchSuggestion[];

    // フルスクリーンで表示するかどうか
    isPlayerFullscreen: boolean;
    setIsPlayerFullscreen: Dispatch<SetStateAction<boolean>>;

    playerItem: PlayerItem | undefined;
    setPlayerItem: Dispatch<SetStateAction<PlayerItem | undefined>>;
    playerPlaylist?: PlaylistType; // プレイリスト
    setPlayerPlaylist?: Dispatch<SetStateAction<PlaylistType | undefined>>;

    style?: React.CSSProperties; // 外部からスタイルを受け取る（オプション）
};

export default function PlayerView(props: PlayerProps) {
    const {
        inputValue,
        setInputValue,
        searchSuggestion,
        isPlayerFullscreen,
        setIsPlayerFullscreen,
        playerItem,
        setPlayerItem,
        playerPlaylist,
        setPlayerPlaylist,
        style,
    } = props;

    // テーマ設定を取得
    const theme = useTheme();
    // ブラウザ情報を取得
    const { screenWidth, screenHeight, isMobile } = useBrowserInfoContext();

    const musicKit = useAppleMusic();

    // プレイヤーの状態
    const [youTubePlayerState, setYouTubePlayerState] =
        useState<YouTubePlayerState>();
    const [youTubePlayer, setYouTubePlayer] = useState<
        YouTubePlayer | undefined
    >(undefined);
    const [repeat, setRepeat] = useState<boolean>(false);

    // カスタムフックを使用
    useAppleMusicEvents(musicKit, setPlayerItem, setPlayerPlaylist);

    // プレイヤー切り替え処理
    usePlayerSwitching(
        musicKit,
        playerItem,
        setPlayerItem,
        playerPlaylist,
        setPlayerPlaylist,
        setRepeat,
    );

    // 再生終了時の処理
    usePlaybackEndHandling(
        youTubePlayerState,
        youTubePlayer,
        playerPlaylist,
        setPlayerItem,
        repeat,
    );

    // レイアウト計算
    const { aspectRatio, width } = usePlayerLayout(
        isPlayerFullscreen,
        isMobile,
        screenWidth,
        screenHeight,
        youTubePlayerState,
        playerItem,
    );

    // プレイヤー表示用の条件チェック
    if (!playerItem?.type) {
        return null;
    }

    // Apple Music用アートワーク情報
    const artworkUrl =
        musicKit.instance?.nowPlayingItem?.attributes.artwork?.url
            .replace("{w}", "400")
            .replace("{h}", "400") ?? "";

    const artworkAlt = musicKit.instance?.nowPlayingItem?.attributes.name ?? "";

    return (
        <Box sx={{ overflowY: isPlayerFullscreen ? "hidden" : "auto" }}>
            <Box
                sx={{
                    position: isPlayerFullscreen ? "fixed" : "relative",
                    top: "0",
                    display: isMobile ? "block" : "flex",
                    width: "100%",
                    height: "100%",
                    maxWidth: "100vw",
                    maxHeight: "100%",
                    backgroundColor: isPlayerFullscreen
                        ? `rgba(
                ${rgbToHex(theme.palette.background.paper).r},
                ${rgbToHex(theme.palette.background.paper).g},
                ${rgbToHex(theme.palette.background.paper).b},
                0.90
              )`
                        : `rgba(
                ${rgbToHex(theme.palette.background.paper).r},
                ${rgbToHex(theme.palette.background.paper).g},
                ${rgbToHex(theme.palette.background.paper).b},
                0.75
              )`,
                    backdropFilter: isPlayerFullscreen
                        ? "blur(15px)"
                        : "blur(20px)",
                    WebkitBackdropFilter: isPlayerFullscreen
                        ? "blur(15px)"
                        : "blur(20px)",
                    overflow: "hidden",
                    padding: "0",
                    margin: "0",
                    borderTopLeftRadius: isPlayerFullscreen ? "0" : "1em",
                    borderTopRightRadius: isPlayerFullscreen ? "0" : "1em",
                    textAlign: "center",
                    ...style,
                }}
            >
                {/* 左カラム */}
                <Box
                    sx={{
                        display: isPlayerFullscreen ? "block" : "flex",
                        width:
                            isPlayerFullscreen &&
                            !isMobile &&
                            playerPlaylist &&
                            playerPlaylist.videos.length !== 0
                                ? "70%"
                                : "100%",
                        margin: isPlayerFullscreen ? "" : "0 auto",
                        justifyContent: "center",
                    }}
                >
                    {/* コントロールバー */}
                    <PlayerControls
                        isFullscreen={isPlayerFullscreen}
                        setIsFullscreen={setIsPlayerFullscreen}
                        playerType={playerItem?.type}
                        mediaId={playerItem?.mediaId}
                        title={playerItem?.title}
                        repeat={repeat}
                        setRepeat={setRepeat}
                        width={width}
                    />

                    {/* プレイヤー本体とミニプレイヤー */}
                    <PlayerContent
                        isFullscreen={isPlayerFullscreen}
                        isMobile={isMobile}
                        playerItem={playerItem}
                        youTubePlayerState={youTubePlayerState}
                        youTubePlayer={youTubePlayer}
                        setYouTubePlayer={setYouTubePlayer}
                        setYouTubePlayerState={setYouTubePlayerState}
                        setIsFullscreen={setIsPlayerFullscreen}
                        artworkUrl={artworkUrl}
                        artworkAlt={artworkAlt}
                        aspectRatio={aspectRatio}
                        width={width}
                    />

                    {/* 詳細情報（フルスクリーン時） */}
                    <PlayerInfo
                        isFullscreen={isPlayerFullscreen}
                        playerItem={playerItem}
                        title={youTubePlayerState?.getVideoData.title}
                        author={youTubePlayerState?.getVideoData.author}
                        searchSuggestion={searchSuggestion}
                        setInputValue={setInputValue}
                        setIsFullscreen={setIsPlayerFullscreen}
                        width={width}
                    />

                    {/* モバイル用プレイリスト */}
                    {isMobile && isPlayerFullscreen && (
                        <PlayerPlaylist
                            isFullscreen={isPlayerFullscreen}
                            isMobile={isMobile}
                            playerPlaylist={playerPlaylist}
                            setPlayerItem={setPlayerItem}
                        />
                    )}
                </Box>

                {/* 右カラム（デスクトップ用プレイリスト） */}
                {!isMobile && isPlayerFullscreen && (
                    <PlayerPlaylist
                        isFullscreen={isPlayerFullscreen}
                        isMobile={isMobile}
                        playerPlaylist={playerPlaylist}
                        setPlayerItem={setPlayerItem}
                    />
                )}
            </Box>
        </Box>
    );
}
