"use client";

import { createContext, useContext, useState, useEffect } from "react";

/* ドキュメント https://js-cdn.music.apple.com/musickit/v3/docs/index.html?path=/story/get-started--page */

enum Types {
    albums = "albums",
    artists = "artists",
    songs = "songs",
    "library-albums" = "library-albums",
}
interface MusicKitApi {
    music(
        path: string,
        queryParameters?: {
            ids?: string[];
            l?: string; // ローカライズ("en-us")
            term?: string; // 検索ワード
            types?: Types;
            limit?: number; // 何件取得するか
            offset?: number; // 既に取得している件数
            "filter[featured]"?: string; // ラジオ再生に使用。
            "filter[identity]"?: string;
        },
        // options?: { fetchOptions?: {} },
    ): string;
    // data: {data: any[]};
}

interface PlaybackBitrate {
    bitrate: number; // 再生ビットレート（例: 128, 256, 320など）
}

interface MediaItem {
    id: string; // メディアアイテムのID
    attributes: {
        artistName: string;
        artwork: {
            width: number;
            height: number;
            url: string;
        };
        dateAdded: string;
        genreNames: string[];
        name: string;
        playParams: {
            id: string;
            kind: Types;
            isLibrary: boolean;
        };
        releaseDate: string;
        trackCount: number;
    };
    name: string; // 曲の名前
    type: Types; // 種類
    title: string; // 曲のタイトル
    artist: string; // アーティスト名
    album: string; // アルバムのID？
    artworkUrl: string; // アートワークURL
    duration: number; // 曲の長さ（秒単位）
}

interface AppleMusicInstance {
    storefrontCountryCode: string; // 国コード デフォルトは"us"
    storefrontId: string;
    changeUserStorefront(storefrontId: string): void; // storefrontの変更

    // Apple Music加入者はフルで再生可能。未加入は30秒程の視聴が可能(?)

    // 認証状態
    isAuthorized: boolean;
    previewOnly: boolean; // 視聴のみかどうか。
    // 認証を開始
    authorize(): void;
    // 認証解除
    unauthorize(): void;

    // 再生
    isPlaying: boolean; // Playerが再生可能かどうか
    // queue: Queue; // 再生キュー
    queueIsEmpty: boolean; // 再生キューが空かどうか
    setQueue(queryParameters: {
        station?: string; // stationのID
        album?: string; // アルバムのID
        items?: MediaItem[]; // 再生する曲のリスト
        length?: number; // 再生する曲の数
        startPlaying?: boolean;
        musicVideo?: string;
    }): void;
    clearQueue(): void;
    nowPlayingItem: MediaItem | undefined; // 現在再生中の曲
    nowPlayingItemIndex: number; // 現在再生中の曲のインデックス
    play(): void;
    pause(): void;
    stop(): void;
    currentPlaybackDuration: number; // 曲の長さ
    currentPlaybackProgress: number; // 読み込みの進捗
    currentPlaybackTime: number; // 現在の再生位置
    currentPlaybackTimeRemaining: number; // 残り再生時間
    playbackRate: number; // 再生速度
    // playbackState: PlaybackStates; // 再生状態
    // repeatMode: PlayerRepeatMode; // リピートモード
    // seekSeconds: SeekSecounds | undefined; // 再生位置を指定
    // shuffleMode: PlayerShuffleMode;

    videoContainerElement: HTMLElement | undefined; // ビデオコンテナ
    volume: number; // 音量
    mute(): void; // ミュート
    unmute(): void; // ミュート解除

    changeToMediaAtIndex(index: number): void; // インデックスの曲に変更
    changeToMediaItem(descriptor: MediaItem | string): void; // 曲の変更

    exitFullscreen(): void; // フルスクリーンを終了

    api: MusicKitApi;
    bitrate: PlaybackBitrate;
}

// MusicKit の型と設定
interface AppleMusicContextProps {
    // インスタンス
    musicKitInstance: AppleMusicInstance | null;
}

const AppleMusicContext = createContext<AppleMusicContextProps>({
    musicKitInstance: null,
});

// Apple Musicのコンテキストプロバイダー
export const AppleMusicProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [data, setData] = useState<AppleMusicContextProps>({
        musicKitInstance: null,
    });

    useEffect(() => {
        // MusicKitのスクリプトを読み込む
        const script = document.createElement("script");
        script.src = "https://js-cdn.music.apple.com/musickit/v3/musickit.js";
        script.setAttribute("data-web-components", "");
        script.async = true;
        document.head.appendChild(script);

        // MusicKitを初期化
        document.addEventListener("musickitloaded", async () => {
            // tokenを取得
            const response = await fetch(
                "https://api-py-tometome-org-254186269366.us-central1.run.app/applemusictoken",
            );
            if (!response.ok) {
                throw "Failed to fetch Apple Music Token";
            }
            const tokenJson: { token: string } = await response.json();

            // Call configure() to configure an instance of MusicKit on the Web.
            try {
                await window.MusicKit.configure({
                    developerToken:
                        process.env.NEXT_PUBLIC_STAGE === "dev"
                            ? // 開発用のtokenには有効期限があります。有効期限が切れた場合は、とめとめまで報告してください。
                              // 2025-07-29 03:44:03 まで有効
                              "eyJhbGciOiJFUzI1NiIsImtpZCI6IjVONDNYNlM5QVYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJYNjc3MkwyVDc5IiwiZXhwIjoxNzUzNzYwNjQzLCJpYXQiOjE3MzgyMDg2NDMsIm9yaWdpbiI6WyJodHRwOi8vbG9jYWxob3N0OjMwMDAiXX0.qyiyRqQCcA75br0hlcuxa6Kvv8rI4jLQqDvqVF6ka6rqmdy4STOl3sJ6lYMLehrzBsLrLgyR4Lhc9nkDAIh68Q"
                            : tokenJson.token,
                    app: {
                        name: "ぷらそにかアーカイブス",
                        build: "2025.1.30",
                        icon: "", // URL
                        // Ideally this image has a square aspect ratio and is 152px by 152px (2x image content to support Retina Displays). Display dimensions are 76px by 76px.
                    },
                });
            } catch (err) {
                // Handle configuration error
            }

            // MusicKit instance is available
            const musicInstance: AppleMusicInstance =
                window.MusicKit.getInstance();

            setData({
                musicKitInstance: musicInstance,
            });
        });
    }, []);
    return (
        <AppleMusicContext.Provider value={data}>
            {children}
        </AppleMusicContext.Provider>
    );
};

// コンテキストの利用
export const useAppleMusic = (): AppleMusicContextProps => {
    const context = useContext(AppleMusicContext);
    if (!context) {
        throw new Error(
            "useAppleMusic must be used within a AppleMusicProvider",
        );
    }
    return context;
};
