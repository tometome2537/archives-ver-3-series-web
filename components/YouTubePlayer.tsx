import YouTube, { YouTubeProps } from "react-youtube";
import React, {
    Dispatch,
    SetStateAction,
    useEffect,
    useState,
    MutableRefObject,
    // useRef
} from "react";

type YouTubePlayerProps = {
    videoId?: string;
    width?: string;
    height?: string;
    style?: React.CSSProperties; // 外部からスタイルを受け取る（オプション）
}

export default function YouTubePlayer(props: YouTubePlayerProps) {

    const [playerState, setPlayerState] = useState<string>("不明"); // プレイヤーの状態を管理する状態変数

    // YouTube Playerの再生オプション
    const YouTubeOpts: YouTubeProps["opts"] = {
        // widthは "％"の指定で良い。具体的な幅はPlayerの親要素で調節する。
        width: "100%",
        // heightは "%"で指定しても反映されない。pxで指定するある必要がある(説)。
        height: props.height,

        playerVars: {
            autoplay: 1, // 自動再生
            loop: 1, // ループ再生
            volume: 100, // デフォルト音量は100%
            // playlist: playNow ? playNow.videoId : "", // ループ時にプレイリスト設定
        },
    };
    // YouTube Playerの再生の状態を取得
    const onStateChange: YouTubeProps['onStateChange'] = (event) => {
        // 状態を取得
        if (event && event.data) {
            let state = event.data;
            switch (state) {
                case -1:
                    setPlayerState('未開始')
                case 0:
                    setPlayerState('終了')
                case 1:
                    setPlayerState('再生中')
                case 2:
                    setPlayerState('一時停止')
                case 3:
                    setPlayerState('バッファリング')
                case 5:
                    setPlayerState('頭出し（準備完了）')
                default:
                    setPlayerState('不明')
            }
        }
    };
    // YouTube Playerの読み込みが完了した時
    const onReady: YouTubeProps['onReady'] = (event) => {

    };

    return (
        <div style={{
            ...{
                width: props.width,
                // ↓ この色がついてるところをどうにかする To Do
                backgroundColor: "orange",
            },
            ...props.style
        }}>
            <YouTube
                videoId={props.videoId ? props.videoId : ""}
                opts={YouTubeOpts}
                onStateChange={onStateChange}
                onReady={onReady}
            />
        </div >
    )
}