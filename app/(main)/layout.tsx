"use client";

import LinkTab from "@/components/MainTabs/LinkTab";
import SongTab from "@/components/MainTabs/SongTab";
import { TemporaryYouTubeTab } from "@/components/MainTabs/TemporaryYouTubeTab";
import Navbar from "@/components/Navbar/Navbar";
import type { MultiSearchBarSearchSuggestion } from "@/components/Navbar/SearchBar/MultiSearchBar";
import MultiSearchBar from "@/components/Navbar/SearchBar/MultiSearchBar";
import type {
    AdditionalSearchSuggestions,
    InputValue,
} from "@/components/Navbar/SearchBar/SearchBar";
import PlayerView from "@/components/PlayerView";
import type { PlayerItem, PlayerPlaylist } from "@/components/PlayerView"; // 型としてのインポート
import type { TabMap } from "@/components/TabScroll";
import TabScroll from "@/components/TabScroll";
import { useApiDataContext } from "@/contexts/ApiDataContext";
import type { Entity, YouTubeAccount } from "@/contexts/ApiDataContext";
import { useBrowserInfoContext } from "@/contexts/BrowserInfoContext";
import { MusicNote } from "@mui/icons-material";
import GroupsIcon from "@mui/icons-material/Groups";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import PersonIcon from "@mui/icons-material/Person";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { AppBar } from "@mui/material";
import react, { Fragment } from "react";
import { useCallback } from "react";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // apiDataを取得
    const apiData = useApiDataContext("YouTubeAccount", "Entity", "Music");
    // ブラウザ情報を取得
    const { isMobile } = useBrowserInfoContext();

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
    // テキストの追加カテゴリー
    const [textSuggestionCategory, setTextSuggestionCategory] =
        react.useState<AdditionalSearchSuggestions[]>();
    // 入力中かどうか
    const [inProgressInput, setInProgressInput] =
        react.useState<boolean>(false);
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
    const [playerPlaylist, setPlayerPlaylist] = react.useState<
        PlayerPlaylist | undefined
    >();

    // 検索候補
    const ArtistsSearchSuggestions = useCallback(() => {
        const result: MultiSearchBarSearchSuggestion[] = [];
        // apiData.Music.data が存在するか確認
        const artists: string[] =
            apiData?.Music?.data?.map((item) =>
                item.musicArtist ? item.musicArtist : "",
            ) || [];
        // 重複を削除（Setを使用）
        // 重複を削除
        const uniqueArtists: string[] = artists.filter(
            (item, index, self) => self.indexOf(item) === index,
        );

        // 結果を作成
        for (const artistName of uniqueArtists) {
            if (artistName) {
                result.push({
                    label: String(artistName),
                    value: String(artistName),
                    categoryId: "musicArtistName",
                    categoryLabel: "楽曲アーティスト",
                    categorySort: 20,
                    icon: <MusicNoteIcon />, // アイコンが正しくインポートされていることを確認
                    queryMinLengthForSuggestions: 1,
                });
            }
        }

        return result;
    }, [apiData?.Music?.data?.map]);
    const musicSearchSuggestions = useCallback(() => {
        const result: MultiSearchBarSearchSuggestion[] = [];

        const musicTitles: string[] =
            apiData.Music.data.map((item) =>
                item.musicTitle ? item.musicTitle : "",
            ) || [];
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

        return result;
    }, [apiData.Music.data.map]);
    const entitySearchSuggestions = useCallback(() => {
        const result: MultiSearchBarSearchSuggestion[] = [];

        const Entity: Entity[] = apiData.Entity.data;
        const YouTubeAccounts: YouTubeAccount[] = apiData.YouTubeAccount.data;

        // トピックチャンネル
        const YMTopicAccounts: YouTubeAccount[] =
            apiData.YouTubeAccount.data.filter((item) => item.topic);
        // official artist account
        const YMOACAccounts: YouTubeAccount[] =
            apiData.YouTubeAccount.data.filter(
                (item) => item.officialArtistChannel,
            );
        // YouTubeMusicに関するアカウントかどうかを調べる。
        const checkYM = (entityId: string): boolean =>
            YMTopicAccounts.some((item) => item.entityId?.includes(entityId)) ||
            YMOACAccounts.some((item) => item.entityId?.includes(entityId));

        if (Entity.length !== 0 && YouTubeAccounts.length !== 0) {
            // データを変換し、検索候補の配列に追加
            for (const item of Entity) {
                const pickup = checkYM(item.id ?? "");
                const resultItem: MultiSearchBarSearchSuggestion = {
                    sort: item.category === "person" ? 99 : 100,
                    label: item.name + (pickup ? " ♪" : ""),
                    value: item.id ?? "",
                    filterMatchText:
                        (item.rubyJaHiragana ?? "") +
                        (item.rubyEn ?? "") +
                        (item.id ?? ""),
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
                                            .includes(item.id ?? "");
                                    }
                                });
                            const data = YouTubeAccount
                                ? JSON.parse(YouTubeAccount.apiData ?? "")
                                : undefined;
                            return data.snippet.thumbnails.default.url;
                        } catch (error) {
                            return undefined;
                        }
                    })(),

                    categoryId:
                        item.category === "person" ? "actor" : "organization",
                    categoryLabel:
                        item.category === "person"
                            ? "アーティスト"
                            : "グループ",
                    categorySort:
                        item.category === "person"
                            ? pickup
                                ? 101
                                : 100
                            : pickup
                              ? 103
                              : 102,
                };
                result.push(resultItem);
            }
        }

        return result;
    }, [apiData.Entity.data, apiData.YouTubeAccount.data]);

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
                //         setTextSuggestionCategory([]);
                //     },
                // },
                // {
                //     value: "songs",
                //     icon: <MusicNoteIcon />,
                //     label: "楽曲集",
                //     children: (
                //         <SongTab
                //             key="song"
                //             inputValue={inputValue}
                //             playerItem={playerItem}
                //             setPlayerItem={setPlayerItem}
                //             setPlayerPlaylist={setPlayerPlaylist}
                //         />
                //     ),
                //     scrollTo: 0,
                //     onClick: () => {
                //         setAvailableCategoryIds(["actor", "organization"]);
                //         setLimitSearchCategory([]);
                //         setFixedOptionValues([]);
                //         // 検索候補を更新
                //         setSearchSuggestion(entitySearchSuggestions());
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
                            setIsPlayerFullscreen={setIsPlayerFullscreen}
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
                            "specialWord_plusonica",
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
                        setTextSuggestionCategory([
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
                        ]);

                        const result: MultiSearchBarSearchSuggestion[] = [];

                        // スペシャル検索候補を追加
                        result.push({
                            label: "ぷらそにか(original)",
                            value: "ぷらそにか(original)",
                            categoryId: "specialWord_plusonica",
                            categoryLabel: "特別な検索",
                            categorySort: 999,
                            icon: <MusicNote />,
                        });
                        result.push({
                            label: "ぷらっとみゅーじっく♪",
                            value: "ぷらっとみゅーじっく♪",
                            categoryId: "specialWord_plusonica",
                            categoryLabel: "特別な検索",
                            categorySort: 999,
                            icon: <MusicNote />,
                        });
                        // 人物を追加
                        result.push(...entitySearchSuggestions());
                        // アーティストを追加
                        result.push(...ArtistsSearchSuggestions());
                        // 楽曲名を追加
                        result.push(...musicSearchSuggestions());

                        // 検索候補を更新
                        setSearchSuggestion(result);
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
                //
                //     },
                // },
            ].map((item, index) => {
                if (typeof window !== "undefined") {
                    item.scrollTo = window.innerWidth * index;
                }
                return item;
            }),
        [
            inputValue,
            playerItem,
            ArtistsSearchSuggestions,
            musicSearchSuggestions,
            entitySearchSuggestions,
        ],
    );

    const tabScroll = TabScroll(tabMaps, setIsPlayerFullscreen);

    return (
        <Fragment>
            <Navbar
                style={{
                    // 入力中は親要素を非表示
                    visibility:
                        isMobile && inProgressInput ? "hidden" : "visible",
                    // ↓ サーチバーに入力する項目が複数行に渡っても背景を確保できるように伸ばす。
                    height: isMobile && inProgressInput ? "20vh" : undefined,
                }}
                setNavbarHeight={setNavbarHeight}
            >
                <MultiSearchBar
                    style={{
                        // 入力中でも子要素を表示
                        visibility: "visible",
                        // ポジションを一番上にする
                        position:
                            isMobile && inProgressInput ? "fixed" : undefined,
                        top: isMobile && inProgressInput ? 0 : undefined,
                        // サーチバーを端から端までしっかり表示する。
                        minWidth:
                            isMobile && inProgressInput ? "auto" : undefined,
                        width: isMobile && inProgressInput ? "90%" : undefined, // ← safari(webkit)はこれがないとバグる。chromeはバグらない。
                    }}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    searchSuggestion={searchSuggestion}
                    fixedOptionValues={fixedOptionValues}
                    availableCategoryIds={availableCategoryIds}
                    // テキストの追加カテゴリー
                    textSuggestionCategory={textSuggestionCategory}
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
                    setInProgressInput={setInProgressInput}
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
                        playerItem={playerItem}
                        setPlayerItem={setPlayerItem}
                        playerPlaylist={playerPlaylist}
                        setPlayerPlaylist={setPlayerPlaylist}
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
