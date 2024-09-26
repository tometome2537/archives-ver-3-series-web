import { Dispatch, SetStateAction, MutableRefObject, useRef, useEffect, useState } from "react";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import AdbIcon from '@mui/icons-material/Adb';

type TabbarProps = {
    debugMode: boolean;
    setDebugMode: Dispatch<SetStateAction<boolean>>;
    activeTab: string;
    setActiveTab: Dispatch<SetStateAction<string>>;
    activeTabList: MutableRefObject<string[]>; // コロンではなく型を指定
    setIsPlayerFullscreen: Dispatch<SetStateAction<boolean>>;
    setTabbarHeight: Dispatch<SetStateAction<number>>;
    screenHeight: number;
    isMobile: boolean;
};

// タブがクリックされた時の処理
const handleTabClick = (props: TabbarProps, value: string) => {
    // アクティブタブに追加
    props.setActiveTab(value)
    // アクティブになったタブがリストにない場合は追加
    if (!props.activeTabList.current.includes(value)) {
        props.activeTabList.current.push(value)
    }
    props.setIsPlayerFullscreen(false)
}

export default function Tabbar(props: TabbarProps) {
    // BottomNavigationのHTMLが保存される
    const bottomNavRef = useRef<HTMLDivElement | null>(null);

    // BottomNavigationの高さを監視、調べる。
    useEffect(() => {
        if (typeof window !== "undefined") {
            // タブバーの高さを再計算する関数
            const updateNavHeight = () => {
                if (bottomNavRef.current) {
                    const height = bottomNavRef.current.clientHeight;
                    props.setTabbarHeight(height);
                }
            };

            // 初回の高さ計算
            updateNavHeight();

            // ウィンドウリサイズ時に高さを再計算
            window.addEventListener('resize', updateNavHeight);

            // クリーンアップ: コンポーネントがアンマウントされたときにイベントリスナーを削除
            return () => {
                window.removeEventListener('resize', updateNavHeight);
            };
        }
    }, [bottomNavRef, props.screenHeight]);

    let count = 0
    const toggleDebug = () => {
        count += 1;
        if (count === 5) {
            props.setDebugMode(true);
        }
    };

    return (
        <>
            <BottomNavigation
                ref={bottomNavRef}
                value={props.activeTab}
                onChange={(event, value) => handleTabClick(props, value)}
                showLabels
                sx={{
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    // 画面の高さに応じてTabの高さを調整
                    height: `${props.screenHeight * 0.07}px`,
                    maxWidth: "100vw",
                    display: "flex", // アイコンを均等に配置
                    justifyContent: "space-around" // 等間隔に配置する
                }}
            >

                <BottomNavigationAction
                    label={props.isMobile ? "" : "リンク集(β版)"}
                    value="linkCollection"
                    icon={<AccountBoxIcon />}
                    sx={{ minWidth: 0, padding: 0 }} // アイコンの余白を最小化
                    onClick={toggleDebug}
                />
                <BottomNavigationAction
                    label={props.isMobile ? "" : "楽曲集(β版)"}
                    value="songs"
                    icon={<MusicNoteIcon />}
                    sx={{ minWidth: 0, padding: 0 }} // アイコンの余白を最小化
                />
                <BottomNavigationAction
                    label={props.isMobile ? "" : "YouTube(スプシβ版)"}
                    value="temporaryYouTube"
                    icon={<YouTubeIcon />}
                    sx={{ minWidth: 0, padding: 0 }} // アイコンの余白を最小化
                />
                {props.debugMode &&
                    <BottomNavigationAction
                        label={props.isMobile ? "" : "YouTube(DBα版)"}
                        value="YouTube"
                        icon={<YouTubeIcon />}
                        sx={{ minWidth: 0, padding: 0 }} // アイコンの余白を最小化
                    />}
                <BottomNavigationAction
                    label={props.isMobile ? "" : "LIVE情報(β版)"}
                    value="liveInformation"
                    icon={<LocationOnIcon />}
                    sx={{ minWidth: 0, padding: 0 }} // アイコンの余白を最小化
                />
                {props.debugMode &&
                    <BottomNavigationAction
                        label={props.isMobile ? "" : "デバック情報"}
                        value="debug"
                        icon={<AdbIcon />}
                        sx={{ minWidth: 0, padding: 0 }} // アイコンの余白を最小化
                    />}
            </BottomNavigation>
        </>
    )
}