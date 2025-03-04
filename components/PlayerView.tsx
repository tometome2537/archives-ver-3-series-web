import type { InputValue } from "@/components/Navbar/SearchBar/SearchBar";
import type { MediaItem } from "@/contexts/AppleMusicContext";
import { useAppleMusic } from "@/contexts/AppleMusicContext";
import { useBrowserInfoContext } from "@/contexts/BrowserInfoContext";
import rgbToHex from "@/libs/colorConverter";
import { KeyboardArrowDown } from "@mui/icons-material";
import { Repeat } from "@mui/icons-material";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { Box, Chip } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { YouTubePlayer } from "react-youtube";
import Description from "./Description";
import type { MultiSearchBarSearchSuggestion } from "./Navbar/SearchBar/MultiSearchBar";
import Thumbnail from "./Thumbnail";
import YouTubePlayerView from "./YouTubePlayerView";
import type { YouTubePlayerState } from "./YouTubePlayerView";

export enum PlayerType {
    YouTube = "YouTube",
    AppleMusic = "AppleMusic",
}

export type PlayerItem = {
    type?: PlayerType;
    mediaId?: string; // YouTubeの場合はvideoId。AppleMusicの場合はID
    title?: string;
    author?: string;
    short?: boolean;
    description?: string;
    viewCount?: number;
    channelId?: string;
    publishedAt?: Date;
    duration?: number;
    actorId?: Array<string>;
    organizationId?: Array<string>;
    arWidth?: number; // 画面比率の幅
    arHeight?: number; // 画面比率の高さ
};

export type PlayerPlaylist = {
    title?: string;
    videos: PlayerItem[];
};

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
    playerPlaylist?: PlayerPlaylist; // プレイリスト
    setPlayerPlaylist?: Dispatch<SetStateAction<PlayerPlaylist | undefined>>;

    style?: React.CSSProperties; // 外部からスタイルを受け取る（オプション）
};

