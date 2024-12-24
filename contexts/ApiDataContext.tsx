"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type React from "react";

interface BiomeErrorKaihi {
    __mudasugi?: string;
}
export interface BelongHistory extends BiomeErrorKaihi {
    entityId: string;
    entityOrganizationId: string;
}
export interface Entity extends BiomeErrorKaihi {
    id: string;
    name: string;
    category: string;
}
export interface XAccount extends BiomeErrorKaihi {
    entityId: string;
    userName: string;
}
export interface YouTubeAccount extends BiomeErrorKaihi {
    userId: string;
    entityId: string;
    userName: string;
    name: string;
    officialArtistChannel: string;
    apiData: string;
}
export interface Music extends BiomeErrorKaihi {
    id: string;
    musicTitle: string;
    musicArtist: string;
    subscriptionUrl: string;
}

interface FetchOption {
    headers?: { Authorization?: string };
    next?: { revalidate?: number };
}

// DataContextType のジェネリクス型定義
export interface ApiData<T> {
    url: string;
    fetchOption?: FetchOption;
    status: "idle" | "loading" | "error" | "success";
    // APIデータ
    data: T;
    // APIデータを取得する関数
    getData: () => void;
}

export interface ApiDataContextType {
    YouTubeAccount: ApiData<YouTubeAccount[]>;
    Entity: ApiData<Entity[]>;
    Music: ApiData<Music[]>;
    XAccount: ApiData<XAccount[]>;
    BelongHistory: ApiData<BelongHistory[]>;

    [key: string]: ApiData<BiomeErrorKaihi[]>;
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
        getData: () => {},
    },
    Entity: {
        url: "https://api.sssapi.app/ZJUpXwYIh9lpfn3DQuyzS",
        fetchOption: sssApiFetchOption,
        status: "idle",
        data: [],
        getData: () => {},
    },
    Music: {
        url: "https://api.sssapi.app/V_H20t9RBDxXC4vbI-kKy",
        fetchOption: sssApiFetchOption,
        status: "idle",
        data: [],
        getData: () => {},
    },
    XAccount: {
        url: "https://api.sssapi.app/vk3bc_hfvgsR9hs0X6iBk",
        fetchOption: sssApiFetchOption,
        status: "idle",
        data: [],
        getData: () => {},
    },
    BelongHistory: {
        url: "https://api.sssapi.app/HXy5cl24OnVmRtM9EtO_G",
        fetchOption: sssApiFetchOption,
        status: "idle",
        data: [],
        getData: () => {},
    },
    /*
    Video: {
        url: "https://api.sssapi.app/mGZMorh9GOgyer1w4LvBp",
        option: sssApiFetchOption,
        status: "idle",
        data: [],
        getData: () => [],
    },
    */
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
                // Fetcher関数の定義
                const fetcher = async (url: string, option: FetchOption) => {
                    const response = await fetch(url, option);
                    if (!response.ok) {
                        throw new Error(`Failed to fetch data from ${url}`);
                    }
                    return response.json();
                };

                // 各データタイプのループ処理
                const updatedData: ApiDataContextType = { ...ApiData }; // 現在のデータ定義をコピー

                for (const key in ApiData) {
                    if (Object.prototype.hasOwnProperty.call(ApiData, key)) {
                        const contextItem =
                            ApiData[key as keyof ApiDataContextType];

                        const getData = async () => {
                            try {
                                if (contextItem.status === "idle") {
                                    // フェッチ処理
                                    const result = await fetcher(
                                        contextItem.url,
                                        contextItem.fetchOption || {},
                                    );

                                    // 状態を更新
                                    setData((prevState) => ({
                                        ...prevState,
                                        [key]: {
                                            ...prevState[
                                                key as keyof ApiDataContextType
                                            ],
                                            status: "success",
                                            data: result,
                                        },
                                    }));
                                }
                            } catch (error) {
                                console.error(
                                    `Error fetching data for ${key}:`,
                                    error,
                                );
                                setData((prevState) => ({
                                    ...prevState,
                                    [key]: {
                                        ...prevState[
                                            key as keyof ApiDataContextType
                                        ],
                                        status: "error",
                                        data: [],
                                    },
                                }));
                                throw error;
                            }
                        };

                        // `getData` を更新
                        updatedData[key as keyof ApiDataContextType] = {
                            ...contextItem,
                            getData,
                        };
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
    for(const name of apiNames){
        if(!context[name]){
            throw new Error(`useApiDataContext: ${name} is not found in ApiDataContext`);
        }
        // APIデータを取得
        context[name].getData();
    }
    return context;
};
