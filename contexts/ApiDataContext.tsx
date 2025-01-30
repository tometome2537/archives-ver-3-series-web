"use client";

import { buildUrl } from "@/libs/urlBuilder";
import { createContext, useContext, useEffect, useState } from "react";
import type React from "react";

// デンジャラス！！空白のセルをSSSAPIで取得するとnullになります！　つまり　↓ の型定義にすべて | null を付与する必要があります！

export interface BelongHistory {
    entityId: string | null;
    entityOrganizationId: string | null;
}
export interface Entity {
    id: string | null;
    name: string | null;
    rubyJaHiragana: string | null;
    rubyEn: string | null;
    category: string | null;
}
export interface XAccount {
    entityId: string | null;
    userName: string | null;
}
export interface YouTubeAccount {
    userId: string | null;
    entityId: string | null;
    userName: string | null;
    name: string | null;
    officialArtistChannel: string | null;
    topic: boolean | null;
    apiData: string | null;
}
export interface Music {
    id: string | null;
    musicTitle: string | null;
    musicArtist: string | null;
    subscriptionUrl: string | null;
}
export interface Video {
    videoId: string | null;
    channelId: string | null;
    channelTitle: string | null;
    videoArchiveUrl: string | null;
    thumbnailArchiveUrl: string | null;
    title: string | null;
    publishedAt: string | null;
    privacyStatus: string | null;
    viewCount: number | null;
    short: boolean | null;
    live: boolean | null;
    categoryFromYTApi: number | null; // カテゴリ（YouTube APIから取得）
    category: string | null; // カテゴリ（手動設定、null可）
    tagText: string | null;
    person: string | null;
    addPerson: string | null;
    deletePerson: string | null;
    organization: string | null;
    addOrganization: string | null;
    deleteOrganization: string | null;
    karaokeKey: string | null;
    apiData: string | null;
}
export interface ArtistYTM {
    description: string;
    views: number;
    name: string;
    channelId: string; // topicチャンネルのIDが返される。
    subscribers: number;
    thumbnails: { url: string; width: number; height: number }[];
    songs?: {
        browseId: string | null;
        results?: {
            videoId: string;
            artists: { name: string; id: string }[];
            album: { name: string; id: string };
            title: string;
            browseId: string;
            audioPlaylistId: string;
            thumbnails: { url: string; width: number; height: number }[];
        }[];
    };
    albums?: {
        browseId: string | null;
        results?: {
            title: string;
            browseId: string;
            audioPlaylistId: string;
            thumbnails: { url: string; width: number; height: number }[];
        }[];
        params: string | null;
    };
    singles?: {
        browseId: string | null;
        results?: {
            title: string;
            year: string;
            browseId: string;
            thumbnails: { url: string; width: number; height: number }[];
        }[];
        params: string | null;
    };
    videos?: {
        browseId: string | null;
        results?: {
            title: string;
            videoId: string;
            artists: { name: string; id: string }[];
            playlistId: string;
            thumbnails: { url: string; width: number; height: number }[];
            views: string;
        }[];
        params: string | null;
    };
}
export interface AlbumYTM {
    title: string;
    type: string;
    thumbnails: { url: string; width: number; height: number }[];
    isExplicit: boolean;
    description: string | null;
    artists: { name: string; id: string }[];
    trackCount: number;
    duration: string;
    audioPlaylistId: string;
    tracks: {
        videoId: string;
        title: string;
        artists: { name: string; id: string }[];
        album: string;
        likeStatus: string;
        inLibrary: boolean | null;
        thumbnails: { url: string; width: number; height: number }[];
        isAvailable: boolean;
        isExplicit: boolean;
        videoType: string;
        views: string;
        trackNumber: number;
        duration: string;
        duration_seconds: number;
    }[];
    other_versions: {
        title: string;
        type: string;
        artists: { name: string; id: string }[];
        browseId: string;
        audioPlaylistId: string;
        thumbnails: { url: string; width: number; height: number }[];
        isExplicit: boolean;
    }[];
    duration_seconds: number;
}
export interface YdbVideo {
    status: string;
    channelIds: string[];
    videos: {
        id: string;
        videoId: string;
        videoOwnerChannelId: string;
        channelId?: string | undefined;
        privacyStatus: string;
        youTubeApi: {
            id: string;
            snippet: {
                publishedAt: string;
                title: string;
                description: string;
                channelTitle: string;
            };
        };
    }[];
}
export interface AppleMusicAccount {
    entityId: string;
    appleMusicArtistId: string;
}

