"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type React from "react";

// コンテキストの型定義
export type BrowserInfoContextType = {
    // 画面横幅
    screenWidth: number;
    // 画面縦幅
    screenHeight: number;
    // スマホかどうか
    isMobile: boolean;
};

// デフォルトの設定
const defaultConfig: BrowserInfoContextType = {
    screenWidth: 1000,
    screenHeight: 800,
    isMobile: false,
};

// コンテキストを作成
export const BrowserInfoContext =
    createContext<BrowserInfoContextType>(defaultConfig);

// コンテキストプロバイダー
export const BrowserInfoProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [screenWidth, setScreenWidth] = useState<number>(
        defaultConfig.screenWidth,
    );
    const [screenHeight, setScreenHeight] = useState<number>(
        defaultConfig.screenHeight,
    );
    const [isMobile, setIsMobile] = useState<boolean>(defaultConfig.isMobile);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const handleResize = () => {
                // 画面の横幅と縦幅を取得
                setScreenWidth(window.innerWidth);
                setScreenHeight(window.innerHeight);

                // スクリーン幅が768px以下の場合はスマホと判定
                setIsMobile(window.innerWidth <= 768);
            };

            // 初回の幅と高さを設定
            handleResize();

            // リサイズイベントリスナーを追加
            window.addEventListener("resize", handleResize);

            // クリーンアップ関数でリスナーを解除
            return () => {
                window.removeEventListener("resize", handleResize);
            };
        }
    }, []);

    const data: BrowserInfoContextType = {
        screenWidth,
        screenHeight,
        isMobile,
    };

    return (
        <BrowserInfoContext.Provider value={data}>
            {children}
        </BrowserInfoContext.Provider>
    );
};

// データコンテキストを利用するカスタムフック
export const useBrowserInfoContext = () => {
    const context = useContext(BrowserInfoContext);
    if (!context) {
        throw new Error(
            "useBrowserInfoContext must be used within a BrowserInfoProvider",
        );
    }
    return context;
};
