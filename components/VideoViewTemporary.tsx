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
import { PlayerItem } from "./Player";

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
    entityId: Array<EntityObj>;
    setPlayerItem: Dispatch<SetStateAction<PlayerItem>>;
};

export default function VideoViewTemporary({
    entityId,
    setPlayerItem
}: VideoViewTemporaryProps) {
    // APIで取得したデータを格納
    const [apiData, setApiData] = useState<Array<VideoTemporaryObj>>([]);
    // API通信中かどうか
    const [loading, setLoading] = useState(true);
    // API通信でエラーが出たかどうか
    const [error, setError] = useState<string | null>(null);

    // APIを叩く
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                // 動画検索パラメータ
                //　channel ID (必須)
                const channelId: string = "UCZx7esGXyW6JXn98byfKEIA";
                // 組織 (必須)
                let organization: string = "";
                // 人物 (必須)
                let person: string = "";

                for (const item of entityId) {
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
                setApiData(data["result"]);
            } catch (err) {
                setError((err as Error).message); // 'err' を Error 型として扱う
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [entityId]);

    // 動画サムネイルがクリックされたときに呼ばれる関数
    const handleVideoClick = (event: React.MouseEvent<HTMLElement>) => {
        const videoId = event.currentTarget.getAttribute("data-videoId")
        setPlayerItem({ videoId: videoId ? videoId : "" })
        // 新しいタブでYouTubeの動画を開く
        // window.open(`https://youtube.com/watch?v=${event.currentTarget.dataset.id}`);
    }

    // ローディング中
    if (loading) {
        // return <div>VideoViewTemporary Loding...</div>;
        return <Loading />;
    }
    // エラーの場合
    if (error) {
        return <div>VideoViewTemporary Error: {error}</div>;
    }

    return (
        <div style={{
            width: "10px",
            display: "flex",
            flexWrap: "wrap"
        }}>
            {apiData
                ? apiData.map((item: VideoTemporaryObj, index: number) => (
                    <>
                        {/* 各アイテムを表示 */}
                        {
                            <Thumbnail
                                key={index}
                                videoId={item.videoId}
                                title={item.title}
                                onClick={handleVideoClick}
                            />
                        }
                    </>
                ))
                : null}
        </div>
    );
}
