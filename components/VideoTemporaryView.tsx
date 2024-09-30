import buildUrlWithQuery from "@/libs/buildUrl";
import { Box } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { EntityObj } from "./EntitySelector";
import Loading from "./Loading";
import type { PlayerItem } from "./PlayerView";
import Thumbnail from "./Thumbnail";

type VideoTemporaryObj = {
    videoId: string;
    channelId: string;
    channelTitle: string;
    title: string;
    publishedAt: string;
    privacyStatus: string;
    viewCount: string;
    short: string;
    live: string;
    categoryFromYTApi: string;
    category: string;
    tagText: string;
    person: string;
    organization: string;
};

type VideoViewTemporaryProps = {
    playerItem: PlayerItem;
    entityIds: Array<EntityObj>;
    setPlayerItem: Dispatch<SetStateAction<PlayerItem>>;
    setPlayerPlaylist: Dispatch<SetStateAction<Array<PlayerItem>>>;
    setPlayerSearchResult: Dispatch<SetStateAction<Array<PlayerItem>>>;
};

export default function VideoTemporaryView(props: VideoViewTemporaryProps) {
    const {
        playerItem,
        entityIds,
        setPlayerItem,
        setPlayerPlaylist,
        setPlayerSearchResult,
    } = props;
    // APIで取得したデータを格納
    const [apiDataVideo, setApiDataVideo] = useState<Array<VideoTemporaryObj>>(
        [],
    );
    // API通信中かどうか
    const [loading, setLoading] = useState(true);
    // API通信でエラーが出たかどうか
    const [error, setError] = useState<string | null>(null);

    // API通信を定義

    // APIを叩く(初回生成時は実行しない。entityID更新時のみ実行する。)
    const [isInitialRender, setIsInitialRender] = useState(true);
    // API通信を定義
    const fetchVideos = useCallback(async () => {
        try {
            setLoading(true); // ローディング状態を設定
            const channelId: string = "UCZx7esGXyW6JXn98byfKEIA"; // チャンネルID（必須）

            // 組織と人物を初期化
            let organization: string;
            organization = "";
            let person: string;
            person = "";

            for (const item of entityIds) {
                if (item.category === "organization") {
                    organization = item.id;
                } else if (item.category === "person") {
                    person = item.id;
                }
            }

            const url = buildUrlWithQuery(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/v0.0/temporaryvideo`,
                {
                    person: person,
                    channelId: channelId,
                    organization: organization,
                },
            );

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(
                    `Network response was not ok: ${response.statusText}`,
                ); // エラーメッセージを詳細化
            }

            const data = await response.json();
            setApiDataVideo(data.result); // 取得したデータを設定
        } catch (err) {
            setError((err as Error).message); // エラーを表示
        } finally {
            setLoading(false); // ローディングを解除
        }
    }, [entityIds]); // entityIdを依存関係に追加

    // APIを叩く（初回生成時は実行しない。entityID更新時のみ実行する。）
    useEffect(() => {
        if (isInitialRender) {
            setIsInitialRender(false);
        } else {
            fetchVideos(); // fetchVideosを呼び出す
        }
    }, [fetchVideos, isInitialRender]); // fetchVideosとisInitialRenderを依存関係に追加

    // 動画サムネイルがクリックされたときに呼ばれる関数
    const handleVideoClick = (event: React.MouseEvent<HTMLElement>) => {
        const videoId = event.currentTarget.getAttribute("data-videoId");
        setPlayerItem({
            videoId: videoId ? videoId : "",
        });
        // APIから受け取った値の型を変換する。
        const searchResult: Array<PlayerItem> = apiDataVideo.map(
            (item: VideoTemporaryObj, index: number) => {
                const result: PlayerItem = {
                    videoId: item.videoId,
                    title: item.title,
                    viewCount: Number(item.viewCount),
                    channelId: item.channelId,
                    channelTitle: item.channelTitle,
                    publishedAt: item.publishedAt
                        ? new Date(item.publishedAt)
                        : undefined,
                    actorId: item.person.split(/ , |,| ,|, /).filter((v) => v),
                    organization: Object.keys(JSON.parse(item.organization)),
                };
                return result;
            },
        );
        setPlayerSearchResult(searchResult);
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
                    onClick={fetchVideos} // クリックイベント
                    onKeyPress={fetchVideos} // キーボードイベント
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
            {apiDataVideo.length !== 0 ? (
                apiDataVideo.map((item: VideoTemporaryObj, index: number) => (
                    <>
                        {/* 各アイテムを表示 */}

                        <Thumbnail
                            key={item.videoId}
                            isPlayingOnHover={
                                playerItem.videoId === "" ||
                                playerItem.videoId === undefined
                            }
                            videoId={item.videoId}
                            title={item.title}
                            viewCount={Number(item.viewCount)}
                            channelTitle={item.channelTitle}
                            publishedAt={new Date(item.publishedAt)}
                            onClick={handleVideoClick}
                        />
                    </>
                ))
            ) : (
                <>
                    <div>検索結果が0です。</div>
                </>
            )}
        </Box>
    );
}