// カスタムフック: Apple Musicのイベント監視
function useAppleMusicEvents(
    musicKit: ReturnType<typeof useAppleMusic>,
    setPlayerItem: Dispatch<SetStateAction<PlayerItem | undefined>>,
    setPlayerPlaylist:
        | Dispatch<SetStateAction<PlayerPlaylist | undefined>>
        | undefined,
) {
    useEffect(() => {
        if (!musicKit.instance) return;

        const handleItemChange = (event: { item: MediaItem | null }) => {
            const item = event.item;
            if (!item || !item.attributes) return;

            setPlayerItem({
                type: PlayerType.AppleMusic,
                mediaId: item.id,
                title: item.attributes.name,
                author: item.attributes.artistName ?? "Unknown Artist",
                arWidth: item.attributes.artwork?.width ?? 300,
                arHeight: item.attributes.artwork?.height ?? 300,
            });

            if (setPlayerPlaylist) {
                setPlayerPlaylist(undefined);
            }
        };

        musicKit.instance.addEventListener(
            "nowPlayingItemWillChange",
            handleItemChange,
        );

        return () => {
            musicKit.instance?.removeEventListener(
                "nowPlayingItemWillChange",
                handleItemChange,
            );
        };
    }, [musicKit.instance, setPlayerItem, setPlayerPlaylist]);
}

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

    // Apple Musicのイベントを監視
    useAppleMusicEvents(musicKit, setPlayerItem, setPlayerPlaylist);

    // アスペクト比の計算
    const aspectRatio = useMemo(() => {
        if (youTubePlayerState?.getVideoData.author.endsWith(" - Topic")) {
            return 1;
        } else if (playerItem?.arWidth && playerItem.arHeight) {
            return playerItem.arWidth / playerItem.arHeight;
        }
        return 16 / 9;
    }, [
        youTubePlayerState?.getVideoData.author,
        playerItem?.arWidth,
        playerItem?.arHeight,
    ]);

    // プレイヤーの幅を計算
    const width = useMemo(() => {
        if (isPlayerFullscreen) {
            if (isMobile) {
                return youTubePlayerState?.getVideoData.author.endsWith(
                    " - Topic",
                )
                    ? screenWidth * 0.8
                    : screenWidth;
            }
            return screenHeight * 0.55 * aspectRatio;
        }
        return screenHeight * 0.1 * aspectRatio;
    }, [
        isPlayerFullscreen,
        isMobile,
        youTubePlayerState?.getVideoData.author,
        screenWidth,
        screenHeight,
        aspectRatio,
    ]);

    // プレイリスト内のアイテムを見つけるユーティリティ関数
    const findPlaylistItem = useCallback(
        (mediaId?: string) => {
            if (!mediaId || !playerPlaylist?.videos) return undefined;
            return playerPlaylist.videos.find(
                (item) => item.mediaId === mediaId,
            );
        },
        [playerPlaylist?.videos],
    );

    // プレイヤー切り替え処理
    useEffect(() => {
        // Apple Music停止
        if (
            playerItem?.type !== PlayerType.AppleMusic &&
            musicKit.instance?.isPlaying
        ) {
            musicKit.instance?.stop();
        }

        // プレイリストチェック
        const isInPlaylist = findPlaylistItem(playerItem?.mediaId);

        // プレイリストにないvideoIdが外部から設定された場合は、Playlistを破棄する
        if (!isInPlaylist && setPlayerPlaylist && playerPlaylist) {
            setPlayerPlaylist(undefined);
            setRepeat(false);
        }

        // 再生中のvideoIdが変更された時にPlaylistから動画詳細を取得する
        if (isInPlaylist) {
            setPlayerItem(isInPlaylist);
            setRepeat(false);
        }
    }, [
        musicKit,
        playerItem,
        setPlayerItem,
        findPlaylistItem,
        playerPlaylist,
        setPlayerPlaylist,
    ]);

    // 楽曲の再生が終わったらの処理
    useEffect(() => {
        if (youTubePlayerState?.state !== "ended") return;

        // 再生が終わったらプレイリストの次の曲を再生するか、ループする
        if (repeat && youTubePlayer) {
            // ループ再生
            youTubePlayer.playVideo();
        } else if (
            playerPlaylist?.videos &&
            youTubePlayerState?.getVideoData.video_id
        ) {
            // 次の曲を再生
            const playListIndex = playerPlaylist.videos.findIndex(
                (item) =>
                    item.mediaId === youTubePlayerState.getVideoData.video_id,
            );

            if (playListIndex !== undefined && playListIndex >= 0) {
                const nextItem = playerPlaylist.videos[playListIndex + 1];
                if (nextItem) {
                    setPlayerItem(nextItem);
                }
            }
        }
    }, [
        youTubePlayerState?.state,
        youTubePlayerState?.getVideoData.video_id,
        youTubePlayer,
        playerPlaylist?.videos,
        setPlayerItem,
        repeat,
    ]);

    // プレイヤー表示用の条件チェック
    if (!playerItem?.type) {
        return null;
    }

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

    // チップクリックハンドラー
    const handleChipClick = (id: string) => {
        const actorSearchSuggestion = searchSuggestion.find(
            (item) => item.value === id || item.label === id,
        );

        if (actorSearchSuggestion) {
            const value: InputValue = {
                ...actorSearchSuggestion,
                createdAt: new Date(),
                sort: actorSearchSuggestion.sort || 99,
            };

            setInputValue([value]);
        }

        setIsPlayerFullscreen(false);
    };

    // プレイヤーアイテムのクリックハンドラー
    const handlePlayerItemClick = (e: React.MouseEvent) => {
        if (isPlayerFullscreen) {
            setIsPlayerFullscreen(false);
        } else {
            setIsPlayerFullscreen(true);
        }
    };

    return (
        <Box
            sx={{
                overflowY: isPlayerFullscreen ? "hidden" : "auto",
            }}
        >
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
                    {/* プレイヤーコントロールバー */}
                    {isPlayerFullscreen && (
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
                                onClick={() => setIsPlayerFullscreen(false)}
                            >
                                <KeyboardArrowDown sx={{ fontSize: "2rem" }} />
                            </IconButton>
                            <Box sx={{ flexGrow: 0.01 }} />
                            {playerItem?.type === PlayerType.YouTube && (
                                <IconButton
                                    sx={{ marginY: 1 }}
                                    component="a"
                                    href={`https://m.youtube.com/watch?v=${playerItem?.mediaId}`}
                                    target="_blank"
                                >
                                    <YouTubeIcon
                                        sx={{
                                            fontSize: "1.5rem",
                                            color: "rgb(236,44,46)",
                                        }}
                                    />
                                </IconButton>
                            )}
                            <Box sx={{ flexGrow: 0.015 }} />
                            {playerItem?.type === PlayerType.YouTube ? (
                                <IconButton
                                    sx={{ marginY: 1 }}
                                    component="a"
                                    href={`https://music.youtube.com/watch?v=${playerItem?.mediaId}`}
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
                            ) : (
                                <IconButton
                                    sx={{ marginY: 1 }}
                                    component="a"
                                    href={`https://music.apple.com/jp/album/${playerItem?.title?.replace(" |　", "-")}/${playerItem?.mediaId}?i=${playerItem?.mediaId}`}
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
                                        color: repeat
                                            ? theme.palette.primary.main
                                            : "",
                                        fontSize: "1.5rem",
                                    }}
                                />
                            </IconButton>
                            <Box sx={{ flexGrow: 0.02 }} />
                        </Box>
                    )}

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
                                !(
                                    isMobile &&
                                    isPlayerFullscreen &&
                                    aspectRatio !== 1
                                )
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
                                src={
                                    musicKit.instance?.nowPlayingItem?.attributes.artwork?.url
                                        .replace("{w}", "400")
                                        .replace("{h}", "400") ?? ""
                                }
                                alt={
                                    musicKit.instance?.nowPlayingItem
                                        ?.attributes.name ?? ""
                                }
                                style={{ borderRadius: "0.6em" }}
                            />
                        </Box>
                    )}

                    {/* ミニプレイヤービュー */}
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
                            display: isPlayerFullscreen ? "none" : "block",
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
                            display: isPlayerFullscreen ? "none" : "block",
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

                    {/* フルスクリーン時の詳細情報 */}
                    <Box
                        sx={{
                            width: width,
                            maxWidth: "100%",
                            margin: "0 auto",
                            display: isPlayerFullscreen ? "block" : "none",
                            overflowY: "auto",
                            maxHeight: "50vh",
                            paddingBottom: "40vh",
                        }}
                    >
                        {/* 動画タイトル */}
                        <h3
                            style={{
                                display: "block",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {playerItem?.title ||
                                youTubePlayerState?.getVideoData.title}
                        </h3>

                        {/* チャンネル名 */}
                        <p
                            style={{
                                display: "block",
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
                        </p>

                        {/* 出演者・組織名一覧 */}
                        <Box
                            style={{
                                display: "flex",
                                padding: "8 auto",
                                justifyContent: "center",
                                alignItems: "center",
                                flexWrap: "wrap",
                                gap: "10px",
                            }}
                        >
                            {isPlayerFullscreen &&
                            playerItem &&
                            (playerItem.actorId || playerItem.organizationId) &&
                            (playerItem.actorId?.length !== 0 ||
                                playerItem.organizationId?.length !== 0)
                                ? [
                                      ...(playerItem.actorId || []),
                                      ...(playerItem.organizationId || []),
                                  ].map((id) => {
                                      const r = searchSuggestion.find(
                                          (item) => item.value === id,
                                      );
                                      const label = r?.label ?? "?";
                                      const imgSrc = r?.imgSrc;
                                      return (
                                          <Chip
                                              key={id}
                                              variant="outlined"
                                              sx={{
                                                  "& .MuiChip-label": {
                                                      maxWidth: "100%",
                                                      whiteSpace: "nowrap",
                                                      textOverflow: "ellipsis",
                                                  },
                                              }}
                                              avatar={
                                                  imgSrc ? (
                                                      <Avatar
                                                          alt={label}
                                                          src={imgSrc}
                                                      />
                                                  ) : (
                                                      <Avatar>
                                                          {label[0]}
                                                      </Avatar>
                                                  )
                                              }
                                              label={label}
                                              color="success"
                                              onClick={() =>
                                                  handleChipClick(id)
                                              }
                                              onKeyPress={(e) => {
                                                  if (
                                                      e.key === "Enter" ||
                                                      e.key === " "
                                                  ) {
                                                      e.preventDefault();
                                                      e.currentTarget.click();
                                                  }
                                              }}
                                          />
                                      );
                                  })
                                : null}
                        </Box>

                        {/* 概要欄 */}
                        <Box style={{ margin: "0.5em" }}>
                            {isPlayerFullscreen && playerItem?.description && (
                                <Description
                                    text={playerItem.description}
                                    date={playerItem?.publishedAt}
                                    maxLine={2}
                                />
                            )}
                        </Box>

                        {/* モバイル時のプレイリスト表示 */}
                        {isMobile && playerPlaylist && (
                            <>
                                <h3>{playerPlaylist.title}</h3>
                                {playerPlaylist.videos.map(
                                    (item: PlayerItem) => (
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
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setPlayerItem(item);
                                                }}
                                            />
                                        </Box>
                                    ),
                                )}
                            </>
                        )}
                    </Box>
                </Box>

                {/* 右カラム（プレイリスト） */}
                <Box
                    style={{
                        display:
                            isPlayerFullscreen &&
                            !isMobile &&
                            playerPlaylist &&
                            playerPlaylist.videos.length !== 0
                                ? "block"
                                : "none",
                        width: isPlayerFullscreen && !isMobile ? "30%" : "100%",
                    }}
                >
                    <Box
                        style={{
                            overflowY: "auto",
                            maxHeight: "100vh",
                            paddingBottom: "25vh",
                        }}
                    >
                        <h3>{playerPlaylist?.title}</h3>
                        {playerPlaylist?.videos.map((item: PlayerItem) => (
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
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setPlayerItem(item);
                                    }}
                                />
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