interface FetchOption {
    headers?: { Authorization?: string };
    next?: { revalidate?: number };
}

// DataContextType のジェネリクス型定義
export interface ApiData<T> {
    url: string;
    fetchOption?: FetchOption;
    // getData実行時のステータス
    status: "idle" | "loading" | "error" | "success";
    // APIデータ
    data: T;
    // APIデータを取得しdataに保存する。
    getData: () => Promise<T>;
    // Getメソッドを使用してAPIを叩く。dataに保存はされない。
    getDataWithParams: (getParams?: Record<string, string>) => Promise<T>;
}

export interface ApiDataContextType {
    YouTubeAccount: ApiData<YouTubeAccount[]>;
    Entity: ApiData<Entity[]>;
    Music: ApiData<Music[]>;
    XAccount: ApiData<XAccount[]>;
    BelongHistory: ApiData<BelongHistory[]>;
    Video: ApiData<Video[]>;
    ArtistYTM: ApiData<ArtistYTM | null>;
    AlbumYTM: ApiData<AlbumYTM | null>;
    YdbVideo: ApiData<YdbVideo | null>;
    AppleMusicAccount: ApiData<AppleMusicAccount[]>;
}

export const SSSAPI_TOKEN = "s3a_aBU5U86DKPiAuUvWrPHx+q44l_tQJJJ=0L9I";

const sssApiFetchOption = {
    headers: {
        Authorization: `token ${SSSAPI_TOKEN}`,
    },
    next: { revalidate: 60 * 60 * 24 },
};

// idとURLの関係を定義
const ApiData: ApiDataContextType = {
    YouTubeAccount: {
        url: "https://api.sssapi.app/lUvQb56owZaGWWXIWXlCE",
        fetchOption: sssApiFetchOption,
        status: "idle",
        data: [],
        getData: async () => [],
        getDataWithParams: async () => [],
    },
    Entity: {
        url: "https://api.sssapi.app/ZJUpXwYIh9lpfn3DQuyzS",
        fetchOption: sssApiFetchOption,
        status: "idle",
        data: [],
        getData: async () => [],
        getDataWithParams: async () => [],
    },
    Music: {
        url: "https://api.sssapi.app/V_H20t9RBDxXC4vbI-kKy",
        fetchOption: sssApiFetchOption,
        status: "idle",
        data: [],
        getData: async () => [],
        getDataWithParams: async () => [],
    },
    XAccount: {
        url: "https://api.sssapi.app/vk3bc_hfvgsR9hs0X6iBk",
        fetchOption: sssApiFetchOption,
        status: "idle",
        data: [],
        getData: async () => [],
        getDataWithParams: async () => [],
    },
    BelongHistory: {
        url: "https://api.sssapi.app/HXy5cl24OnVmRtM9EtO_G",
        fetchOption: sssApiFetchOption,
        status: "idle",
        data: [],
        getData: async () => [],
        getDataWithParams: async () => [],
    },
    AppleMusicAccount: {
        url: "https://api.sssapi.app/p5X0V8UvwkMBE0QJqSfXb",
        fetchOption: sssApiFetchOption,
        status: "idle",
        data: [],
        getData: async () => [],
        getDataWithParams: async () => [],
    },
    Video: {
        url: "https://api.sssapi.app/mGZMorh9GOgyer1w4LvBp",
        fetchOption: {
            headers: {
                Authorization: `token ${SSSAPI_TOKEN}`,
            },
        },
        status: "idle",
        data: [],
        getData: async () => [],
        getDataWithParams: async () => [],
    },
    ArtistYTM: {
        url: "https://api-py-tometome-org-254186269366.us-central1.run.app/ytm/get_artist",
        // url: "http://127.0.0.1:8000/ytm/get_artist",
        fetchOption: {},
        status: "idle",
        data: null,
        getData: async () => null,
        getDataWithParams: async () => null,
    },
    AlbumYTM: {
        url: "https://api-py-tometome-org-254186269366.us-central1.run.app/ytm/get_album",
        // url: "http://127.0.0.1:8000/ytm/get_album",
        fetchOption: {},
        status: "idle",
        data: null,
        getData: async () => null,
        getDataWithParams: async () => null,
    },
    YdbVideo: {
        url: "https://api-py-tometome-org-254186269366.us-central1.run.app/ydb/video/list",
        // url: "http://127.0.0.1:8000/ydb/video/list",
        fetchOption: {},
        status: "idle",
        data: null,
        getData: async () => null,
        getDataWithParams: async () => null,
    },
};

