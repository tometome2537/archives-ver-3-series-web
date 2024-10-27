"use client";

import { createContext, useContext, useState, useEffect } from "react";
import type React from "react";

// データフェッチャー関数
const fetcher = (url: string) => fetch(url).then((res) => res.json());

// YouTubeAccount 型の定義
export type apiData = {
    id: string;
    entityId: string;
    userName: string;
    name: string;
    officialArtistChannel: string;
    category: string;
    apiData: string;
};

// コンテキストの型定義
// @biome-ignore
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
    {
        id: "XAccount",
        url: "https://api.sssapi.app/vk3bc_hfvgsR9hs0X6iBk",
    },
    {
        id: "Entity",
        url: "https://api.sssapi.app/ZJUpXwYIh9lpfn3DQuyzS",
    },
    // {
    //     id: "Video",
    //     url: "https://api.sssapi.app/mGZMorh9GOgyer1w4LvBp"
    // }
];

/*
とめとめメモ
SssAPI等の１度取得すればOKなデータは変数に保存し、
コンテキストからどのページでも読み取れるようにしておく。
*/

// コンテキストプロバイダー
export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [data, setData] = useState<DataContextType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const result: DataContextType[] = await Promise.all(
                    Db.map(async (dbItem) => {
                        const data = await fetcher(dbItem.url);
                        return {
                            id: dbItem.id,
                            data: data,
                            isLoading: false,
                            error: false,
                        };
                    }),
                );
                setData(result);
            } catch (error) {
                setError(true);
            } finally {
                setLoading(false);
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
