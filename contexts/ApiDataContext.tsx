"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type React from "react";

// データフェッチャー関数
const fetcher = async (url: string) => {
    const response = await fetch(url, {
        headers: {
            Authorization: "token s3a_aBU5U86DKPiAuUvWrPHx+q44l_tQJJJ=0L9I",
        },
        // 1ヶ月を秒にしたやつ
        // 60 * 60 * 24 * 30 = 2592000
        next: { revalidate: 2592000 },
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch data from ${url}`);
    }
    return response.json();
};

// YouTubeAccount 型の定義
export type apiData = {
    id: string;
    entityId: string;
    userName: string;
    name: string;
    officialArtistChannel: string;
    category: string;
    apiData: string;

    musicTitle?: string;
    musicArtist?: string;
    subscriptionUrl?: string;
};

// コンテキストの型定義
export type DataContextType = {
    id: string;
    data: apiData[];
    isLoading: boolean;
    error: boolean;
};

// コンテキストを作成
export const DataContext = createContext<DataContextType[]>([]);

// idとURLの関係を定義
const Db: { id: string; url: string }[] = [
    {
        id: "YouTubeAccount",
        url: "https://api.sssapi.app/lUvQb56owZaGWWXIWXlCE",
    },
    // {
    //     id: "XAccount",
    //     url: "https://api.sssapi.app/vk3bc_hfvgsR9hs0X6iBk",
    // },
    {
        id: "Entity",
        url: "https://api.sssapi.app/ZJUpXwYIh9lpfn3DQuyzS",
    },
    {
        id: "Music",
        url: "https://api.sssapi.app/V_H20t9RBDxXC4vbI-kKy",
    },
    // {
    //     id: "BelongHistory",
    //     url: "https://api.sssapi.app/HXy5cl24OnVmRtM9EtO_G",
    // },
    // {
    //     id: "Video",
    //     url: "https://api.sssapi.app/mGZMorh9GOgyer1w4LvBp",
    // },
];

// コンテキストプロバイダー
export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [data, setData] = useState<DataContextType[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result: DataContextType[] = await Promise.all(
                    Db.map(async (dbItem) => {
                        try {
                            const fetchedData = await fetcher(dbItem.url);
                            return {
                                id: dbItem.id,
                                data: fetchedData,
                                isLoading: false,
                                error: false,
                            };
                        } catch (error) {
                            return {
                                id: dbItem.id,
                                data: [],
                                isLoading: false,
                                error: true,
                            };
                        }
                    }),
                );
                setData(result);
            } catch (error) {
                console.error("An error occurred while fetching data:", error);
            }
        };
        fetchData();
    }, []);

    return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
};

// データコンテキストを利用するカスタムフック
export const useDataContext = () => {
    const context = useContext(DataContext);
    return context;
};
