import YouTube, { YouTubeProps } from "react-youtube";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Thumbnail from "./Thumbnail";

export type PlayerItem = {
    videoId?: string; // 動画IDをプロパティとして受け取る
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

export default function PlayerView(props: PlayerProps) {
    // 現在再生されている音楽
    const [playNow, setPlayNow] = useState<PlayerItem>({})
    // propsが変更されたらplayNowを更新。
    useEffect(() => {
        setPlayNow({
            videoId: props.PlayerItem.videoId,
            title: props.PlayerItem.title ? props.PlayerItem.title : ""
        })
    }, [props.PlayerItem.videoId]);

    // Playlist または searchResult が追加されたら拡大モード
    useEffect(() => {
        if ((props.Playlist ? props.Playlist.length == 0 ? false : true : false) || (props.searchResult ? props.searchResult.length == 0 ? false : true : false)) {
            props.setIsPlayerFullscreen(true)
        }

    }, [props.Playlist, props.searchResult]);

    const YouTubeOpts: YouTubeProps["opts"] = {
        width: props.isPlayerFullscreen ? "100%" : "",
        height: props.isPlayerFullscreen ? "400px" : "", // 確定 100%で親要素に依存
        playerVars: {
            autoplay: 1, // 自動再生
            loop: 1, // ループ再生
            volume: 100, // デフォルト音量は100%
            // playlist: playNow ? playNow.videoId : "", // ループ時にプレイリスト設定
        },
    };

    // YouTube ラッパー
    const YouTubeWrapper: React.CSSProperties = {
        display: "block", // アクティブかどうかで表示/非表示を切り替え
        width: "100%",
        // height: "100%",

        maxWidth: props.isPlayerFullscreen ? "100%" : "100vw", // 最大幅を画面の横幅にする。
        maxHeight: "100%", // 高さに制限をつけることでパソコンのモニター等で無制限に大きくならないようにする。
        // backgroundColor: "#FFD700",
        textAlign: "center",
        padding: "0", // プレイヤーの上下にスペースを追加
        margin: "0"
    };

    // 拡大モードの切り替えスイッチ
    const togglePlayerFullscreen = (event: React.MouseEvent<HTMLElement>) => {
        if (props.isPlayerFullscreen) {
            props.setIsPlayerFullscreen(false)
        } else {
            props.setIsPlayerFullscreen(true)
        }
    }


    // サムネイルがクリックされた時
    const handleVideoClick = (event: React.MouseEvent<HTMLElement>) => {
        const videoId = event.currentTarget.getAttribute("data-videoId")
        const title = event.currentTarget.getAttribute("data-title")

        setPlayNow({
            videoId: videoId ? videoId : undefined,
            title: title ? title : undefined
        })
    }

    return (
        <div style={{
            // videoIdがセットされていない時はPlayerを非表示
            display: playNow.videoId ? "block" : "none",
            // 拡大モードの時、Playerを画面上下いっぱいまで広げる。
            height: props.isPlayerFullscreen ? "100vh" : "100%",
            // 拡大モードの時、縦スクロールを許可しない。
            overflowY: props.isPlayerFullscreen ? "hidden" : "auto",
        }}>
            <div style={{
                ...{
                    display: "flex",
                    width: "100%",
                    height: "100%",
                    maxWidth: "100vw", // 確定
                    maxHeight: "100%", // 確定
                    // backgroundColor: "white",
                    backgroundColor: "yellow",
                    textAlign: "center",
                    padding: "0", // プレイヤーの上下にスペースを追加
                    margin: "0"
                },
                ...props.style
            }}>

                <div style={{
                    position: "relative",
                    display: props.isPlayerFullscreen ? "block" : "flex",
                    width: props.isPlayerFullscreen ? "70%" : "",
                    margin: props.isPlayerFullscreen ? "" : "0 auto",
                }}>
                    <div style={{ ...YouTubeWrapper }}>
                        {playNow && (
                            <YouTube videoId={playNow ? playNow.videoId : ""} opts={YouTubeOpts} />
                        )}
                    </div>
                    <div onClick={togglePlayerFullscreen} style={{
                        // width: props.isPlayerFullscreen ? "" : "60%",
                    }}>
                        <p style={{
                            /* 要素に幅を持たせるために必要 */
                            display: "block",
                            /* 29文字分確保 */
                            // width: "29ch",
                            // width: "60%",
                            /* 改行を防ぐ */
                            whiteSpace: "nowrap",
                            /* 溢れた文字を隠す  */
                            overflow: "hidden",
                            /* 長すぎる場合に "..." を付ける  */
                            textOverflow: "ellipsis"
                        }}>
                            {playNow ? playNow.title : ""}
                        </p>
                        <p>ぷらそにか{String(props.isPlayerFullscreen)}</p>
                        <div>{props.isPlayerFullscreen && "ミニプレイヤー切り替えボタン(仮)"}</div>
                    </div>
                </div>
                <div style={{
                    // 拡大モードで右カラムを表示
                    display: props.isPlayerFullscreen ? "block" : "none",
                    position: "relative",
                    width: "30%",
                }}>
                    <div style={{
                        maxHeight: "100vh",
                        overflowY: "auto",
                        paddingBottom: "25vh"
                    }}>
                        {props.searchResult ? props.searchResult.map((item: PlayerItem, index: number) => (
                            <Thumbnail
                                key={index}
                                videoId={item.videoId ? item.videoId : ""}
                                title={item.title ? item.title : ""}
                                onClick={handleVideoClick}
                            />
                        )) : null}
                    </div>
                </div>
            </div>
        </div >
    );
}
