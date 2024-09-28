import { useEffect, useRef, useState } from "react";

import { Grid } from "@mui/material";
import { Box, Button, Typography } from "@mui/material";
import Navbar from "./Navbar/Navbar";

import type { EntityObj } from "./EntitySelector"; // 型としてのインポート
import Sidebar from "./Navbar/Sidebar";
import Tabbar from "./Tabbar";
import VideoTemporaryView from "./VideoTemporaryView";
import VideoView from "./VideoView";

import PlayerView from "./PlayerView";
import type { PlayerItem } from "./PlayerView"; // 型としてのインポート

import { useColorModeContext } from "@/contexts/ThemeContext";
import { useTheme } from "@mui/material/styles";
import SuperSearchBar from "./Navbar/SuperSearchBar";

export default function Main() {
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

    // テーマ設定を取得
    const theme = useTheme();

    // Navbarの高さを定義
    const [navbarHeight, setNavbarHeight] = useState<number>(0);
    // Tabbarの高さを定義
    const [tabbarHeight, setTabbarHeight] = useState<number>(0);
    // PlayerViewの高さを定義
    const [playerViewHeight, setPlayerViewHeight] = useState<number>(0);

    // デフォルトで開くタブ
    const defaultTab = debugMode ? "debug" : "temporaryYouTube";
    // 現在アクティブなTab
    const [activeTab, setActiveTab] = useState<string>(defaultTab);
    // アクティブになったタブのリスト ※ 一度アクティブなったタブは破棄しない。
    const activeTabList = useRef<Array<string>>([defaultTab]);

    // PlayerViewを拡大表示するかどうか
    const [isPlayerFullscreen, setIsPlayerFullscreen] =
        useState<boolean>(false);
    // PlayerView
    const [playerItem, setPlayerItem] = useState<PlayerItem>({});
    const [playerPlaylist, setPlayerPlaylist] = useState<Array<PlayerItem>>([]);
    const [playerSearchResult, setPlayerSearchResult] = useState<
        Array<PlayerItem>
    >([]);

    // 選択されているEntity Id ※ EntitySelectorで使用。
    const [entityId, setEntityId] = useState<Array<EntityObj>>([]);
    const [entityIdString, setEntityIdString] = useState<Array<string>>([]);

    const [playerSize, setPlayerSize] = useState(1);
    const [isLargePlayer, setIsLargePlayer] = useState(false);
    const [currentSearchQuery, setCurrentSearchQuery] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const { toggleColorMode } = useColorModeContext();

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

    return (
        <>
            <Navbar
                screenHeight={screenHeight}
                setEntityId={setEntityId}
                entityIdString={entityIdString}
                setSearchQuery={setCurrentSearchQuery}
                search={() => setSearchQuery(currentSearchQuery)}
                setNavbarHeight={setNavbarHeight}
            />

            {/* メインコンテンツ */}
            <div>
                {activeTabList.current.includes("linkCollection") && (
                    <div
                        style={{
                            display:
                                activeTab === "linkCollection"
                                    ? "block"
                                    : "none", // アクティブかどうかで表示/非表示を切り替え
                        }}
                    >
                        <div
                            style={{
                                // ↓ header(Navbar)に被らないように
                                paddingTop: navbarHeight,
                                // ↓ Tabbarに被らないように底上げ
                                paddingBottom: tabbarHeight + playerViewHeight,
                                // 拡大モードの時、縦スクロールを許可しない
                                overflowY: isPlayerFullscreen
                                    ? "hidden"
                                    : "auto",
                            }}
                        >
                            <div>それぞれのリンク集</div>
                        </div>
                    </div>
                )}

                {activeTabList.current.includes("songs") && (
                    <div
                        style={{
                            display: activeTab === "songs" ? "block" : "none", // アクティブかどうかで表示/非表示を切り替え
                        }}
                    >
                        <div
                            style={{
                                // ↓ header(Navbar)に被らないように
                                paddingTop: navbarHeight,
                                // ↓ Tabbarに被らないように底上げ
                                paddingBottom: tabbarHeight + playerViewHeight,
                                // 拡大モードの時、縦スクロールを許可しない
                                overflowY: isPlayerFullscreen
                                    ? "hidden"
                                    : "auto",
                            }}
                        >
                            <div>楽曲集</div>
                        </div>
                    </div>
                )}

                {activeTabList.current.includes("temporaryYouTube") ? (
                    <div
                        style={{
                            display:
                                activeTab === "temporaryYouTube"
                                    ? "block"
                                    : "none", // アクティブかどうかで表示/非表示を切り替え
                        }}
                    >
                        <div
                            style={{
                                // ↓ header(Navbar)に被らないように
                                paddingTop: navbarHeight,
                                // ↓ Tabbarに被らないように底上げ
                                paddingBottom: tabbarHeight + playerViewHeight,
                                // 拡大モードの時、縦スクロールを許可しない
                                overflowY: isPlayerFullscreen
                                    ? "hidden"
                                    : "auto",
                            }}
                        >
                            <VideoTemporaryView
                                playerItem={playerItem}
                                entityId={entityId}
                                setPlayerItem={setPlayerItem}
                                setPlayerPlaylist={setPlayerPlaylist}
                                setPlayerSearchResult={setPlayerSearchResult}
                            />
                        </div>
                    </div>
                ) : null}

                {activeTabList.current.includes("YouTube") && (
                    <div
                        style={{
                            display: activeTab === "YouTube" ? "block" : "none", // アクティブかどうかで表示/非表示を切り替え
                        }}
                    >
                        <div
                            style={{
                                // ↓ header(Navbar)に被らないように
                                paddingTop: navbarHeight,
                                // ↓ Tabbarに被らないように底上げ
                                paddingBottom: tabbarHeight + playerViewHeight,
                                // 拡大モードの時、縦スクロールを許可しない
                                overflowY: isPlayerFullscreen
                                    ? "hidden"
                                    : "auto",
                            }}
                        >
                            <Sidebar
                                setPlayerSize={setPlayerSize}
                                setIsLargePlayer={setIsLargePlayer}
                            />
                            <VideoView
                                playerItem={playerItem}
                                setPlayerItem={setPlayerItem}
                                setPlayerSearchResult={setPlayerSearchResult}
                                playerSize={playerSize}
                                isLargePlayer={isLargePlayer}
                                searchQuery={searchQuery}
                            />
                        </div>
                    </div>
                )}

                {activeTabList.current.includes("liveInformation") && (
                    <div
                        style={{
                            display:
                                activeTab === "liveInformation"
                                    ? "block"
                                    : "none", // アクティブかどうかで表示/非表示を切り替え
                        }}
                    >
                        <div
                            style={{
                                // ↓ header(Navbar)に被らないように
                                paddingTop: navbarHeight,
                                // ↓ Tabbarに被らないように底上げ
                                paddingBottom: tabbarHeight + playerViewHeight,
                                // 拡大モードの時、縦スクロールを許可しない
                                overflowY: isPlayerFullscreen
                                    ? "hidden"
                                    : "auto",
                            }}
                        >
                            <div>LIVE情報</div>
                            {/* ↓ Tabbarに被らないように底上げ */}
                        </div>
                    </div>
                )}

                {activeTab === "debug" && (
                    <div>
                        <div
                            style={{
                                // ↓ header(Navbar)に被らないように
                                paddingTop: navbarHeight,
                                // ↓ Tabbarに被らないように底上げ
                                paddingBottom: tabbarHeight + playerViewHeight,
                                // 拡大モードの時、縦スクロールを許可しない
                                overflowY: isPlayerFullscreen
                                    ? "hidden"
                                    : "auto",
                            }}
                        >
                            <h3>テストUI</h3>
                            <SuperSearchBar />
                            {/* <TestSearchBar /> */}
                            <h3>デバッグ情報</h3>
                            <div>
                                <Button
                                    variant="outlined"
                                    onClick={() => toggleColorMode()}
                                >
                                    サイトテーマの切り替えボタン
                                </Button>
                                <Box sx={{ p: 2 }}>
                                    <Typography variant="h5">
                                        {theme.palette.mode} Theme Colors
                                    </Typography>
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="h6">
                                            Primary Colors
                                        </Typography>
                                        <Box sx={{ display: "flex", gap: 2 }}>
                                            <Box
                                                sx={{
                                                    bgcolor:
                                                        theme.palette.primary
                                                            .main,
                                                    color: theme.palette.primary
                                                        .contrastText,
                                                    p: 2,
                                                }}
                                            >
                                                {theme.palette.primary.main}
                                            </Box>
                                            <Box
                                                sx={{
                                                    bgcolor:
                                                        theme.palette.primary
                                                            .light,
                                                    color: theme.palette.primary
                                                        .contrastText,
                                                    p: 2,
                                                }}
                                            >
                                                {theme.palette.primary.light}
                                            </Box>
                                            <Box
                                                sx={{
                                                    bgcolor:
                                                        theme.palette.primary
                                                            .dark,
                                                    color: theme.palette.primary
                                                        .contrastText,
                                                    p: 2,
                                                }}
                                            >
                                                {theme.palette.primary.dark}
                                            </Box>
                                        </Box>
                                    </Box>
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="h6">
                                            Secondary Colors
                                        </Typography>
                                        <Box sx={{ display: "flex", gap: 2 }}>
                                            <Box
                                                sx={{
                                                    bgcolor:
                                                        theme.palette.secondary
                                                            .main,
                                                    color: theme.palette
                                                        .secondary.contrastText,
                                                    p: 2,
                                                }}
                                            >
                                                {theme.palette.secondary.main}
                                            </Box>
                                            <Box
                                                sx={{
                                                    bgcolor:
                                                        theme.palette.secondary
                                                            .light,
                                                    color: theme.palette
                                                        .secondary.contrastText,
                                                    p: 2,
                                                }}
                                            >
                                                {theme.palette.secondary.light}
                                            </Box>
                                            <Box
                                                sx={{
                                                    bgcolor:
                                                        theme.palette.secondary
                                                            .dark,
                                                    color: theme.palette
                                                        .secondary.contrastText,
                                                    p: 2,
                                                }}
                                            >
                                                {theme.palette.secondary.dark}
                                            </Box>
                                        </Box>
                                    </Box>
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="h6">
                                            Background Colors
                                        </Typography>
                                        <Box sx={{ display: "flex", gap: 2 }}>
                                            <Box
                                                sx={{
                                                    bgcolor:
                                                        theme.palette.background
                                                            .default,
                                                    color: theme.palette.text
                                                        .primary,
                                                    p: 2,
                                                }}
                                            >
                                                {
                                                    theme.palette.background
                                                        .default
                                                }
                                            </Box>
                                            <Box
                                                sx={{
                                                    bgcolor:
                                                        theme.palette.background
                                                            .paper,
                                                    color: theme.palette.text
                                                        .primary,
                                                    p: 2,
                                                }}
                                            >
                                                {theme.palette.background.paper}
                                            </Box>
                                        </Box>
                                    </Box>
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="h6">
                                            Text Colors
                                        </Typography>
                                        <Box sx={{ display: "flex", gap: 2 }}>
                                            <Box
                                                sx={{
                                                    color: theme.palette.text
                                                        .primary,
                                                    p: 2,
                                                }}
                                            >
                                                {theme.palette.text.primary}
                                            </Box>
                                            <Box
                                                sx={{
                                                    color: theme.palette.text
                                                        .secondary,
                                                    p: 2,
                                                }}
                                            >
                                                {theme.palette.text.secondary}
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                                <p>
                                    デバッグモード:{JSON.stringify(debugMode)}
                                </p>
                                <p>
                                    navbarの高さ: {JSON.stringify(navbarHeight)}
                                    px
                                </p>
                                <p>
                                    Tabberの高さ: {JSON.stringify(tabbarHeight)}
                                    px
                                </p>
                                <p>
                                    playerViewの高さ:{" "}
                                    {JSON.stringify(playerViewHeight)}
                                </p>
                                <p>
                                    現在選択されているentityId:{" "}
                                    {JSON.stringify(entityId)}
                                </p>
                                <p>
                                    アクティブなタブ:{" "}
                                    {JSON.stringify(activeTabList)}
                                </p>
                                <p>Screen Width: {screenWidth}px</p>
                                <p>Screen Height: {screenHeight}px</p>
                                <p>
                                    Device Type:{" "}
                                    {isMobile ? "Mobile" : "Desktop"}
                                </p>
                                <p>
                                    現在再生中の楽曲：{" "}
                                    {JSON.stringify(playerItem)}
                                </p>
                                <p>
                                    検索結果一覧:{" "}
                                    {JSON.stringify(playerSearchResult)}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* 画面下に固定されたタブバー */}
            <Grid
                container
                direction="column"
                sx={{
                    position: "fixed",
                    bottom: 0,
                }}
            >
                {/* 1段目 */}
                {/* Player */}
                {/* ↓ header(Navbar)に被らないように */}

                <Grid
                    item
                    sx={{
                        maxHeight: "100vh",
                        overflowY: "auto",
                        position: "fixed",
                        // bottom: tabbarHeight, // Tabbarの分浮かせる。
                        bottom: 0,
                        left: 0,
                        right: 0,
                    }}
                >
                    <PlayerView
                        screenWidth={screenWidth}
                        screenHeight={screenHeight}
                        setPlayerViewHeight={setPlayerViewHeight}
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
                            marginTop: isPlayerFullscreen ? navbarHeight : "", // header(Navbar)に被らないように
                            // ↓ Tabberの高さ分浮かせる
                            marginBottom: tabbarHeight, // Tabbarに被らないように底上
                            // (モバイルの場合は Tabberとの間に少し隙間を作る。)
                            // marginBottom: isMobile ? tabbarHeight + (screenHeight * 0.005) : tabbarHeight, // Tabbarに被らないように底上
                        }}
                    />
                </Grid>

                {/* 2段目 */}
                <Grid
                    item
                    sx={{
                        position: "fixed",
                        bottom: 0,
                        left: 0,
                        right: 0,
                    }}
                >
                    <Tabbar
                        debugMode={debugMode}
                        setDebugMode={setDebugMode}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        activeTabList={activeTabList}
                        setIsPlayerFullscreen={setIsPlayerFullscreen}
                        setTabbarHeight={setTabbarHeight}
                        screenHeight={screenHeight}
                        isMobile={isMobile}
                    />
                </Grid>
            </Grid>
        </>
    );
}
