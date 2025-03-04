"use client";

import {
    Box,
    CardActionArea,
    CardContent,
    CardMedia,
    Typography,
} from "@mui/material";
import Card from "@mui/material/Card";
import Image from "next/image";
import type { MouseEventHandler } from "react";
import { useState } from "react";
import { formatDuration, timeAgo } from "../utils/dateUtils";
import NoteContent from "./NoteContent";
import YouTubePlayer from "./YouTubePlayerView";

export type ThumbnailType = "default" | "card" | "list";

export interface ThumbnailProps {
    videoId: string;
    thumbnailType?: ThumbnailType;
    isPlayingOnHover?: boolean;
    title?: string;
    viewCount?: number;
    channelTitle?: string;
    publishedAt?: Date;
    duration?: number;
    onClick?: MouseEventHandler<HTMLElement>;
}

/**
 * YouTube動画のサムネイルを表示するコンポーネント
 * thumbnailTypeに応じて3つの表示形式がある：
 * - default: 垂直レイアウト (サムネイル上、テキスト下)
 * - card: Material-UIカードスタイル
 * - list: 横並びレイアウト
 */
export default function Thumbnail({
    videoId,
    thumbnailType = "default",
    isPlayingOnHover = false,
    title,
    viewCount,
    channelTitle,
    publishedAt,
    duration,
    onClick,
}: ThumbnailProps) {
    const [raised, setRaised] = useState<boolean>(false);

    // サムネイル表示をタイプ別に分岐
    switch (thumbnailType) {
        case "card":
            return renderCardThumbnail();
        case "list":
            return renderListThumbnail();
        default:
            return renderDefaultThumbnail();
    }

    // Material-UI Cardスタイルのサムネイル
    function renderCardThumbnail() {
        return (
            <Box>
                <Card
                    sx={{ maxWidth: 480 }}
                    onMouseOver={() => setRaised(true)}
                    onMouseOut={() => setRaised(false)}
                    raised={raised}
                >
                    <CardActionArea onClick={onClick} data-videoid={videoId}>
                        <Box
                            sx={{
                                position: "relative",
                                width: "100%",
                                paddingTop: "56.25%",
                                overflow: "hidden",
                            }}
                        >
                            {raised && isPlayingOnHover ? (
                                <YouTubePlayer
                                    videoId={videoId}
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        transition: `transform ${100}ms`,
                                        transform: `scale(${raised ? 1.05 : 1})`,
                                        pointerEvents: "none", // iframe上のクリックを無効化
                                    }}
                                    width={320}
                                />
                            ) : (
                                <CardMedia
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        transition: `transform ${100}ms`,
                                        transform: `scale(${raised ? 1.05 : 1})`,
                                    }}
                                    component="img"
                                    width={480}
                                    height={360}
                                    image={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                                    alt={title ? `Thumbnail of ${title}` : ""}
                                />
                            )}
                        </Box>
                        <CardContent>
                            <Typography
                                gutterBottom
                                sx={{
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    display: "-webkit-box",
                                    height: "5ch",
                                    WebkitLineClamp: "2",
                                    WebkitBoxOrient: "vertical",
                                }}
                            >
                                <NoteContent content={title || ""} />
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Box>
        );
    }

    // リスト表示スタイルのサムネイル（横並び）
    function renderListThumbnail() {
        return (
            <Box
                onClick={onClick}
                data-videoid={videoId}
                sx={{ cursor: onClick ? "pointer" : "default" }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        borderRadius: "1.2em",
                        transition: "transform 0.3s ease-in-out",
                        transform: raised ? "scale(1.05)" : "scale(1)",
                    }}
                    onMouseEnter={() => setRaised(true)}
                    onMouseLeave={() => setRaised(false)}
                >
                    <Box sx={{ width: "30%" }}>
                        <Box sx={{ width: "100%", height: "auto" }}>
                            <Image
                                src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                                alt={
                                    title
                                        ? `Thumbnail of ${title}`
                                        : "Video Thumbnail"
                                }
                                width={320}
                                height={180}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "contain",
                                    borderRadius: "1em",
                                }}
                            />
                        </Box>
                    </Box>

                    <Box sx={{ width: duration === undefined ? "70%" : "60%" }}>
                        <Typography
                            variant="body2"
                            sx={{
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                                marginTop: 1,
                                marginLeft: 1,
                                textAlign: "center",
                            }}
                        >
                            {title || ""}
                            <br />
                            {channelTitle || ""}
                        </Typography>
                    </Box>

                    {duration && (
                        <Box sx={{ width: "10%" }}>
                            <Typography
                                sx={{
                                    whiteSpace: "nowrap",
                                    marginTop: 1.5,
                                }}
                            >
                                {formatDuration(duration)}
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Box>
        );
    }

    // デフォルトスタイルのサムネイル（垂直レイアウト）
    function renderDefaultThumbnail() {
        return (
            <Box
                onClick={onClick}
                data-videoid={videoId}
                sx={{ cursor: onClick ? "pointer" : "default" }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        alignItems: "center",
                        padding: 1,
                        borderRadius: "1.2em",
                        transition: "transform 0.3s ease-in-out",
                        transform: raised ? "scale(1.05)" : "scale(1)",
                    }}
                    onMouseEnter={() => setRaised(true)}
                    onMouseLeave={() => setRaised(false)}
                >
                    {raised && isPlayingOnHover ? (
                        <YouTubePlayer
                            videoId={videoId}
                            style={{
                                objectFit: "contain",
                                pointerEvents: "none", // iframe上のクリックを無効化
                            }}
                            width={320}
                        />
                    ) : (
                        <Box sx={{ width: "100%", height: "auto" }}>
                            <Image
                                src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                                alt={
                                    title
                                        ? `Thumbnail of ${title}`
                                        : "Video Thumbnail"
                                }
                                width={320}
                                height={180}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "contain",
                                    borderRadius: "1.2em",
                                }}
                            />
                        </Box>
                    )}

                    <Typography
                        variant="body2"
                        sx={{
                            maxWidth: "30ch",
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            marginTop: 1,
                            textAlign: "center",
                        }}
                    >
                        {title || ""}
                    </Typography>

                    <Typography
                        variant="caption"
                        color="textSecondary"
                        sx={{ marginTop: 0.5, textAlign: "center" }}
                    >
                        {channelTitle && channelTitle}
                        {viewCount && ` ・ ${String(viewCount)}回視聴`}
                        {publishedAt && ` ・ ${timeAgo(publishedAt)}`}
                    </Typography>
                </Box>
            </Box>
        );
    }
}
