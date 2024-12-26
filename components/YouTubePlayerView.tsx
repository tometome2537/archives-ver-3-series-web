import type React from "react";
import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import YouTube, { type YouTubeProps, type YouTubePlayer } from "react-youtube";

type YouTubePlayerViewProps = {
    videoId?: string;
    width?: string;
    height?: string;
    style?: React.CSSProperties; // 外部からスタイルを受け取る（オプション）
    playerRadius?: boolean;
    setPlayerState?: Dispatch<SetStateAction<YouTubePlayerState | undefined>>;
    setPlayer?: Dispatch<SetStateAction<YouTubePlayer | undefined>>;
};

export type YouTubePlayerState = {
    state: string;
    getVideoData: {
        videoId: string
        title: string;
        author: string;
        video_quality: string;
        isPlayable: boolean
        isPrivate: boolean;
        isLive: boolean;
        errorCode: number;
        video_quality_features: string[]
        backgroundable: boolean;
        eventId: string;
        cpn: string;
        isWindowedLive: boolean;
        isManifestless: boolean;
        allowLiveDvr: boolean;
        isListed: boolean;
        isMultiChannelAudio: boolean
        hasProgressBarBoundaries: boolean;
        isPremiere: boolean;
        itct: string;
        playerResponseCpn: string;
        progressBarStartPositionUtcTimeMillis: string;
        progressBarEndPositionUtcTimeMillis: string;
        paidContentOverlayDurationMs: number;
    }
    getCurrentTime: number;
    getDuration: number;
    getVideoUrl: string;
    isMuted: boolean;
}

export default function YouTubePlayerView(props: YouTubePlayerViewProps) {
    // YouTube Playerの再生オプション
    const YouTubeOpts: YouTubeProps["opts"] = {
        // widthは "％"の指定で良い。具体的な幅はPlayerの親要素で調節する。
        width: "100%",
        // heightは "%"で指定しても反映されない。pxで指定するある必要がある(説)。
        height: props.height || "390",
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 1, // 自動再生
            loop:  0, // デフォルトはループしない。
            playlist: undefined,
        },
    };

    // YouTube Playerの再生の状態を取得
    const onStateChange: YouTubeProps["onStateChange"] = (event) => {
        const stateMap: { [key: number]: string } = {
            [-1]: "未開始",
            0: "終了",
            1: "再生中",
            2: "一時停止",
            3: "バッファリング",
            5: "頭出し（準備完了）",
        };
        const r = {
            state:  stateMap[event?.data] ?? "不明",
            getVideoData: event?.target?.getVideoData(),
            getCurrentTime: event?.target?.getCurrentTime(),
            getDuration: event?.target?.getDuration(),
            getVideoUrl: event?.target?.getVideoUrl(),
            isMuted: event?.target?.isMuted(),
        }
        props.setPlayerState?.(r);
    };


    // YouTube Playerの読み込みが完了した時
    const onReady: YouTubeProps["onReady"] = (event) => {
        if (props.setPlayer) {
            props.setPlayer(event.target); // プレイヤーのインスタンスを保存
        }
    };

    return (
        <div
            style={{
                ...{
                    width: props.width || "100%",
                    // ↓ この色がついてるところをどうにかする To Do
                    // backgroundColor: "orange",
                    // ↓ 修正完了 2024/09/26
                    height: props.height,

                    overflow: "hidden",
                    // ↑ overflow: "hidden",はプレイヤーの角を丸める
                    // ↓ のコードを機能させるのに必要。
                    borderRadius: props.playerRadius ? "1em" : 0,
                },
                ...props.style,
            }}
        >
            <YouTube
                videoId={props.videoId ? props.videoId : ""}
                opts={YouTubeOpts}
                onStateChange={onStateChange}
                onReady={onReady}
            />
            </div>
            )
}
