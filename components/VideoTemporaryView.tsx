import buildUrlWithQuery from "@/libs/buildUrl";
import fetcher from "@/libs/fetcher";
import { unescapeHtml } from "@/libs/unescapeHtml";
import { Button, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import {
    MouseEvent,
    MouseEventHandler,
    useEffect,
    useRef,
    useState,
} from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import YouTube, { YouTubeProps } from "react-youtube";
import useSWRInfinite from "swr/infinite";
import Loading from "./Loading";
import Thumbnail from "./Thumbnail";
import { EntityObj } from "./EntitySelector";
import React, { Dispatch, SetStateAction } from "react";
import { PlayerItem } from "./PlayerView";

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
    entityId: Array<EntityObj>;
    setPlayerItem: Dispatch<SetStateAction<PlayerItem>>;
    setPlayerPlaylist: Dispatch<SetStateAction<Array<PlayerItem>>>;
    setPlayerSearchResult: Dispatch<SetStateAction<Array<PlayerItem>>>;
};

export default function VideoTemporaryView(props: VideoViewTemporaryProps) {
    // APIで取得したデータを格納
    const [apiDataVideo, setApiDataVideo] = useState<Array<VideoTemporaryObj>>([]);
    // API通信中かどうか
    const [loading, setLoading] = useState(true);
    // API通信でエラーが出たかどうか
    const [error, setError] = useState<string | null>(null);

    // API通信を定義
    const fetchVideos = async () => {
        try {
            setLoading(true);
            // 動画検索パラメータ
            //　channel ID (必須)
            const channelId: string = "UCZx7esGXyW6JXn98byfKEIA";
            // 組織 (必須)
            let organization: string = "";
            // 人物 (必須)
            let person: string = "";

            for (const item of props.entityId) {
                if (item["category"] === "organization") {
                    organization = item["id"];
                } else if (item["category"] === "person") {
                    person = item["id"];
                }
            }

            const url = buildUrlWithQuery(
                process.env.NEXT_PUBLIC_BASE_URL + "/api/v0.0/temporaryvideo",
                {
                    person: person,
                    channelId: channelId,
                    organization: organization,
                }
            );
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            setApiDataVideo(data["result"]);
        } catch (err) {
            setError((err as Error).message); // 'err' を Error 型として扱う
        } finally {
            setLoading(false);
        }
    };

    // APIを叩く(初回生成時は実行しない。entityID更新時のみ実行する。)
    const [isInitialRender, setIsInitialRender] = useState(true);
    useEffect(() => {
        if (isInitialRender) {
            setIsInitialRender(false);
        } else {
            fetchVideos();
        }
    }, [props.entityId]);

    // 動画サムネイルがクリックされたときに呼ばれる関数
    const handleVideoClick = (event: React.MouseEvent<HTMLElement>) => {
        const videoId = event.currentTarget.getAttribute("data-videoId");
        props.setPlayerItem({
            videoId: videoId ? videoId : ""
        });
        // APIから受け取った値の型を変換する。
        const searchResult: Array<PlayerItem> = apiDataVideo.map((item: VideoTemporaryObj, index: number) => {
            let result: PlayerItem = {
                videoId: item.videoId,
                title: item.title,
                viewCount: Number(item.viewCount),
                channelId: item.channelId,
                channelTitle: item.channelTitle,
                publishedAt: item.publishedAt ? new Date(item.publishedAt) : undefined,
                actorId: item.person.split(/ , |,| ,|, /).filter(v => v),
                organization: Object.keys(JSON.parse(item.organization))
            };
            return result;
        });
        props.setPlayerSearchResult(searchResult);
    };

    // ローディング中
    if (loading) {
        // return <div>VideoViewTemporary Loading...</div>;
        return (
            <div style={{
                paddingTop: "30vh"
            }}>
                <Loading />
            </div>
        );
    }
    // エラーの場合
    if (error) {
        return <div>VideoViewTemporary Error: {error}
            <div onClick={fetchVideos}>再読み込み</div>
        </div>;
    }

    return (
        <div
            style={{
                display: "flex",
                padding: "0 auto",
                justifyContent: "center", // 中央に配置
                alignItems: "center", // 縦方向にも中央に配置
                flexWrap: "wrap", // ラップさせて複数行に
                gap: "10px" // アイテム間のスペースを追加
            }}
        >
            {apiDataVideo.length !== 0 ? (
                apiDataVideo.map((item: VideoTemporaryObj, index: number) => (
                    <>
                        {/* 各アイテムを表示 */}
                        {
                            // <div
                            //     style={{
                            //         padding: "10px",
                            //     }}
                            // >
                            <Thumbnail
                                key={index}
                                isPlayingOnHover={props.playerItem.videoId === "" || props.playerItem.videoId === undefined ? true : false}
                                videoId={item.videoId}
                                title={item.title}
                                viewCount={Number(item.viewCount)}
                                channelTitle={item.channelTitle}
                                publishedAt={new Date(item.publishedAt)}
                                onClick={handleVideoClick}
                            />
                            // </div>
                        }
                    </>
                ))
            ) : (
                <><div>検索結果が0です。</div></>
            )}
        </div>
    );
}