// コンテキストを作成
export const ApiDataContext = createContext<ApiDataContextType>(ApiData);

// コンテキストプロバイダー
export const ApiDataProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [data, setData] = useState<ApiDataContextType>(ApiData);

    // useEffect 内の fetchData を更新
    useEffect(() => {
        const fetchData = async () => {
            try {
                // 各データタイプのループ処理
                const updatedData: ApiDataContextType = { ...ApiData }; // 現在のデータ定義をコピー

                // Fetcher関数の定義
                const fetcher = async (url: string, option: FetchOption) => {
                    const response = await fetch(url, option);
                    if (!response.ok) {
                        throw new Error(`Failed to fetch data from ${url}`);
                    }
                    return response.json();
                };

                for (const key in ApiData) {
                    if (Object.prototype.hasOwnProperty.call(ApiData, key)) {
                        const contextItem =
                            updatedData[key as keyof ApiDataContextType];

                        const getData = async () => {
                            try {
                                // status が "idle" の場合のみデータ取得処理を実行
                                if (contextItem.status === "idle") {
                                    console.log(`Fetching data for ${key}...`);
                                    // 通信開始前にstatusを"loading"に設定
                                    contextItem.status = "loading";

                                    // フェッチ処理
                                    const result = await fetcher(
                                        contextItem.url,
                                        contextItem.fetchOption || {},
                                    );

                                    // 状態を更新
                                    contextItem.status = "success";
                                    contextItem.data = result;

                                    // ここでstateを更新し、再レンダリングを促す
                                    setData((prevState) => ({
                                        ...prevState,
                                        [key]: { ...contextItem },
                                    }));

                                    return result;
                                }
                            } catch (error) {
                                console.error(
                                    `Error fetching data for ${key}:`,
                                    error,
                                );
                                contextItem.status = "error";

                                throw error;
                            }
                            return contextItem.data;
                        };

                        const getDataWithParams = async (
                            getParams?: Record<string, string>,
                        ) => {
                            console.log(
                                `Fetching data for ${key}... with getParams:`,
                                getParams,
                            );
                            const url = buildUrl(contextItem.url, getParams);
                            // フェッチ処理
                            return await fetcher(
                                url,
                                contextItem.fetchOption || {},
                            );
                        };

                        // `getData` を更新
                        contextItem.getData = getData;
                        contextItem.getDataWithParams = getDataWithParams;
                    }
                }

                // 新しいデータ定義をセット
                setData(updatedData);
            } catch (error) {
                console.error("An error occurred while fetching data:", error);
            }
        };

        // 初回レンダリング時のみデータ取得を実行
        fetchData();
    }, []);

    return (
        <ApiDataContext.Provider value={data}>
            {children}
        </ApiDataContext.Provider>
    );
};

// データコンテキストを利用するカスタムフック
export const useApiDataContext = (...apiNames: string[]) => {
    const context = useContext(ApiDataContext);
    if (!context) {
        throw new Error(
            "useApiDataContext must be used within a ApiDataProvider",
        );
    }
    for (const name of apiNames) {
        if (!context[name as keyof ApiDataContextType]) {
            throw new Error(
                `useApiDataContext: ${name} is not found in ApiDataContext`,
            );
        }
        // APIデータを取得
        context[name as keyof ApiDataContextType].getData();
    }
    return context;
};
