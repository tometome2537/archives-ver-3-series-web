import buildUrlWithQuery from "@/libs/buildUrl";
import { Box } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { EntityObj } from "./EntitySelector";
import Loading from "./Loading";
import type { PlayerItem } from "./PlayerView";
import Thumbnail from "./Thumbnail";
import SuperSearchBar, {
    type InputValueSearchSuggestion,
} from "@/components/Navbar/SuperSearchBar";

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
    tagText: string | undefined; // タグテキスト（null可）
    person: string | undefined; // 関連人物
    addPerson: string | undefined; // 追加する人物
    deletePerson: string | undefined; // 削除する人物
    organization: string | undefined; // 関連組織（JSON形式）
    addOrganization: string | undefined; // 追加する組織（null可）
    deleteOrganization: string | undefined; // 削除する組織（null可）
    karaokeKey: string | undefined; // カラオケキー（null可）
};

type VideoViewTemporaryProps = {
    inputValue: InputValueSearchSuggestion[];
    playerItem: PlayerItem;
    entityIds: Array<EntityObj>;
    setPlayerItem: Dispatch<SetStateAction<PlayerItem>>;
    setPlayerPlaylist: Dispatch<SetStateAction<Array<PlayerItem>>>;
    setPlayerSearchResult: Dispatch<SetStateAction<Array<PlayerItem>>>;
};

export default function VideoTemporaryView(props: VideoViewTemporaryProps) {
    // APIで取得したデータを格納
    const [apiDataVideo, setApiDataVideo] = useState<VideoTemporaryObj[]>([]);
    // 検索結果の動画一覧
    const [resultVideo, setResultVideo] = useState<
        VideoTemporaryObj[] | undefined
    >(undefined);
    // API通信中かどうか
    const [loading, setLoading] = useState(true);
    // API通信でエラーが出たかどうか
    const [error, setError] = useState<string | null>(null);

    // APIからイベントデータを取得
    const fetchEvents = useCallback(async () => {
        try {
            // Video取得
            const url = "https://api.sssapi.app/mGZMorh9GOgyer1w4LvBp";
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            setApiDataVideo(data.reverse());
        } catch (err) {
            setError((err as Error).message); // エラーを表示
        } finally {
            setLoading(false); // ローディングを解除
        }
    }, []);

    // API通信を定義
    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    // サーチバーの値を取得し結果を表示。
    useEffect(() => {
        const result = apiDataVideo.filter((item, index) => {
            // 検索結果を100件に制限(開発中の一時的処置)
            // if (index > 100) {
            //     return false;
            // }
            let match = true;

            // 各inputValueに対してすべての条件を確認
            for (const inputValue of props.inputValue) {
                if (inputValue.categoryId === "YouTubeChannel") {
                    // YouTubeチャンネルの条件を満たさなければfalse
                    if (item.channelId !== inputValue.value) {
                        match = false;
                    }
                } else if (inputValue.categoryId === "actor") {
                    // 出演者の条件を満たさなければfalse
                    if (!item.person?.match(inputValue.value)) {
                        match = false;
                    }
                } else if (inputValue.categoryId === "organization") {
                    // 出演者の条件を満たさなければfalse
                    if (!item.organization?.match(inputValue.value)) {
                        match = false;
                    }
                } else if (inputValue.categoryId === "title") {
                    // 出演者の条件を満たさなければfalse
                    if (!item.title?.match(inputValue.value)) {
                        match = false;
                    }
                }
            }

            return match; // すべての条件がtrueの場合のみ結果に含める
        });

        setResultVideo(result);
    }, [props.inputValue, apiDataVideo]);

    // 動画サムネイルがクリックされたときに呼ばれる関数
    const handleVideoClick = (event: React.MouseEvent<HTMLElement>) => {
        const videoId = event.currentTarget.getAttribute("data-videoId");
        props.setPlayerItem({
            videoId: videoId ? videoId : "",
        });
        // APIから受け取った値の型を変換する。
        const searchResult: Array<PlayerItem> = resultVideo
            ? resultVideo.map((item: VideoTemporaryObj, index: number) => {
                  const result: PlayerItem = {
                      videoId: item.videoId,
                      title: item.title,
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
    if (loading) {
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
                    onKeyPress={fetchEvents} // キーボードイベント
                >
                    再読み込み
                </div>
            </div>
        );
    }

    return (
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
            {resultVideo ? (
                resultVideo.length !== 0 ? (
                    resultVideo.map(
                        (item: VideoTemporaryObj, index: number) => (
                            <>
                                {/* 各アイテムを表示 */}

                                <Thumbnail
                                    key={item.videoId}
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
                        ),
                    )
                ) : (
                    <>
                        <div>検索結果が0です。</div>
                    </>
                )
            ) : null}
        </Box>
    );
}
