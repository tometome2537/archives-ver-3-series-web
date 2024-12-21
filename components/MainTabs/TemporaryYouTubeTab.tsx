import type { InputValue } from "@/components/Navbar/SuperSearchBar";
import { buildUrl } from "@/libs/urlBuilder";
import { Box } from "@mui/material";
import type { Dispatch, SetStateAction } from "react";
import { Fragment, useCallback, useEffect, useState } from "react";
import Loading from "../Loading";
import type { PlayerItem } from "../PlayerView";
import Thumbnail from "../Thumbnail";

type VideoTemporaryObj = {
    videoId: string; // 動画ID
    channelId: string | undefined; // チャンネルID
    channelTitle: string | undefined; // チャンネル名
    videoArchiveUrl: string | undefined; // 動画アーカイブURL
    thumbnailArchiveUrl: string | undefined; // サムネイルアーカイブURL
    title: string | undefined; // 動画タイトル
    publishedAt: string | undefined; // 公開日時
    privacyStatus: string | undefined; // プライバシー設定
    viewCount: number | undefined; // 再生回数（数値型）
    short: boolean | undefined; // ショート動画フラグ
    live: boolean | undefined; // ライブ動画フラグ（null可）
    categoryFromYTApi: number | undefined; // カテゴリ（YouTube APIから取得）
    category: string | undefined; // カテゴリ（手動設定、null可）
    tagText: string | undefined | null; // タグテキスト（null可）
    person: string | undefined; // 関連人物
    addPerson: string | undefined; // 追加する人物
    deletePerson: string | undefined; // 削除する人物
    organization: string | undefined; // 関連組織（JSON形式）
    addOrganization: string | undefined; // 追加する組織（null可）
    deleteOrganization: string | undefined; // 削除する組織（null可）
    karaokeKey: string | undefined; // カラオケキー（null可）
    apiData: string | undefined;
};

type TemporaryYouTubeTab = {
    isMobile: boolean;
    inputValue: InputValue[];
    playerItem: PlayerItem | undefined;
    setPlayerItem: Dispatch<SetStateAction<PlayerItem | undefined>>;
    setPlayerPlaylist: Dispatch<SetStateAction<PlayerItem[]>>;
    setPlayerSearchResult: Dispatch<SetStateAction<PlayerItem[]>>;
};

enum LoadingState {
    Loading = 0,
    FastLoaded = 1,
    AllLoaded = 2,
}

