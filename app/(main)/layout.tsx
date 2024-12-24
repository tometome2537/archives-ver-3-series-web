"use client";

import { TemporaryYouTubeTab } from "@/components/MainTabs/TemporaryYouTubeTab";
import Navbar from "@/components/Navbar/Navbar";
import type { MultiSearchBarSearchSuggestion } from "@/components/Navbar/SearchBar/MultiSearchBar";
import type {
    AdditionalSearchSuggestions,
    InputValue,
} from "@/components/Navbar/SearchBar/SearchBar";
import PlayerView from "@/components/PlayerView";
import type { PlayerItem } from "@/components/PlayerView"; // 型としてのインポート
import type { TabMap } from "@/components/TabScroll";
import TabScroll from "@/components/TabScroll";
import { useApiDataContext } from "@/contexts/ApiDataContext";
import type { ApiData } from "@/contexts/ApiDataContext";
import { useBrowserInfoContext } from "@/contexts/BrowserInfoContext";
import GradeIcon from "@mui/icons-material/Grade";
import GroupsIcon from "@mui/icons-material/Groups";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import PersonIcon from "@mui/icons-material/Person";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { AppBar } from "@mui/material";
import Image from "next/image";
import react, { Fragment } from "react";
import MultiSearchBar from "@/components/Navbar/SearchBar/MultiSearchBar";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import LinkTab from "@/components/MainTabs/LinkTab";
import type { YouTubeAccount, Music, Entity } from "@/contexts/ApiDataContext";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // apiDataを取得
    const apiData = useApiDataContext("YouTubeAccount", "Entity", "Music");
    // ブラウザ情報を取得
    const { isMobile } = useBrowserInfoContext();

    // ローディング画面
    const [isLoading, setIsLoading] = react.useState<boolean>(true);

    // ⭐️ここからマルチサーチバー関連
    // 入力された値
    const [inputValue, setInputValue] = react.useState<InputValue[]>([]);
    // 検索候補
    const [searchSuggestion, setSearchSuggestion] = react.useState<
        MultiSearchBarSearchSuggestion[]
    >([]);
    // そのViewで使用される値のCategoryID配列
    const [availableCategoryIds, setAvailableCategoryIds] =
        react.useState<string[]>();
    // 外せない入力値を定義
    const [fixedOptionValues, setFixedOptionValues] =
        react.useState<string[]>();
    // limitスーパーサーチで表示するカテゴリーの定義
    const [limitSearchCategory, setLimitSearchCategory] =
        react.useState<AdditionalSearchSuggestions[]>();
    // ⭐️ここまでマルチサーチバー関連

    // Navbarの高さを定義
    const [navbarHeight, setNavbarHeight] = react.useState<number | undefined>(
        undefined,
    );

    // PlayerViewを拡大表示するかどうか
    const [isPlayerFullscreen, setIsPlayerFullscreen] =
        react.useState<boolean>(false);
    // PlayerView
    const [playerItem, setPlayerItem] = react.useState<PlayerItem | undefined>(
        undefined,
    );
    const [playerPlaylist, setPlayerPlaylist] = react.useState<PlayerItem[]>(
        [],
    );
    const [playerSearchResult, setPlayerSearchResult] = react.useState<
        PlayerItem[]
    >([]);

    // useMemoでタブ設定を作成
    const tabMaps: TabMap[] = react.useMemo(
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
                //         setLimitSearchCategory([]);
                //         setFixedOptionValues([]);
                //         setIsPlayerFullscreen(false);
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
                //         setLimitSearchCategory([]);
                //         setFixedOptionValues([]);
                // setIsPlayerFullscreen(false);
                //     },
                // },
                {
                    value: "",
                    icon: <YouTubeIcon />,
                    label: "ぷらそにか",
                    scrollTo: 0,
                    children: (
                        <TemporaryYouTubeTab
                            key="tempYoutube"
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
                        setLimitSearchCategory([
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
                        setIsPlayerFullscreen(false);
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
                //         setLimitSearchCategory([]);
                //         setFixedOptionValues([]);
                // setIsPlayerFullscreen(false);
                //     },
                // },
            ].map((item, index) => {
                if (typeof window !== "undefined") {
                    item.scrollTo = window.innerWidth * index;
                }
                return item;
            }),
        [inputValue, playerItem],
    );

    const tabScroll = TabScroll(tabMaps);

    // 検索候補を定義
    react.useEffect(() => {
        const YouTubeAccounts: YouTubeAccount[] = apiData.YouTubeAccount.data;
        const Entity: Entity[] = apiData.Entity.data;
        const Music: Music[] = apiData.Music.data;

        const result: MultiSearchBarSearchSuggestion[] = [];

        // スペシャル検索候補を追加
        result.push({
            label: "ぷらっとみゅーじっく♪",
            value: "ぷらっとみゅーじっく♪",
            categoryId: "specialWord_PlatMusic",
            categoryLabel: "特別な検索",
            categorySort: 999,
            icon: <GradeIcon sx={{ color: "rgb(227, 220, 18)" }} />,
        });

        if (Entity && YouTubeAccounts) {
            // データを変換し、検索候補の配列に追加
            for (const item of Entity) {
                const resultItem: MultiSearchBarSearchSuggestion = {
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
                            const YouTubeAccount: YouTubeAccount | undefined =
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

        setIsLoading(false);
    }, [apiData.Entity.data, apiData.Music.data, apiData.YouTubeAccount.data]);

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
            <Navbar setNavbarHeight={setNavbarHeight}>
                <MultiSearchBar
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    searchSuggestion={searchSuggestion}
                    fixedOptionValues={fixedOptionValues}
                    availableCategoryIds={availableCategoryIds}
                    // テキストの追加カテゴリー
                    textSuggestionCategory={[
                        {
                            sort: 20,
                            categoryId: "title",
                            categoryLabel: "タイトル",
                        },
                        {
                            sort: 22,
                            categoryId: "description",
                            categoryLabel: "概要欄",
                        },
                        // {
                        //     sort: 21,
                        //     categoryId: "subTitle",
                        //     categoryLabel:
                        //         "サブタイトルに含む文字列",
                        // },
                    ]}
                    // 日付の追加カテゴリー
                    dateSuggestionCategory={
                        [
                            // {
                            //     sort: 10,
                            //     // カテゴリーのID
                            //     categoryId: "since",
                            //     // カテゴリーのラベル(表示に使用)
                            //     categoryLabel: "開始日",
                            // },
                            // {
                            //     sort: 11,
                            //     categoryId: "until",
                            //     categoryLabel: "終了日",
                            // },
                        ]
                    }
                    limitSearchCategory={limitSearchCategory}
                    // スマホの場合はタグのアイコンを非表示
                    showTagIcon={inputValue.length <= 2 ? true : !isMobile}
                    // スマホの場合に表示するタグの個数を制限する。
                    showTagCount={isMobile ? 2 : undefined}
                    searchOnChange={() => {
                        setIsPlayerFullscreen(false);
                    }}
                />
            </Navbar>
            {/* メインコンテンツ */}
            {tabScroll.mainContents()}
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
                {/* タブ切り替えボタン */}
                {tabScroll.tabs()}
            </AppBar>
        </Fragment>
    );
}
