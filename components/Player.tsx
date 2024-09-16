import YouTube, { YouTubeProps } from "react-youtube";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

export type PlayerItem = {
    videoId: string; // 動画IDをプロパティとして受け取る
    title?: string;
};

type PlayerProps = {
    // フルスクリーンで表示するかどうか
    isPlayerFullscreen: boolean;
    setIsPlayerFullscreen: Dispatch<SetStateAction<boolean>>;
    PlayerItem: PlayerItem;
    Playlist?: Array<PlayerItem>; // プレイリスト
    searchResult?: Array<PlayerItem>; // 検索結果のリスト
    style?: React.CSSProperties; // 外部からスタイルを受け取る（オプション）
};

export default function Player(props: PlayerProps) {
    const opts: YouTubeProps["opts"] = {
        height: "390", // デフォルトの高さ
        width: "640", // デフォルトの幅
        playerVars: {
            autoplay: 1, // 自動再生
            loop: 1, // ループ再生
            volume: 100, // デフォルト音量は100%
            playlist: props.PlayerItem.videoId, // ループ時にプレイリスト設定
        },
    };

    // 基本スタイル
    const defaultStyle: React.CSSProperties = {
        display: props.isPlayerFullscreen === true ? "none" : "block", // アクティブかどうかで表示/非表示を切り替え
        width: "100%",
        backgroundColor: "#FFD700",
        textAlign: "center",
        padding: "0", // プレイヤーの上下にスペースを追加
    };

    return (
        <div style={{ ...defaultStyle, ...props.style }}>
            <YouTube videoId={props.PlayerItem.videoId} opts={opts} />
            {/* <p>{props.PlayerItem.title}</p> */}
        </div>
    );
}
