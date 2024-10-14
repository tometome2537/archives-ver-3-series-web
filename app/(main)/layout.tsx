"use client";

import type { EntityObj } from "@/components/EntitySelector"; // 型としてのインポート
import Link from "@/components/Link";
import { DebugTab } from "@/components/MainTabs/DebugTab";
import { LinkTab } from "@/components/MainTabs/LinkTab";
import { LiveInformationTab } from "@/components/MainTabs/LiveInformationTab";
import { SongTab } from "@/components/MainTabs/SongTab";
import { TemporaryYouTubeTab } from "@/components/MainTabs/TemporaryYouTubeTab";
import { YouTubeTab } from "@/components/MainTabs/YouTubeTab";
import Navbar from "@/components/Navbar/Navbar";
import type { InputValueSearchSuggestion } from "@/components/Navbar/SuperSearchBar";
import type { ultraSuperSearchBarSearchSuggestion } from "@/components/Navbar/UltraSuperSearchBar";
import PlayerView from "@/components/PlayerView";
import type { PlayerItem } from "@/components/PlayerView"; // 型としてのインポート
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import AdbIcon from "@mui/icons-material/Adb";
import GroupsIcon from "@mui/icons-material/Groups";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { AppBar, Box, Container, Tab, Tabs } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import { notFound, usePathname, useRouter } from "next/navigation";
import {
    Fragment,
    type ReactElement,
    type ReactNode,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

interface TabMap {
    value: string;
    icon: ReactElement;
    label: string;
    isDebugModeOnly: boolean;
    children: ReactNode;
}

interface TabWithLinkProps {
    href: string;
    icon?: ReactElement;
    label: string;
    isCompact: boolean;
    onClick?: () => void;
    sx?: SxProps<Theme>;
}

function TabWithLink({
    href,
    icon,
    label,
    isCompact,
    onClick,
    sx,
}: TabWithLinkProps) {
    return (
        <Link href={href} onClick={onClick} sx={sx}>
            {isCompact ? (
                <Tab icon={icon} />
            ) : (
                <Tab icon={icon} label={label} iconPosition="top" />
            )}
        </Link>
    );
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // テーマ設定を取得
    const theme = useTheme();
    // デバッグ(ローカル開発環境)モード(リンク集を10回タップするとデバッグモードへ)
    const [debugMode, setDebugMode] = useState(
        process.env.NEXT_PUBLIC_STAGE === "local",
    );
    // ディスプレイの横幅(px)
    const [screenWidth, setScreenWidth] = useState<number>(0);
    // ディスプレイの縦幅(px)
    const [screenHeight, setScreenHeight] = useState<number>(0);
    // スマホかどうかを判定する
    const [isMobile, setIsMobile] = useState<boolean>(true);

    // ウルトラスーパーサーチバー
    const [inputValue, setInputValue] = useState<InputValueSearchSuggestion[]>([
        {
            sort: 101,
            label: "ぷらそにか",
            value: "UCZx7esGXyW6JXn98byfKEIA",
            imgSrc: "https://yt3.ggpht.com/ytc/AIdro_lB6NxMtujj7oK0See-TGPL5eq-TjowmK6DFSjgLyCj0g=s88-c-k-c0x00ffffff-no-rj",
            categoryId: "YouTubeChannel",
            categoryLabel: "YouTubeチャンネル",
        },
    ]);
    const [searchSuggestion, setSearchSuggestion] = useState<
        ultraSuperSearchBarSearchSuggestion[]
    >([]);

    // Navbarの高さを定義
    const [navbarHeight, setNavbarHeight] = useState<number>(0);

    // PlayerViewを拡大表示するかどうか
    const [isPlayerFullscreen, setIsPlayerFullscreen] =
        useState<boolean>(false);
    // PlayerView
    const [playerItem, setPlayerItem] = useState<PlayerItem>({});
    const [playerPlaylist, setPlayerPlaylist] = useState<PlayerItem[]>([]);
    const [playerSearchResult, setPlayerSearchResult] = useState<PlayerItem[]>(
        [],
    );

    // 選択されているEntity Id ※ EntitySelectorで使用。
    const [entityIds, setEntityIds] = useState<EntityObj[]>([]);
    const [entityIdString, setEntityIdString] = useState<string[]>([]);

    const [playerSize, setPlayerSize] = useState(1);
    const [isLargePlayer, setIsLargePlayer] = useState(false);
    const [currentSearchQuery, setCurrentSearchQuery] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const [currentTabValue, setCurrentTabValue] = useState(0);
    let prevChangingTabIndex = 0;
    let changingTabIndex = 0;

    const tabMaps: TabMap[] = [
        {
            value: "linkCollection",
            icon: <AccountBoxIcon />,
            label: "リンク集",
            isDebugModeOnly: false,
            children: <LinkTab />,
        },

        {
            value: "songs",
            icon: <MusicNoteIcon />,
            label: "楽曲集(β版)",
            isDebugModeOnly: false,
            children: <SongTab key="song" />,
        },
        {
            value: "temporaryYouTube",
            icon: <YouTubeIcon />,
            label: "YouTube(スプシβ版)",
            isDebugModeOnly: false,
            children: (
                <TemporaryYouTubeTab
                    key="tempYoutube"
                    inputValue={inputValue}
                    playerItem={playerItem}
                    setPlayerItem={setPlayerItem}
                    entityIds={entityIds}
                    setPlayerPlaylist={setPlayerPlaylist}
                    setPlayerSearchResult={setPlayerSearchResult}
                />
            ),
        },
        {
            value: "youTube",
            icon: <YouTubeIcon />,
            label: "YouTube(DBα版)",
            isDebugModeOnly: true,
            children: (
                <YouTubeTab
                    key="youtube"
                    setPlayerSize={setPlayerSize}
                    setIsLargePlayer={setIsLargePlayer}
                    playerItem={playerItem}
                    setPlayerItem={setPlayerItem}
                    setPlayerSearchResult={setPlayerSearchResult}
                    playerSize={playerSize}
                    isLargePlayer={isLargePlayer}
                    searchQuery={searchQuery}
                />
            ),
        },
        {
            value: "liveInformation",
            icon: <LocationOnIcon />,
            label: "LIVE情報(β版)",
            isDebugModeOnly: false,
            children: <LiveInformationTab key="liveInformation" />,
        },
        {
            value: "debug",
            icon: <AdbIcon />,
            label: "デバック情報",
            isDebugModeOnly: true,
            children: <DebugTab key="debug" />,
        },
    ];

    const scroll = useCallback(() => {
        scrollContainerRef.current?.scrollTo({
            left: currentTabValue * screenWidth,
            top: 0,
            behavior: "smooth",
        });
    }, [currentTabValue, screenWidth]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        scroll();
    }, [currentTabValue]);

    const router = useRouter();

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;

        if (scrollContainer) {
            const handleScroll = (event: Event) => {
                const threshold = 0.1;
                const tabRatio = scrollContainer?.scrollLeft / screenWidth;
                const tabRatioFloat =
                    (scrollContainer?.scrollLeft / screenWidth) % 1;

                if (
                    tabRatioFloat < threshold ||
                    tabRatioFloat > 1 - threshold
                ) {
                    prevChangingTabIndex = Math.round(tabRatio);
                }

                if (prevChangingTabIndex !== changingTabIndex) {
                    changingTabIndex = prevChangingTabIndex;
                    setCurrentTabValue(changingTabIndex);
                    router.push(`/${tabMaps[changingTabIndex].value}`);
                }
            };

            scrollContainer.addEventListener("scroll", handleScroll);

            return () => {
                scrollContainer.removeEventListener("scroll", handleScroll);
            };
        }
    }, [screenWidth, changingTabIndex, prevChangingTabIndex, router]);

    // 画面のサイズの変化を監視
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
    }, []); // 依存配列は空のままでOK

    // 初回実行(APIを叩く)検索候補を定義
    useEffect(() => {
        // APIからイベントデータを取得
        const fetchEvents = async () => {
            try {
                // Entityを取得
                const url = "https://api.sssapi.app/ZJUpXwYIh9lpfn3DQuyzS";
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                const result: ultraSuperSearchBarSearchSuggestion[] = [];
                for (const item of data) {
                    const resultItem: ultraSuperSearchBarSearchSuggestion = {
                        sort: item.category === "person" ? 99 : 100,
                        label: item.name,
                        value: item.id,
                        icon:
                            item.category === "person" ? // <PersonIcon />
                            undefined : (
                                <GroupsIcon />
                            ),
                        categoryId:
                            item.category === "person"
                                ? "actor"
                                : "organization",
                        categoryLabel:
                            item.category === "person" ? "出演者" : "組織",
                        // categoryLabelSecond: "",
                    };
                    result.push(resultItem);
                }
                // const finalResult = searchSuggestion.concat(result);
                setSearchSuggestion(result);
            } catch (err) {
            } finally {
            }
        };

        fetchEvents();
    }, []);

    let count = 0;
    const enableDebugModeOnClick = () => {
        count += 1;
        if (count >= 5 && debugMode === false) {
            setDebugMode(true);
        }
    };

    // URLの更新を監視する
    const pathname = usePathname();
    useEffect(() => {
        const pathnames = pathname.split("/");
        // 現在のタブの名前をパスを元に取得
        const tabName = pathnames[1] ?? "";
        const tabIndex = tabMaps
            .filter(
                (x) =>
                    x.isDebugModeOnly === false ||
                    (debugMode && x.isDebugModeOnly),
            )
            .findIndex((x) => x.value === tabName);

        if (tabIndex >= 0 || tabName === "") {
            setCurrentTabValue(Math.max(tabIndex, 0));
            return;
        }

        notFound();
    }, [pathname, debugMode]);

    return (
        <Fragment>
            <Navbar
                inputValue={inputValue}
                searchSuggestion={searchSuggestion}
                setInputValue={setInputValue}
                screenHeight={screenHeight}
                setEntityId={setEntityIds}
                entityIdString={entityIdString}
                setSearchQuery={setCurrentSearchQuery}
                search={() => setSearchQuery(currentSearchQuery)}
                setNavbarHeight={setNavbarHeight}
            />
            {/* メインコンテンツ */}
            <Box
                ref={scrollContainerRef}
                sx={{
                    display: "flex",
                    alignItems: "start",
                    overflowX: "scroll",
                    scrollSnapType: "x mandatory",
                }}
            >
                {/* TODO: 一番でかい要素にスクロールが影響される */}
                {tabMaps.map((x) => (
                    <Box
                        key={x.value}
                        sx={{
                            flexShrink: 0,
                            width: "100vw",
                            height: "100vh",
                            scrollSnapAlign: "start",
                        }}
                    >
                        <Container
                            component="main"
                            sx={{
                                overflowY: isPlayerFullscreen
                                    ? "hidden"
                                    : "auto",
                            }}
                        >
                            {x.children}
                        </Container>
                    </Box>
                ))}
            </Box>

            {/* 画面下に固定されたタブバー */}
            <AppBar
                position="fixed"
                color="default"
                component="footer"
                sx={{
                    bottom: 0,
                    top: "auto",
                    background: "transparent",
                    boxShadow: "none",
                }}
            >
                {/* Player */}
                <PlayerView
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    searchSuggestion={searchSuggestion}
                    screenWidth={screenWidth}
                    screenHeight={screenHeight}
                    isMobile={isMobile}
                    PlayerItem={playerItem}
                    setPlayerItem={setPlayerItem}
                    Playlist={playerPlaylist}
                    searchResult={playerSearchResult}
                    isPlayerFullscreen={isPlayerFullscreen}
                    setIsPlayerFullscreen={setIsPlayerFullscreen}
                    setEntityIdString={setEntityIdString}
                    style={{
                        // ↓ header(Navbar)の分上に余白を作る。
                        top: isPlayerFullscreen ? `${navbarHeight}px` : "auto",
                    }}
                />
                <Container disableGutters sx={{ minWidth: "100vw" }}>
                    <Tabs
                        value={currentTabValue}
                        variant="fullWidth"
                        sx={{
                            "& .MuiTabs-flexContainer": {
                                justifyContent: "space-around",
                            },
                            backgroundColor: theme.palette.background.paper,
                        }}
                    >
                        {tabMaps.map((x, index) => {
                            return (
                                (x.isDebugModeOnly === false ||
                                    (x.isDebugModeOnly && debugMode)) && (
                                    <TabWithLink
                                        key={x.value}
                                        href={`/${x.value}`}
                                        icon={x.icon}
                                        label={x.label}
                                        isCompact={isMobile}
                                        sx={{
                                            minWidth: 0,
                                            padding: 0,
                                        }}
                                        onClick={() => {
                                            setCurrentTabValue(index);
                                            setIsPlayerFullscreen(false);
                                        }}
                                    />
                                )
                            );
                        })}
                    </Tabs>
                </Container>
            </AppBar>
        </Fragment>
    );
}
