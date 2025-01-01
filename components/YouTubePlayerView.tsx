import type React from "react";
import { type Dispatch, Fragment, type SetStateAction } from "react";
import YouTube, { type YouTubeProps, type YouTubePlayer } from "react-youtube";

type YouTubePlayerViewProps = {
    videoId?: string;
    aspectRatio?: number;
    width?: number;
    style?: React.CSSProperties; // 外部からスタイルを受け取る（オプション）
    playerRadius?: boolean;
    setPlayerState?: Dispatch<SetStateAction<YouTubePlayerState | undefined>>;
    setPlayer?: Dispatch<SetStateAction<YouTubePlayer | undefined>>;
};

/*
    // youtubePlayerの横幅(px)
    const playerWidth: number =
        isMobile && props.isPlayerFullscreen
            ? arWidth === arHeight // 正方形(比率が1:1)の場合
                ? screenWidth * 0.8 // 小さめに表示する。
                : screenWidth
            : props.isPlayerFullscreen
              ? ((screenHeight * 0.55) / arHeight) * arWidth
              : ((screenHeight * 0.1) / arHeight) * arWidth;
    // youtubePlayerの縦幅(px)
    const playerHeight: number =
        youTubeIframe.width < playerWidth
            ? (youTubeIframe.width / arWidth) * arHeight
            : (playerWidth / arWidth) * arHeight;
             */

enum State {
    unstarted = "unstarted",
    ended = "ended",
    playing = "playing",
    paused = "paused",
    buffering = "buffering",
    videoCued = "videoCued", //（準備完了）
    undefined = "undefined",
}

export type YouTubePlayerState = {
    state: State;
    stateNumber: number;
    getVideoData: {
        video_id: string;
        title: string;
        author: string;
        video_quality: string;
        isPlayable: boolean;
        isPrivate: boolean;
        isLive: boolean;
        errorCode: number;
        video_quality_features: string[];
        backgroundable: boolean;
        eventId: string;
        cpn: string;
        isWindowedLive: boolean;
        isManifestless: boolean;
        allowLiveDvr: boolean;
        isListed: boolean;
        isMultiChannelAudio: boolean;
        hasProgressBarBoundaries: boolean;
        isPremiere: boolean;
        itct: string;
        playerResponseCpn: string;
        progressBarStartPositionUtcTimeMillis: string;
        progressBarEndPositionUtcTimeMillis: string;
        paidContentOverlayDurationMs: number;
    };
    getCurrentTime: number;
    getDuration: number;
    getVideoUrl: string;
    isMuted: boolean;
};

export default function YouTubePlayerView(props: YouTubePlayerViewProps) {
    // YouTube Playerの再生オプション
    const YouTubeOpts: YouTubeProps["opts"] = {
        width: "100%",
        height: "100%",
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 1, // 自動再生
            loop: 0, // デフォルトはループしない。
            playlist: undefined,
        },
    };

    // YouTube Playerの再生の状態を取得
    const onStateChange: YouTubeProps["onStateChange"] = (event) => {
        const stateMap: { [key: number]: State } = {
            [-1]: State.unstarted,
            [0]: State.ended,
            [1]: State.playing,
            [2]: State.paused,
            [3]: State.buffering,
            [5]: State.videoCued,
        };
        const r = {
            state: stateMap[event?.data] ?? State.undefined,
            stateNumber: event?.data,
            getVideoData: event?.target?.getVideoData(),
            getCurrentTime: event?.target?.getCurrentTime(),
            getDuration: event?.target?.getDuration(),
            getVideoUrl: event?.target?.getVideoUrl(),
            isMuted: event?.target?.isMuted(),
        };
        props.setPlayerState?.(r);
    };

    // YouTube Playerの読み込みが完了した時
    const onReady: YouTubeProps["onReady"] = (event) => {
        if (props.setPlayer) {
            props.setPlayer(event.target); // プレイヤーのインスタンスを保存
        }
    };

    return (
        <Fragment>
            <YouTube
                videoId={props.videoId ? props.videoId : ""}
                style={{
                    width: props.width,
                    aspectRatio: props.aspectRatio,
                    overflow: "hidden",
                    // ↑ overflow: "hidden",はプレイヤーの角を丸める
                    // ↓ のコードを機能させるのに必要。
                    borderRadius: props.playerRadius ? "1em" : 0,
                    ...props.style,
                    // width: "100%",
                    // height: "100%",
                }}
                className="youtube-container"
                opts={YouTubeOpts}
                onStateChange={onStateChange}
                onReady={onReady}
            />
            <style>{`
                .youtube-container iframe{
                    width: 100%;
                    height: 100%;
                }
            `}</style>
        </Fragment>
    );
}