export function TemporaryYouTubeTab(props: TemporaryYouTubeTab) {
    // APIで取得したデータを格納
    const [apiDataVideo, setApiDataVideo] = useState<VideoTemporaryObj[]>([]);
    // 検索結果の動画一覧
    const [resultVideo, setResultVideo] = useState<
        VideoTemporaryObj[] | undefined
    >(undefined);
    // API通信中かどうか
    const [loading, setLoading] = useState<LoadingState>(LoadingState.Loading);
    // API通信でエラーが出たかどうか
    const [error, setError] = useState<string | null>(null);

    // APIからイベントデータを取得
    const fetchEvents = useCallback(async () => {
        const fetchData = async (params: Record<string, string>) => {
            const baseUrl = "https://api.sssapi.app/mGZMorh9GOgyer1w4LvBp";
            const url = buildUrl(baseUrl, params);
            const response = await fetch(url, {
                headers: {
                    Authorization:
                        "token s3a_aBU5U86DKPiAuUvWrPHx+q44l_tQJJJ=0L9I",
                },
            });
            if (response.ok === false) {
                throw new Error("Network response was not ok");
            }
            return await response.json();
        };

        try {
            // Video取得
            // 最初の15件を取得
            const fastParams = {
                filter__channelId__exact: "UCZx7esGXyW6JXn98byfKEIA",
                order_by: "-publishedAt",
                limit: "15",
            };
            const fastData = await fetchData(fastParams);
            setApiDataVideo(fastData);
            // 仮だけどローディングを解除
            setLoading(LoadingState.FastLoaded);

            // そのあと全てを取得
            const slowParams = {
                filter__channelId__exact: "UCZx7esGXyW6JXn98byfKEIA",
                order_by: "-publishedAt",
                offset: "15",
            };
            const restData = await fetchData(slowParams);
            setApiDataVideo((data) => data.concat(restData));
            setLoading(LoadingState.AllLoaded); // ローディングを解除
        } catch (err) {
            setError((err as Error).message); // エラーを表示
            setLoading(LoadingState.AllLoaded); // ローディングを解除
        }
    }, []);

    // API通信を定義
    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    // サーチバーの値を取得し結果を表示。
    useEffect(() => {
        // 最初はapiDataVideoが空だから何もしない
        // これがないとAPIからデータを取得する前に結果が0と表示されてしまう
        if (apiDataVideo.length === 0) return;

        setLoading(true);
        const result = apiDataVideo.filter((item) => {
            // 検索結果を100件に制限(開発中の一時的処置)
            // if (index > 100) {
            //     return false;
            // }

            // 公開設定は一般公開に限る
            if (item.privacyStatus !== "public") {
                return false;
            }

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
                    // 概要欄の条件を満たさなければfalse
                    if (
                        item.title?.match(inputValue.value) ||
                        (item.apiData &&
                            // JSON.parse(item.apiData).snippet.description &&
                            !JSON.parse(
                                item.apiData,
                            ).snippet.description?.match(inputValue.value))
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

                if (inputValue.categoryId === "specialWord_PlatMusic") {
                    // タイトルの条件を満たさなければfalse
                    if (!item.title?.match(/ぷらそにか/)) {
                        return false;
                    }
                    // 概要欄の条件を満たさなければfalse
                    if (
                        item.apiData &&
                        !JSON.parse(item.apiData).snippet.description?.match(
                            /ぷらっとみゅーじっく♪/,
                        )
                    ) {
                        return false;
                    }
                }
            }

            return true;
        });

        setResultVideo(result);
        setLoading(false);
    }, [props.inputValue, apiDataVideo]);

    // 動画サムネイルがクリックされたときに呼ばれる関数
    const handleVideoClick = (event: React.MouseEvent<HTMLElement>) => {
        const videoId = event.currentTarget.getAttribute("data-videoId");
        props.setPlayerItem({
            videoId: videoId ? videoId : "",
        });
        // APIから受け取った値の型を変換する。
        const searchResult: Array<PlayerItem> = resultVideo
            ? resultVideo.map((item: VideoTemporaryObj) => {
                  const result: PlayerItem = {
                      videoId: item.videoId,
                      title: item.title,
                      description:
                          item.apiData &&
                          JSON.parse(item.apiData).snippet.description,
                      viewCount: Number(item.viewCount),
                      channelId: item.channelId,
                      channelTitle: item.channelTitle,
                      publishedAt: item.publishedAt
                          ? new Date(item.publishedAt)
                          : undefined,
                      actorId: item.person
                          ? item.person.split(/ , |,| ,|, /).filter((v) => v)
                          : [],
                      organization: Object.keys(
                          JSON.parse(item.organization || "{}"),
                      ),
                  };
                  return result;
              })
            : [];
        props.setPlayerSearchResult(searchResult);
    };

    // ローディング中
    if (loading === LoadingState.Loading) {
        // return <div>VideoViewTemporary Loading...</div>;
        return (
            <div
                style={{
                    paddingTop: "30vh",
                }}
            >
                <Loading />
            </div>
        );
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
                    display: "flex",
                    padding: "0 auto",
                    justifyContent: "center", // 中央に配置
                    alignItems: "center", // 縦方向にも中央に配置
                    flexWrap: "wrap", // ラップさせて複数行に
                    gap: "10px", // アイテム間のスペースを追加
                }}
            >
                {resultVideo &&
                    (resultVideo.length !== 0 ? (
                        <>
                            {resultVideo.map((item: VideoTemporaryObj) => (
                                <>
                                    {/* 各アイテムを表示 */}

                                    <Thumbnail
                                        key={item.videoId}
                                        thumbnailType="list"
                                        // isPlayingOnHover={
                                        //     props.playerItem.videoId === "" ||
                                        //     props.playerItem.videoId === undefined
                                        // }
                                        videoId={item.videoId}
                                        title={item.title}
                                        viewCount={Number(item.viewCount)}
                                        channelTitle={item.channelTitle}
                                        publishedAt={
                                            new Date(item.publishedAt || 0)
                                        }
                                        onClick={handleVideoClick}
                                    />
                                </>
                            ))}
                        </>
                    ) : (
                        <div>検索結果が0です。</div>
                    ))}
            </Box>
            <div
                style={{
                    paddingTop: "3vh",
                }}
            >
                <Loading />
            </div>
        </Fragment>
    );
}
