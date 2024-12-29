"use client";

import { useBrowserInfoContext } from "@/contexts/BrowserInfoContext";
import { Box, Container, Tab, Tabs } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { usePathname } from "next/navigation";
import {
    type ReactElement,
    type ReactNode,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

export type TabMap = {
    value: string;
    icon: ReactElement;
    label: string;
    scrollTo: number;
    children: ReactNode;
    // タブが切り替わった時に実行する処理
    onClick: () => void;
};

export default function TabScroll(
    tabMaps: TabMap[],
    setIsPlayerFullscreen: (value: React.SetStateAction<boolean>) => void,
) {
    const theme = useTheme();
    // ブラウザ情報を取得
    const { screenWidth, isMobile } = useBrowserInfoContext();

    // 現在選択されているタブ
    const [activeTab, setActiveTab] = useState<string>("");

    // scrollContainerRef: スクロールコンテナの要素を参照するための useRef を定義
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);

    // タブ切り替えのスクロール中かどうか
    const [isTabScrolling, setIsTabScrolling] = useState(false);

    // 指定された位置(px)にスクロールする関数
    const scrollToPosition = useCallback((number: number) => {
        const scrollContainer = scrollContainerRef.current; // 現在のスクロールコンテナを取得
        if (scrollContainer) {
            scrollContainer.scrollTo({
                left: number, // 左に指定された位置までスクロール
                behavior: "smooth", // スムーズにスクロール
            });
        }
        setIsTabScrolling(false);
    }, []); // 依存関係がないため再生成されない

    const pathname = usePathname();

    // 指定されたactiveTabに移動する。
    // const activateTab = useCallback(
    //     (tabName: string) => {
    //         const pathnames = pathname.split("/");
    //         if (pathnames[1] !== tabName) {
    //             window.history.pushState(null, "", `/${tabName}`); // URLを更新
    //         }

    //         const i = tabMaps.find((item) => item.value === tabName);
    //         if (i === undefined) return;

    //         scrollToPosition(i.scrollTo);
    //         if (tabName !== "") {
    //             setIsPlayerFullscreen(false);
    //         }
    //         i.onClick();
    //     },
    //     [pathname, tabMaps, scrollToPosition, activeTab],
    // );

    // URLの更新を監視する
    useEffect(() => {
        const pathnames = pathname.split("/");
        // 現在のタブの名前をパスを元に取得
        const tabName = pathnames[1] ?? "";
        const tab = tabMaps.find((x) => x.value === tabName);
        setActiveTab(tab?.value ?? "");
    }, [pathname, tabMaps]);

    // activeTabの変更を検知する。
    //tabMapsを依存関係に含めなると、依存関係の問題で再生する動画を変更するたびに再生成されるため
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        const pathnames = pathname.split("/");
        if (pathnames[1] !== activeTab) {
            window.history.pushState(null, "", `/${activeTab}`); // URLを更新
        }

        const i = tabMaps.find((item) => item.value === activeTab);
        if (i === undefined) return;

        scrollToPosition(i.scrollTo);
        console.log("chaaa", activeTab);
        setIsPlayerFullscreen(false);
        i.onClick();
    }, [activeTab, scrollToPosition, setIsPlayerFullscreen, pathname]);
    // 画面のサイズの変化を監視
    useEffect(() => {
        if (typeof window !== "undefined") {
            // ここからスクロールの位置を監視する。
            const scrollContainer = scrollContainerRef.current;
            let scrollTimeout: NodeJS.Timeout;

            // 適切な位置にスクロール
            const handleScroll = () => {
                // console.log("aaa");
                const scrollContainer = scrollContainerRef.current; // スクロールコンテナを取得
                if (scrollContainer) {
                    const nowPosition = scrollContainer.scrollLeft; // 現在のスクロール位置を取得

                    const closestPosition = Object.values(
                        tabMaps.map((item, index) => {
                            item.scrollTo = window.innerWidth * index;
                            return item.scrollTo; // 各タブのスクロール位置を取得
                        }),
                    ).reduce((prev, curr) =>
                        Math.abs(curr - nowPosition) <
                        Math.abs(prev - nowPosition)
                            ? curr // 現在位置に最も近い位置を選択
                            : prev,
                    );

                    scrollToPosition(closestPosition); // 最も近い位置にスクロール
                }
            };
            // 適切な位置にスクロール(操作時間を考慮)
            const handleScrollTime = (time: number) => {
                // スクロールが終了した後にhandleScrollEndを実行
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    handleScroll();
                }, time); // 指定された時間後にスクロールが終了したとみなす
            };

            // イベントの登録
            // リサイズイベントリスナーを追加
            window.addEventListener("resize", () => {
                handleScroll();
                activateTab(activeTab);
            });

            if (scrollContainer) {
                scrollContainer.addEventListener("scroll", () => {
                    setIsTabScrolling(true);
                    handleScrollTime(150);
                });
            }

            // クリーンアップ関数でリスナーを解除
            return () => {
                window.removeEventListener("resize", () => {
                    handleScroll();
                });
                if (scrollContainer) {
                    clearTimeout(scrollTimeout);

                    scrollContainer.removeEventListener("scroll", () =>
                        handleScrollTime(100),
                    );
                }
            };
        }
    }); // 依存配列は空のままでOK

    const mainContents = (): React.ReactNode => {
        return (
            <>
                <Box
                    ref={scrollContainerRef}
                    sx={{
                        // ブラウザ画面の横幅ぴったりで親要素を展開。横スクロールを可能にする。
                        width: screenWidth,
                        overflowX: "scroll",
                    }}
                >
                    <Box
                        sx={{
                            // Viewの数だけ横に並べる。横幅はViewの数×ブラウザ画面の横幅。
                            width: tabMaps.length * screenWidth,
                            display: "flex",
                        }}
                    >
                        {tabMaps.map((x) => (
                            <Box
                                key={x.value}
                                sx={{
                                    // flexShrink: 0,
                                    width: "100vw",
                                    height: "100vh",
                                    // ↓ tabViewの縦スクロールを切るのに必要。
                                    overflowY: "scroll",
                                    // scrollSnapAlign: "start",
                                    borderRight: isTabScrolling ? 1 : 0,
                                }}
                            >
                                <Container
                                    component="main"
                                    sx={{
                                        // overflowY: isPlayerFullscreen
                                        //     ? "hidden"
                                        //     : "auto",
                                        paddingBottom: "40vh",
                                    }}
                                >
                                    {x.children}
                                </Container>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </>
        );
    };

    const tabs = (): React.ReactNode => {
        return (
            <>
                {tabMaps.length >= 2 && (
                    <Container disableGutters sx={{ minWidth: "100vw" }}>
                        <Tabs
                            value={tabMaps.findIndex(
                                (item) => item.value === activeTab,
                            )}
                            variant="fullWidth"
                            sx={{
                                "& .MuiTabs-flexContainer": {
                                    justifyContent: "space-around",
                                    backgroundColor:
                                        theme.palette.background.paper,
                                },
                                backgroundColor: theme.palette.background.paper,
                            }}
                        >
                            {tabMaps.map((x) => (
                                <Tab
                                    key={x.value}
                                    icon={x.icon}
                                    onClick={() => {
                                        console.log(x.value, activeTab);
                                        setActiveTab(x.value);
                                        console.log("chabbbb");
                                        setIsPlayerFullscreen(false);
                                    }}
                                    sx={{
                                        minWidth: 0,
                                        padding: 0,
                                        textTransform: "none",
                                    }}
                                    label={isMobile ? undefined : x.label}
                                    iconPosition="top"
                                />
                            ))}
                        </Tabs>
                    </Container>
                )}
            </>
        );
    };

    return {
        mainContents,
        tabs,
    };
}
