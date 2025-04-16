import LoadingPage from "@/components/LoadingPage";
import type { InputValue } from "@/components/Navbar/SearchBar/SearchBar";
import type { Video } from "@/contexts/ApiDataContext";
import { useApiDataContext } from "@/contexts/ApiDataContext";
import type { YouTubeAccount } from "@/contexts/ApiDataContext";
import { useBrowserInfoContext } from "@/contexts/BrowserInfoContext";
import { Box } from "@mui/material";
import type { Dispatch, SetStateAction } from "react";
import { Fragment, useCallback, useEffect, useState } from "react";
import Album from "../Album";
import Loading from "../Loading";
import type { PlayerItem, PlayerPlaylist } from "../PlayerView";
import Thumbnail from "../Thumbnail";
import { PlayerType } from "../PlayerView";
import {
    YouTubeApi,
    type YoutubeRelease,
} from "@/src/openapi-client/api-node-tometome";

type TemporaryYouTubeTab = {
    inputValue: InputValue[];
    playerItem: PlayerItem | undefined;
    setPlayerItem: Dispatch<SetStateAction<PlayerItem | undefined>>;
    setPlayerPlaylist: Dispatch<SetStateAction<PlayerPlaylist | undefined>>;
    setIsPlayerFullscreen: Dispatch<SetStateAction<boolean>>;
};

enum LoadingState {
    Loading = 0,
    FastLoaded = 1,
    AllLoaded = 2,
}

