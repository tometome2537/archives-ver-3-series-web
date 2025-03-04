import type { YouTubePlayerState } from "@/components/YouTubePlayerView";
import type { MediaItem } from "@/contexts/AppleMusicContext";
import type { ReturnType as AppleMusicReturnType } from "@/contexts/AppleMusicContext";
import type { Dispatch, SetStateAction } from "react";
import { useCallback, useEffect, useMemo } from "react";
import type { YouTubePlayer } from "react-youtube";
import { type PlayerItem, type PlayerPlaylist, PlayerType } from "./types";

// Apple Musicのイベント監視フック
export function useAppleMusicEvents(
    musicKit: AppleMusicReturnType,
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

// プレイヤー切り替え処理フック
export function usePlayerSwitching(
    musicKit: AppleMusicReturnType,
    playerItem: PlayerItem | undefined,
    setPlayerItem: Dispatch<SetStateAction<PlayerItem | undefined>>,
    playerPlaylist: PlayerPlaylist | undefined,
    setPlayerPlaylist:
        | Dispatch<SetStateAction<PlayerPlaylist | undefined>>
        | undefined,
    setRepeat: Dispatch<SetStateAction<boolean>>,
) {
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
        setRepeat,
    ]);

    return { findPlaylistItem };
}

// 再生終了時の処理フック
export function usePlaybackEndHandling(
    youTubePlayerState: YouTubePlayerState | undefined,
    youTubePlayer: YouTubePlayer | undefined,
    playerPlaylist: PlayerPlaylist | undefined,
    setPlayerItem: Dispatch<SetStateAction<PlayerItem | undefined>>,
    repeat: boolean,
) {
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
}

// レイアウト計算フック
export function usePlayerLayout(
    isFullscreen: boolean,
    isMobile: boolean,
    screenWidth: number,
    screenHeight: number,
    youTubePlayerState: YouTubePlayerState | undefined,
    playerItem: PlayerItem | undefined,
) {
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
        if (isFullscreen) {
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
        isFullscreen,
        isMobile,
        youTubePlayerState?.getVideoData.author,
        screenWidth,
        screenHeight,
        aspectRatio,
    ]);

    return { aspectRatio, width };
}
