import type React from "react";
import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import YouTube, { type YouTubeProps, type YouTubePlayer } from "react-youtube";

type YouTubePlayerViewProps = {
    videoId?: string;
    width?: string;
    height?: string;
    style?: React.CSSProperties; // 外部からスタイルを受け取る（オプション）
    loop?: boolean; // ループ再生を制御するオプションを追加
    playerRadius?: boolean;
    setPlayerState?: Dispatch<SetStateAction<string | undefined>>;
    setPlayer?: Dispatch<SetStateAction<YouTubePlayer | undefined>>;
};

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
            loop: props.loop ? 1 : 0, // ループ再生の制御
            playlist: props.loop && props.videoId ? props.videoId : undefined, // ループ時にプレイリストを設定
        },
    };

    // YouTube Playerの再生の状態を取得
    const onStateChange: YouTubeProps["onStateChange"] = (event) => {
        if (event && event.data !== undefined) {
            const state = event.data;
            switch (state) {
                case -1:
                    props.setPlayerState
                        ? props.setPlayerState("未開始")
                        : null;
                    break;
                case 0:
                    props.setPlayerState ? props.setPlayerState("終了") : null;
                    break;
                case 1:
                    props.setPlayerState
                        ? props.setPlayerState("再生中")
                        : null;
                    break;
                case 2:
                    props.setPlayerState
                        ? props.setPlayerState("一時停止")
                        : null;
                    break;
                case 3:
                    props.setPlayerState
                        ? props.setPlayerState("バッファリング")
                        : null;
                    break;
                case 5:
                    props.setPlayerState
                        ? props.setPlayerState("頭出し（準備完了）")
                        : null;
                    break;
                default:
                    props.setPlayerState
                        ? props.setPlayerState(undefined)
                        : null;
                    break;
            }
        }
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
            <div>{/* <p>{props.videoId}</p> */}</div>
        </div>
    );
}
