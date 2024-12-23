"use client";

import { TemporaryYouTubeTab } from "@/components/MainTabs/TemporaryYouTubeTab";
import Navbar from "@/components/Navbar/Navbar";
import type {
    InputValue,
    additionalSearchSuggestions,
} from "@/components/Navbar/SuperSearchBar";
import type { ultraSuperSearchBarSearchSuggestion } from "@/components/Navbar/UltraSuperSearchBar";
import PlayerView from "@/components/PlayerView";
import type { PlayerItem } from "@/components/PlayerView"; // 型としてのインポート
import { useDataContext } from "@/contexts/ApiDataContext";
import type { apiData } from "@/contexts/ApiDataContext";
import GradeIcon from "@mui/icons-material/Grade";
import GroupsIcon from "@mui/icons-material/Groups";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import PersonIcon from "@mui/icons-material/Person";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { AppBar, Box, Container, Tab, Tabs } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
    Fragment,
    type ReactElement,
    type ReactNode,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // テーマ設定を取得
    const theme = useTheme();
    // apiDataを取得
    const apiData = useDataContext();
    // ディスプレイの横幅(px)
    const [screenWidth, setScreenWidth] = useState<number>(0);
    // ディスプレイの縦幅(px)
    const [screenHeight, setScreenHeight] = useState<number>(0);
    // スマホかどうかを判定する
    const [isMobile, setIsMobile] = useState<boolean>(true);

    // ローディング画面
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // ⭐️ここからウルトラスーパーサーチバー関連
    // 入力された値
    const [inputValue, setInputValue] = useState<InputValue[]>([]);
    // 検索候補
    const [searchSuggestion, setSearchSuggestion] = useState<
        ultraSuperSearchBarSearchSuggestion[]
    >([]);
    // そのViewで使用される値のCategoryID配列
    const [availableCategoryIds, setAvailableCategoryIds] =
        useState<string[]>();
    // 外せない入力値を定義
    const [fixedOptionValues, setFixedOptionValues] = useState<string[]>();
    // limitスーパーサーチで表示するカテゴリーの定義
    const [limitSuperSearchCategory, setLimitSuperSearchCategory] =
        useState<additionalSearchSuggestions[]>();
    // ⭐️ここまでウルトラスーパーサーチバー関連

    // Navbarの高さを定義
    const [navbarHeight, setNavbarHeight] = useState<number>(0);

    // PlayerViewを拡大表示するかどうか
    const [isPlayerFullscreen, setIsPlayerFullscreen] =
        useState<boolean>(false);
    // PlayerView
    const [playerItem, setPlayerItem] = useState<PlayerItem | undefined>(
        undefined,
    );
    const [playerPlaylist, setPlayerPlaylist] = useState<PlayerItem[]>([]);
    const [playerSearchResult, setPlayerSearchResult] = useState<PlayerItem[]>(
        [],
    );

    // scrollContainerRef: スクロールコンテナの要素を参照するための useRef を定義
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);

    // 現在選択されているタブ
    const [activeTab, setActiveTab] = useState<string>("temporaryYouTube");

    // タブ切り替えのスクロール中かどうか
    const [isTabScrolling, setIsTabScrolling] = useState(false);

    type TabMap = {
        value: string;
        icon: ReactElement;
        label: string;
        scrollTo: number;
        children: ReactNode;
        // タブが切り替わった時に実行する処理
        onClick: () => void;
    };
    // useMemoでタブ設定を作成
    const tabMaps: TabMap[] = useMemo(
        () =>
            [
                // {
                //     value: "linkCollection",
                //     icon: <AccountBoxIcon />,
                //     label: "リンク集",
                //     children: <LinkTab inputValue={inputValue} />,
                //     scrollTo: 0,
                //     onClick: () => {
                //         setAvailableCategoryIds(["actor"]);
                //         setLimitSuperSearchCategory([]);
                //         setFixedOptionValues([]);
                //     },
                // },
                // {
                //     value: "songs",
                //     icon: <MusicNoteIcon />,
                //     label: "楽曲集",
                //     children: <SongTab key="song" />,
                //     scrollTo: 0,
                //     onClick: () => {
                //         setAvailableCategoryIds([]);
                //         setLimitSuperSearchCategory([]);
                //         setFixedOptionValues([]);
                //     },
                // },
                {
                    value: "temporaryYouTube",
                    icon: <YouTubeIcon />,
                    label: "ぷらそにか",
                    scrollTo: 0,
                    children: (
                        <TemporaryYouTubeTab
                            key="tempYoutube"
                            isMobile={isMobile}
                            inputValue={inputValue}
                            playerItem={playerItem}
                            setPlayerItem={setPlayerItem}
                            setPlayerPlaylist={setPlayerPlaylist}
                            setPlayerSearchResult={setPlayerSearchResult}
                        />
                    ),
                    onClick: () => {
                        setAvailableCategoryIds([
                            "",
                            "actor",
                            "organization",
                            // "YouTubeChannel",
                            "title",
                            "description",
                            "specialWord_PlatMusic",
                            "musicArtistName",
                            "musicTitle",
                        ]);
                        setLimitSuperSearchCategory([
                            // { categoryId: "actor", categoryLabel: "出演者" },
                            // {
                            //     categoryId: "organization",
                            //     categoryLabel: "組織",
                            // },
                        ]);
                        setFixedOptionValues(["UCZx7esGXyW6JXn98byfKEIA"]);

                        // const i = inputValue.find(
                        //     (item) => item.value === "UCZx7esGXyW6JXn98byfKEIA",
                        // );
                        // if (!i) {
                        //     setInputValue([
                        //         {
                        //             sort: 101,
                        //             createdAt: new Date(),
                        //             label: "ぷらそにか",
                        //             value: "UCZx7esGXyW6JXn98byfKEIA",
                        //             imgSrc: "https://yt3.ggpht.com/ytc/AIdro_lB6NxMtujj7oK0See-TGPL5eq-TjowmK6DFSjgLyCj0g=s88-c-k-c0x00ffffff-no-rj",
                        //             categoryId: "YouTubeChannel",
                        //             categoryLabel: "YouTube",
                        //         },
                        //         ...inputValue.filter(
                        //             (item) =>
                        //                 item.categoryId !== "YouTubeChannel",
                        //         ),
                        //     ]);
                        // }
                    },
                },
                // {
                //     value: "liveInformation",
                //     icon: <LocationOnIcon />,
                //     label: "LIVE情報(β版)",
                //     scrollTo: 0,
                //     children: <LiveInformationTab key="liveInformation" />,
                //     onClick: () => {
                //         setAvailableCategoryIds([]);
                //         setLimitSuperSearchCategory([]);
                //         setFixedOptionValues([]);
                //     },
                // },
            ].map((item, index) => {
                if (typeof window !== "undefined") {
                    item.scrollTo = window.innerWidth * index;
                }
                return item;
            }),
        [inputValue, playerItem, isMobile],
    );

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

    // 指定されたactiveTagに移動する。
    const activateTag = useCallback(
        (tagName: string) => {
            const pathnames = pathname.split("/");
            if (pathnames[1] !== tagName) {
                window.history.pushState(null, "", `/${tagName}`); // URLを更新
            }
            const i = tabMaps.find((item) => item.value === tagName);
            if (i) {
                scrollToPosition(i.scrollTo);
                i.onClick();
            }
        },
        [pathname, tabMaps, scrollToPosition],
    );

    const router = useRouter();

    // URLの更新を監視する
    useEffect(() => {
        const pathnames = pathname.split("/");
        // 現在のタブの名前をパスを元に取得
        const tabName = pathnames[1] ?? "";
        const tab = tabMaps.find((x) => x.value === tabName);

        if (tab) {
            setActiveTab(tab.value);
            return;
        }

        // if (!tab && !(1 <= tabName.length)) {
        //     notFound();
        // }
        setActiveTab("temporaryYouTube");
    }, [pathname, tabMaps]);

    // activeTabの変更を検知する。
    useEffect(() => {
        activateTag(activeTab);
    }, [activeTab, activateTag]);

    // 画面のサイズの変化を監視
    useEffect(() => {
        if (typeof window !== "undefined") {
            const handleResize = () => {
                // console.log("bbb");
                // 画面の横幅と縦幅を取得
                setScreenWidth(window.innerWidth);
                setScreenHeight(window.innerHeight);

                // スクリーン幅が768px以下の場合はスマホと判定
                setIsMobile(window.innerWidth <= 768);
            };

            // 初回の幅と高さを設定
            handleResize();

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
                    setActiveTab(() => {
                        const tab = tabMaps.find(
                            (v) => v.scrollTo === closestPosition,
                        );
                        return tab ? tab.value : ""; // tabが見つかった場合はtabIdを返し、見つからなければ空文字を返す
                    });
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
                handleResize();
                handleScroll();
                // activateTag(activeTab);
            });

            if (scrollContainer) {
                scrollContainer.addEventListener("scroll", () => {
                    setIsTabScrolling(true);
                    handleScrollTime(150);
                });
            }

            setIsLoading(false);

            // クリーンアップ関数でリスナーを解除
            return () => {
                window.removeEventListener("resize", () => {
                    handleResize();
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

    // 初回実行(APIを叩く)検索候補を定義
    // コンポーネントの初回レンダリング時にAPIを叩く
    useEffect(() => {
        const YouTubeAccounts: apiData[] | undefined = apiData.find(
            (item) => item.id === "YouTubeAccount",
        )?.data;

        const Entity: apiData[] | undefined = apiData.find(
            (item) => item.id === "Entity",
        )?.data;

        const Music: apiData[] | undefined = apiData.find(
            (item) => item.id === "Music",
        )?.data;

        const result: ultraSuperSearchBarSearchSuggestion[] = [];

        // スペシャル検索候補を追加
        result.push({
            label: "ぷらっとみゅーじっく♪",
            value: "ぷらっとみゅーじっく♪",
            categoryId: "specialWord_PlatMusic",
            categoryLabel: "特別な検索",
            categorySort: 999,
            icon: <GradeIcon  sx={{ color: "rgb(227, 220, 18)" }}  />,
        });

        if (Entity && YouTubeAccounts) {
            // データを変換し、検索候補の配列に追加
            for (const item of Entity) {
                const resultItem: ultraSuperSearchBarSearchSuggestion = {
                    sort: item.category === "person" ? 99 : 100,
                    label: item.name,
                    value: item.id,
                    icon:
                        item.category === "person" ? (
                            <PersonIcon />
                        ) : (
                            <GroupsIcon />
                        ),
                    imgSrc: (() => {
                        try {
                            const YouTubeAccount: apiData | undefined =
                                YouTubeAccounts.find((vvv) => {
                                    // vvv.entityIdが存在し、item.idが含まれているかを確認する
                                    if (vvv.entityId !== null) {
                                        return vvv.entityId
                                            .split(/ , |,| ,|, /)
                                            .includes(item.id);
                                    }
                                });
                            const data = YouTubeAccount
                                ? JSON.parse(YouTubeAccount.apiData)
                                : undefined;
                            return data.snippet.thumbnails.default.url;
                        } catch (error) {
                            return undefined;
                        }
                    })(),

                    categoryId:
                        item.category === "person" ? "actor" : "organization",
                    categoryLabel:
                        item.category === "person" ? "出演者" : "出演組織",
                    categorySort: item.category === "person" ? 100 : 101,
                };
                result.push(resultItem);
            }
        }

        // アーティストを追加
        const artists: string[] =
            Music?.map((item) => (item.musicArtist ? item.musicArtist : "")) ||
            [];
        // 重複を削除
        const uniqueArtists: string[] = artists.filter(
            (artist, index) => artists.indexOf(artist) === index,
        );
        for (const artistName of uniqueArtists) {
            if (artistName) {
                result.push({
                    label: String(artistName),
                    value: String(artistName),
                    categoryId: "musicArtistName",
                    categoryLabel: "楽曲アーティスト",
                    categorySort: 20,
                    icon: <MusicNoteIcon />,
                    queryMinLengthForSuggestions: 1,
                });
            }
        }

        // 楽曲名を追加
        const musicTitles: string[] =
            Music?.map((item) => (item.musicTitle ? item.musicTitle : "")) ||
            [];
        // 重複を削除
        const uniqueMusicTitle: string[] = musicTitles.filter(
            (musicTitle, index) => musicTitles.indexOf(musicTitle) === index,
        );
        for (const musicTitle of uniqueMusicTitle) {
            if (musicTitle) {
                result.push({
                    label: String(musicTitle),
                    value: String(musicTitle),
                    categoryId: "musicTitle",
                    categoryLabel: "楽曲タイトル",
                    categorySort: 19,
                    // icon: <MusicNoteIcon />,
                    queryMinLengthForSuggestions: 1,
                });
            }
        }

        // 検索候補を更新
        setSearchSuggestion(result);

        // }, [inputValue, apiData]);
    }, [apiData]);

    if (isLoading) {
        // if (true) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <div style={{ textAlign: "center" }}>
                    {/* 画像のプレースホルダー */}
                    <div style={{ marginBottom: "16px" }}>
                        <Image
                            src="/icon_border_radius.png"
                            alt="Loading"
                            width={40}
                            height={40}
                            style={{ objectFit: "contain" }}
                        />
                    </div>

                    {/* 読み込み中メッセージ */}
                    <p
                        style={{
                            fontSize: "18px",
                            color: "#555",
                            animation: "fade 1s infinite",
                        }}
                    >
                        読 み 込 み 中...
                    </p>

                    {/* CSSアニメーション */}
                    <style jsx>{`
                  @keyframes fade {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                  }
                `}</style>
                </div>
            </div>
        );
    }

    return (
        <Fragment>
            <Navbar
                inputValue={inputValue}
                searchSuggestion={searchSuggestion}
                fixedOptionValues={fixedOptionValues}
                limitSuperSearchCategory={limitSuperSearchCategory}
                availableCategoryIds={availableCategoryIds}
                setInputValue={setInputValue}
                screenHeight={screenHeight}
                setNavbarHeight={setNavbarHeight}
                isMobile={isMobile}
                superSearchOnChange={() => {
                    setIsPlayerFullscreen(false);
                }}
            />
            {/* メインコンテンツ */}
            <Box
                ref={scrollContainerRef}
                sx={{
                    width: screenWidth,
                    overflowX: "scroll",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        width: tabMaps.length * screenWidth,
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
                                    overflowY: isPlayerFullscreen
                                        ? "hidden"
                                        : "auto",
                                    paddingBottom: "40vh",
                                }}
                            >
                                {x.children}
                            </Container>
                        </Box>
                    ))}
                </Box>
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
                style={{
                    // ↓ ブラウザの動作に応じて位置を調節するために必要(?)
                    top: "auto",
                    bottom: 0,
                }}
            >
                {/* Player */}
                {playerItem && (
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
                        style={{
                            // ↓ header(Navbar)の分上に余白を作る。
                            top: isPlayerFullscreen
                                ? isMobile
                                    ? "0"
                                    : `${navbarHeight}px`
                                : "auto",
                        }}
                    />
                )}
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
                                        setActiveTab(x.value);
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
            </AppBar>
        </Fragment>
    );
}