export function TemporaryYouTubeTab(props: TemporaryYouTubeTab) {
    // apiDataを取得
    const apiData = useApiDataContext();
    // ブラウザ情報を取得
    const { isMobile } = useBrowserInfoContext();

    // APIで取得した全データを格納
    const [apiDataVideo, setApiDataVideo] = useState<Video[]>([]);
    // 検索結果の動画一覧
    const [resultVideo, setResultVideo] = useState<Video[] | null>(null);
    // YTMのAPI結果
    // 型定義を修正
    const [artistYTM, setArtistYTM] = useState<string | null>(null);

    const [albums, setAlbums] = useState<YoutubeRelease[]>([]);

    // API通信中かどうか
    const [loading, setLoading] = useState<LoadingState>(LoadingState.Loading);
    // API通信でエラーが出たかどうか
    const [error, setError] = useState<string | null>(null);

    // APIからイベントデータを取得
    const fetchEvents = useCallback(async () => {
        try {
            // Video取得
            // 最初の15件を取得
            const fastParams = {
                filter__channelTitle__contains: "ぷらそにか",
                filter__privacyStatus__exact: "public",
                order_by: "-publishedAt",
                limit: "15",
            };
            const fastData = await apiData.Video.getDataWithParams(fastParams);
            setApiDataVideo(fastData);
            // 仮だけどローディングを解除
            setLoading(LoadingState.FastLoaded);

            // そのあと全てを取得
            const slowParams = {
                filter__channelTitle__contains: "ぷらそにか",
                filter__privacyStatus__exact: "public",
                order_by: "-publishedAt",
                offset: "15",
            };
            const restData = await apiData.Video.getDataWithParams(slowParams);
            setApiDataVideo((data) => data.concat(restData));
            setLoading(LoadingState.AllLoaded); // ローディングを解除

            // 重複を削除
            setApiDataVideo((data) =>
                data.filter(
                    (x: Video, i: number, self: Video[]) =>
                        self.findIndex(
                            (y: Video) => y.videoId === x.videoId,
                        ) === i,
                ),
            );
        } catch (err) {
            setError((err as Error).message); // エラーを表示
            setLoading(LoadingState.AllLoaded); // ローディングを解除
        }
    }, [apiData.Video.getDataWithParams]);

    // API通信を定義
    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    // サーチバーの値を取得し結果を表示。
    useEffect(() => {
        // 最初はapiDataVideoが空だから何もしない
        // これがないとAPIからデータを取得する前に結果が0と表示されてしまう
        if (apiDataVideo.length === 0) {
            setLoading(LoadingState.AllLoaded);
            return;
        }

        setLoading(LoadingState.Loading);
        const result = apiDataVideo.filter((item) => {
            // shortは非表示
            if (item.short === true) {
                return false;
            }

            // 各inputValueに対してすべての条件を確認
            for (const inputValue of props.inputValue) {
                if (inputValue.categoryId === "YouTubeChannel") {
                    // YouTubeチャンネルの条件を満たさなければfalse
                    if (item.channelId !== inputValue.value) {
                        return false;
                    }
                }
                if (inputValue.categoryId === "actor") {
                    // 出演者の条件を満たさなければfalse
                    if (!item.person?.match(inputValue.value)) {
                        return false;
                    }
                }

                if (inputValue.categoryId === "organization") {
                    // 組織の条件を満たさなければfalse
                    if (!item.organization?.match(inputValue.value)) {
                        return false;
                    }
                }

                if (inputValue.categoryId === "title") {
                    // タイトルの条件を満たさなければfalse
                    if (!item.title?.match(inputValue.value)) {
                        return false;
                    }
                }

                if (inputValue.categoryId === "") {
                    // 出演者、タイトル、概要欄の条件を満たさなければfalse
                    if (
                        !(
                            item.person?.match(inputValue.value) ||
                            item.title?.match(inputValue.value) ||
                            (item.apiData &&
                                // JSON.parse(item.apiData).snippet.description &&
                                JSON.parse(
                                    item.apiData,
                                ).snippet.description?.match(inputValue.value))
                        )
                    ) {
                        return false;
                    }
                }

                if (inputValue.categoryId === "description") {
                    // 概要欄の条件を満たさなければfalse
                    if (
                        item.apiData &&
                        // JSON.parse(item.apiData).snippet.description &&
                        !JSON.parse(item.apiData).snippet.description?.match(
                            inputValue.value,
                        )
                    ) {
                        return false;
                    }
                }

                if (inputValue.categoryId === "musicArtistName") {
                    // タイトルの条件を満たさなければfalse
                    if (
                        !item.title?.match(inputValue.value) ||
                        // ↓ Official髭男dism要検証 (To Do)
                        (item.tagText && !item.tagText?.match(inputValue.value))
                    ) {
                        return false;
                    }
                }

                if (inputValue.categoryId === "musicTitle") {
                    // タイトルの条件を満たさなければfalse
                    if (!item.title?.match(inputValue.value)) {
                        return false;
                    }
                }

                if (inputValue.value === "ぷらっとみゅーじっく♪") {
                    // タイトルの条件を満たさなければfalse
                    if (!item.title?.match(/ぷらそにか/)) {
                        return false;
                    }
                    // 概要欄の条件を満たさなければfalse
                    if (
                        item.apiData &&
                        !JSON.parse(item.apiData).snippet.description?.match(
                            /ぷらっとみゅーじっく/,
                        )
                    ) {
                        return false;
                    }
                }

                if (inputValue.value === "ぷらそにか(original)") {
                    // タイトルの条件を満たさなければfalse
                    if (!item.title?.match(/ぷらそにか/)) {
                        return false;
                    }
                    if (!item.title?.match(/original/)) {
                        return false;
                    }
                }
            }

            return true;
        });

        setResultVideo(result);
        setLoading(LoadingState.AllLoaded);
    }, [props.inputValue, apiDataVideo]);

    const fetchReleases = useCallback(async (channelId: string) => {
        const youtubeApi = new YouTubeApi();
        const res = await youtubeApi.v1YoutubeReleasesGet({
            channelid: channelId,
        });
        // アルバムを前に並び替える。
        const sortAlbums = res.releases?.sort((a, b) => {
            const aIncludes = a.type?.includes("album") ? -1 : 1;
            const bIncludes = b.type?.includes("album") ? -1 : 1;
            return aIncludes - bIncludes;
        });
        setAlbums(sortAlbums ?? []);
    }, []);

    // YouTubeMusicの楽曲を表示する
    useEffect(() => {
        // トピックチャンネル
        const YMTopicAccounts: YouTubeAccount[] =
            apiData.YouTubeAccount.data.filter((item) => item.topic);
        // official artist account
        const YMOACAccounts: YouTubeAccount[] =
            apiData.YouTubeAccount.data.filter(
                (item) => item.officialArtistChannel,
            );

        // 各inputValueに対してすべての条件を確認
        props.inputValue.find((inputValue) => {
            // トピックチャンネルの方が取得できる情報量が多い。
            if (
                inputValue.categoryId === "actor" ||
                inputValue.categoryId === "organization"
            ) {
                const topicCh = YMTopicAccounts.find((item) =>
                    item.entityId?.includes(inputValue.value),
                );
                if (topicCh) {
                    fetchReleases(topicCh.userId ?? "");
                    setArtistYTM(topicCh.name);
                    return true;
                }
                const OACCh = YMOACAccounts.find((item) =>
                    item.entityId?.includes(inputValue.value),
                );
                if (OACCh) {
                    fetchReleases(OACCh.userId ?? "");
                    setArtistYTM(OACCh.name);
                    return true;
                }
                setArtistYTM(null);
                setAlbums([]);
                return false;
            }
            if (inputValue.categoryId === "specialWord_plusonica") {
                fetchReleases("UC3tYTei6p55gWg2rr0g4ybQ");
                return true;
            }
        });
        if (props.inputValue.length === 0) {
            setArtistYTM(null);
            setAlbums([]);
        }
    }, [apiData.YouTubeAccount.data, props.inputValue, fetchReleases]);

    // ローディング中
    if (apiDataVideo.length === 0 && loading === LoadingState.Loading) {
        return <LoadingPage />;
    }
    // エラーの場合
    if (error) {
        return (
            <div>
                VideoViewTemporary Error: {error}
                <div
                    onClick={fetchEvents} // クリックイベント
                    onKeyDown={fetchEvents} // キーボードイベント
                >
                    再読み込み
                </div>
            </div>
        );
    }
    return (
        <Fragment>
            <Box
                sx={{
                    padding: "0 auto",
                    alignItems: "center", // 縦方向にも中央に配置
                    gap: "10px", // アイテム間のスペースを追加
                }}
            >
                {artistYTM && (
                    <>
                        <h4
                            style={{
                                margin: "10px",
                                textAlign: "center",
                            }}
                        >
                            {albums.length !== 0
                                ? `${artistYTM} さんのアルバムも聴いてみよう ♪`
                                : ""}
                        </h4>
                        <Box
                            sx={{
                                display: "flex",
                                overflowX: "scroll",
                                maxWidth: "100vw",
                                marginBottom: "20px",
                            }}
                        >
                            {albums.map((albumsItem) => (
                                <Album
                                    key={albumsItem.title}
                                    style={{
                                        minWidth: isMobile ? "30vw" : "15vw",
                                    }}
                                    title={albumsItem.title}
                                    year={`${albumsItem.type}・${albumsItem.year}年`}
                                    imgSrc={albumsItem.thumbnailUrl}
                                    onClick={() => {
                                        const fetch = async () => {
                                            const tracks =
                                                albumsItem.trackVideoIds ?? [];
                                            props.setPlayerItem({
                                                type: PlayerType.YouTube,
                                                mediaId: tracks[0],
                                            });
                                            if (tracks.length !== 0) {
                                                props.setPlayerPlaylist({
                                                    title: albumsItem?.title,
                                                    videos: tracks.map(
                                                        (item) => {
                                                            return {
                                                                type: PlayerType.YouTube,
                                                                mediaId: item,
                                                            };
                                                        },
                                                    ),
                                                });
                                            }
                                        };
                                        fetch();
                                        props.setIsPlayerFullscreen(true);
                                    }}
                                />
                            ))}
                        </Box>
                    </>
                )}
                <Box
                    sx={{
                        display: "flex",

                        justifyContent: "center", // 中央に配置
                        alignItems: "center", // 縦方向にも中央に配置
                        flexWrap: "wrap", // ラップさせて複数行に
                    }}
                >
                    {resultVideo &&
                        (resultVideo.length !== 0 ? (
                            <>
                                {resultVideo.map((item: Video) => (
                                    <Box
                                        //  各アイテムを表示
                                        key={item.videoId}
                                        sx={{
                                            width: isMobile ? "100%" : "30%",
                                            maxWidth: isMobile ? "100%" : "30%",
                                            margin: "0 auto",
                                        }}
                                    >
                                        <Thumbnail
                                            // ↓ To Do 余裕があったら切り替えボタン
                                            // thumbnailType={
                                            //     props.isMobile
                                            //         ? "list"
                                            //         : undefined
                                            // }
                                            //
                                            // isPlayingOnHover={
                                            //     props.playerItem.videoId === "" ||
                                            //     props.playerItem.videoId === undefined
                                            // }
                                            videoId={item.videoId ?? ""}
                                            title={item.title ?? undefined}
                                            viewCount={Number(item.viewCount)}
                                            channelTitle={
                                                item.channelTitle ?? undefined
                                            }
                                            publishedAt={
                                                new Date(item.publishedAt || 0)
                                            }
                                            onClick={() => {
                                                props.setPlayerItem({
                                                    type: PlayerType.YouTube,
                                                    mediaId:
                                                        item.videoId ??
                                                        undefined,
                                                });
                                                // APIから受け取った値の型を変換する。
                                                const searchResult: Array<PlayerItem> =
                                                    resultVideo
                                                        ? resultVideo.map(
                                                              (item: Video) => {
                                                                  const result: PlayerItem =
                                                                      {
                                                                          type: PlayerType.YouTube,
                                                                          mediaId:
                                                                              item.videoId ??
                                                                              undefined,
                                                                          title:
                                                                              item.title ??
                                                                              undefined,
                                                                          description:
                                                                              item.apiData &&
                                                                              JSON.parse(
                                                                                  item.apiData,
                                                                              )
                                                                                  .snippet
                                                                                  .description,
                                                                          viewCount:
                                                                              Number(
                                                                                  item.viewCount,
                                                                              ),
                                                                          channelId:
                                                                              item.channelId ??
                                                                              undefined,
                                                                          author:
                                                                              item.channelTitle ??
                                                                              undefined,
                                                                          publishedAt:
                                                                              item.publishedAt
                                                                                  ? new Date(
                                                                                        item.publishedAt,
                                                                                    )
                                                                                  : undefined,
                                                                          actorId:
                                                                              item.person
                                                                                  ? item.person
                                                                                        .split(
                                                                                            / , |,| ,|, /,
                                                                                        )
                                                                                        .filter(
                                                                                            (
                                                                                                v,
                                                                                            ) =>
                                                                                                v,
                                                                                        )
                                                                                  : [],
                                                                          organizationId:
                                                                              Object.keys(
                                                                                  JSON.parse(
                                                                                      item.organization ||
                                                                                          "{}",
                                                                                  ),
                                                                              ),
                                                                      };
                                                                  return result;
                                                              },
                                                          )
                                                        : [];
                                                props.setPlayerPlaylist({
                                                    videos: searchResult,
                                                });
                                                props.setIsPlayerFullscreen(
                                                    true,
                                                );
                                            }}
                                        />
                                    </Box>
                                ))}
                            </>
                        ) : (
                            <div>検索結果が0です。</div>
                        ))}
                </Box>
            </Box>
            {
                // ロードが完了している場合は何も表示しない
                loading !== LoadingState.AllLoaded &&
                    loading !== LoadingState.FastLoaded && (
                        <div
                            style={{
                                paddingTop: "3vh",
                            }}
                        >
                            <Loading />
                        </div>
                    )
            }
        </Fragment>
    );
}
