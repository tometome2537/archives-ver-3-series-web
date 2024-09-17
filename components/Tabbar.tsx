import { Dispatch, SetStateAction, MutableRefObject, useRef, useEffect, useState } from "react";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MusicNoteIcon from '@mui/icons-material/MusicNote';

type TabbarProps = {
    activeTab: string;
    setActiveTab: Dispatch<SetStateAction<string>>;
    activeTabList: MutableRefObject<string[]>; // コロンではなく型を指定
    setTabbarHeight: Dispatch<SetStateAction<number>>;
};

// タブがクリックされた時の処理
const handleTabClick = (props: TabbarProps, value: string) => {
    // アクティブタブに追加
    props.setActiveTab(value)
    // アクティブになったタブがリストにない場合は追加
    if (!props.activeTabList.current.includes(value)) {
        props.activeTabList.current.push(value)
    }
}

export default function Tabbar(props: TabbarProps) {
    // BottomNavigationのHTMLが保存される
    const bottomNavRef = useRef<HTMLDivElement | null>(null);
    // BottomNavigationの高さの数値が入る。
    const [navHeight, setNavHeight] = useState<number>(0);

    // BottomNavigationの高さを調べる
    useEffect(() => {
        if (bottomNavRef.current) {
            const height = bottomNavRef.current.clientHeight;
            setNavHeight(height)
            props.setTabbarHeight(height)
        }
    }, []);
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
                    right: 0
                }}
            >
                {/* <BottomNavigationAction
                    label={JSON.stringify(navHeight)}
                    value="linkCollection"
                    icon={<AccountBoxIcon />}
                /> */}

                <BottomNavigationAction
                    // label="リンク集(β版)"
                    value="linkCollection"
                    icon={<AccountBoxIcon />}
                />
                <BottomNavigationAction
                    // label="楽曲集(β版)"
                    value="songs"
                    icon={<MusicNoteIcon />}
                />
                <BottomNavigationAction
                    // label="YouTube(スプシβ版)"
                    value="temporaryYouTube"
                    icon={<YouTubeIcon />}
                />
                <BottomNavigationAction
                    // label="YouTube(DBα版)"
                    value="YouTube"
                    icon={<YouTubeIcon />}
                />
                <BottomNavigationAction
                    // label="LIVE情報(β版)"
                    value="liveInformation"
                    icon={<LocationOnIcon />}
                />
            </BottomNavigation>
        </>
    )
}