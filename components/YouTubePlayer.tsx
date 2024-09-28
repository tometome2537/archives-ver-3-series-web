import type React from "react";
import { useEffect, useState } from "react";
import YouTube, { type YouTubeProps } from "react-youtube";

type YouTubePlayerProps = {
  videoId?: string;
  width?: string;
  height?: string;
  style?: React.CSSProperties; // 外部からスタイルを受け取る（オプション）
  loop?: boolean; // ループ再生を制御するオプションを追加
};

export default function YouTubePlayer(props: YouTubePlayerProps) {
  const [playerState, setPlayerState] = useState<string>("不明"); // プレイヤーの状態を管理する状態変数
  const [player, setPlayer] = useState<any>(null); // YouTubeプレイヤーのインスタンス

  // YouTube Playerの再生オプション
  const YouTubeOpts: YouTubeProps["opts"] = {
    // widthは "％"の指定で良い。具体的な幅はPlayerの親要素で調節する。
    width: "100%",
    // heightは "%"で指定しても反映されない。pxで指定するある必要がある(説)。
    height: props.height || "390",
    playerVars: {
      autoplay: 1, // 自動再生
      loop: props.loop ? 1 : 0, // ループ再生の制御
      volume: 100, // デフォルト音量は100%
      playlist: props.loop && props.videoId ? props.videoId : undefined, // ループ時にプレイリストを設定
    },
  };

  // YouTube Playerの再生の状態を取得
  const onStateChange: YouTubeProps["onStateChange"] = (event) => {
    if (event && event.data !== undefined) {
      const state = event.data;
      switch (state) {
        case -1:
          setPlayerState("未開始");
          break;
        case 0:
          setPlayerState("終了");
          break;
        case 1:
          setPlayerState("再生中");
          break;
        case 2:
          setPlayerState("一時停止");
          break;
        case 3:
          setPlayerState("バッファリング");
          break;
        case 5:
          setPlayerState("頭出し（準備完了）");
          break;
        default:
          setPlayerState("不明");
          break;
      }
    }
  };

  // YouTube Playerの読み込みが完了した時
  const onReady: YouTubeProps["onReady"] = (event) => {
    setPlayer(event.target); // プレイヤーのインスタンスを保存
  };

  // 再生ボタンのハンドラ
  const handlePlay = () => {
    if (player) {
      player.playVideo();
    }
  };

  // 一時停止ボタンのハンドラ
  const handlePause = () => {
    if (player) {
      player.pauseVideo();
    }
  };

  return (
    <div
      style={{
        ...{
          width: props.width || "100%",
          height: props.height,
          // ↓ この色がついてるところをどうにかする To Do
          // 修正完了 2024/09/26
          // backgroundColor: "orange",
        },
        ...props.style,
      }}
    >
      <YouTube
        videoId={props.videoId || ""}
        opts={YouTubeOpts}
        onStateChange={onStateChange}
        onReady={onReady}
      />
      <div
        style={{
          display: "none",
        }}
      >
        {/* 再生状態表示 */}
        <p>再生状態: {playerState}</p>

        {/* 再生/一時停止ボタン */}
        <button onClick={handlePlay}>再生</button>
        <button onClick={handlePause}>一時停止</button>
      </div>
    </div>
  );
}
