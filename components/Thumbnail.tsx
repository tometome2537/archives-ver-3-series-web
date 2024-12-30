"use client";

import {
    Box,
    CardActionArea,
    CardContent,
    CardMedia,
    Link,
    Typography,
} from "@mui/material";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Unstable_Grid2";
import Image from "next/image";
import type { MouseEventHandler } from "react";
import { useEffect, useState } from "react";
import YouTubePlayer from "./YouTubePlayerView";

export interface NoteContentProps {
    content: string;
}
// テキスト中の #で始まる文章をリンクにする関数
const NoteContent: React.FC<NoteContentProps> = ({ content }) => {
    function findHashtags(searchText: string): [string[], string[]] {
        const regexp = /#[^#\s]*/g;
        const hashtags = searchText.match(regexp) || [];
        const result = searchText.split(regexp);
        if (result.length > 0 && result[result.length - 1] === "") {
            result.pop();
        }
        return [result, hashtags];
    }

    const [results, hashtags] = findHashtags(content);

    const hashtagLinks = hashtags.map((x, index) => (
        <Link
            href="#"
            key={x}
            color="primary"
            sx={{ display: "inline", paddingRight: 1 }}
        >
            {x}
        </Link>
    ));

    if (results === null && hashtagLinks === null) {
        return <span>{content}</span>;
    }

    if (results === null) {
        return <span>{hashtagLinks}</span>;
    }

    if (hashtagLinks === null) {
        return <span> {content}</span>;
    }

    const merged: React.ReactNode[] = [];
    const maxLength = Math.max(results.length, hashtagLinks.length);

    for (let i = 0; i < maxLength; i++) {
        if (i < results.length) {
            if (results[i] != null && results[i].trim() !== "") {
                merged.push(results[i]);
            }
        }
        if (i < hashtagLinks.length) {
            merged.push(hashtagLinks[i]);
        }
    }

    return <span>{merged}</span>;
};
// 何日前に投稿されたのか
function timeAgo(publishedAt: Date): string {
    const now: Date = new Date();
    const elapsed: number = now.getTime() - publishedAt.getTime(); // 経過時間をミリ秒で取得

    const seconds: number = Math.floor(elapsed / 1000); // 秒に変換
    const minutes: number = Math.floor(seconds / 60); // 分に変換
    const hours: number = Math.floor(minutes / 60); // 時間に変換
    const days: number = Math.floor(hours / 24); // 日に変換
    const weeks: number = Math.floor(days / 7); // 週に変換
    const months: number = Math.floor(days / 30); // 月に変換
    const years: number = Math.floor(days / 365); // 年に変換

    if (years > 0) {
        return `${years}年前`; // 年の場合
    }
    if (months > 0) {
        return `${months}ヶ月前`; // 月の場合
    }
    if (weeks > 0) {
        return `${weeks}週間前`; // 週の場合
    }
    if (days > 0) {
        return `${days}日前`; // 日の場合
    }
    if (hours > 0) {
        return `${hours}時間前`; // 時間の場合
    }
    if (minutes > 0) {
        return `${minutes}分前`; // 分の場合
    }

    return "たった今"; // 秒の場合
}

type ThumbnailProps = {
    thumbnailType?: string | undefined;
    // マウスポインターを置いたときにサムネイル上で再生するかどうか。
    isPlayingOnHover?: boolean;
    videoId: string;
    title?: string;
    viewCount?: number;
    channelTitle?: string;
    publishedAt?: Date;
    duration?: number;
    // onClick?: MouseEventHandler<HTMLButtonElement>;
    onClick?: MouseEventHandler<HTMLElement>;
};

export default function Thumbnail(props: ThumbnailProps) {
    // サムネイルの上にマウスポインターがあるかどうか。
    const [raised, setRaised] = useState<boolean>();

    if (props.thumbnailType === "card") {
        return (
            <Grid xs={12} sm={6} md={3}>
                <Card
                    sx={{ maxWidth: 480 }}
                    onMouseOver={() => setRaised(true)}
                    onMouseOut={() => setRaised(false)}
                    raised={raised}
                >
                    <CardActionArea
                        onClick={props.onClick}
                        data-videoId={props.videoId}
                    >
                        <Box
                            sx={{
                                position: "relative",
                                width: "100%",
                                paddingTop: "56.25%",
                                overflow: "hidden",
                            }}
                        >
                            {/* https://stackoverflow.com/questions/77707474/responsive-image-sizing-in-react-with-material-ui-how-to-dynamically-adapt-imag */}
                            {raised && props.isPlayingOnHover ? (
                                <YouTubePlayer
                                    videoId={props.videoId}
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        transition: `transform ${100}ms`,
                                        transform: `scale(${raised ? 1.05 : 1})`,
                                        // iframe上のクリックを無効にする。 → 親要素のonClickが実行される。
                                        pointerEvents: "none",
                                    }}
                                    // 動画の比率は、横：縦 = １６：９で
                                    width={"320px"}
                                    height={"180px"}
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
                                    image={`https://img.youtube.com/vi/${props.videoId}/hqdefault.jpg`}
                                    alt={
                                        props.title
                                            ? `Thumbnail of ${props.title}`
                                            : ""
                                    }
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
                                <NoteContent
                                    content={props.title ? props.title : ""}
                                />
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
        );
    }

    if (props.thumbnailType === "list") {
        return (
            <Box
                onClick={props.onClick ? props.onClick : undefined}
                data-videoId={props.videoId}
                sx={{
                    cursor: props.onClick ? "pointer" : "default",
                }} // クリック可能かどうかでカーソルを変更
            >
                {/* サムネイルとタイトルを中央揃え */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        // alignItems: "center",
                        borderRadius: "1.2em",
                        transition: "transform 0.3s ease-in-out",
                        transform: raised ? "scale(1.05)" : "scale(1)", // ホバー時の拡大効果
                    }}
                    onMouseEnter={() => setRaised(true)}
                    onMouseLeave={() => setRaised(false)}
                >
                    <Box sx={{ width: "30%" }}>
                        <Box
                            sx={{
                                width: "100%",
                                height: "auto",
                            }}
                        >
                            <Image
                                src={`https://img.youtube.com/vi/${props.videoId}/mqdefault.jpg`}
                                alt={
                                    props.title
                                        ? `Thumbnail of ${props.title}`
                                        : "Video Thumbnail"
                                }
                                width={320} // アスペクト比のための幅
                                height={180} // アスペクト比のための高さ
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "contain",
                                    borderRadius: "1.2em",
                                }}
                            />
                        </Box>
                    </Box>

                    {/* タイトルをエリプシスで省略 */}
                    <Box sx={{ width: "60%" }}>
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
                            {props.title || ""}
                            <br />
                            {props.channelTitle || ""}
                        </Typography>
                    </Box>
                    <Box sx={{ width: "10%" }}>
                        <Typography
                            sx={{
                                whiteSpace: "nowrap", // 改行しない
                                marginTop: 1.5,
                            }}
                        >
                            {props.duration
                                ? `${Math.floor(props.duration / 60)}:${String(props.duration % 60).padStart(2, "0")}`
                                : ""}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        );
    }

    return (
        <Box
            onClick={props.onClick ? props.onClick : undefined}
            data-videoId={props.videoId}
            sx={{ cursor: props.onClick ? "pointer" : "default" }} // クリック可能かどうかでカーソルを変更
        >
            {/* サムネイルとタイトルを中央揃え */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    alignItems: "center",
                    padding: 1,
                    borderRadius: "1.2em",
                    transition: "transform 0.3s ease-in-out",
                    transform: raised ? "scale(1.05)" : "scale(1)", // ホバー時の拡大効果
                }}
                onMouseEnter={() => setRaised(true)}
                onMouseLeave={() => setRaised(false)}
            >
                {/* YouTubeサムネイル画像 */}
                {raised && props.isPlayingOnHover ? (
                    <YouTubePlayer
                        videoId={props.videoId}
                        style={{
                            objectFit: "contain",
                            // iframe上のクリックを無効にする。 → 親要素のonClickが実行される。
                            pointerEvents: "none",
                        }}
                        // 動画の比率は、横：縦 = １６：９で
                        width={"320px"}
                        height={"180px"}
                    />
                ) : (
                    <Box
                        sx={{
                            width: "100%",
                            height: "auto",
                        }}
                    >
                        <Image
                            src={`https://img.youtube.com/vi/${props.videoId}/mqdefault.jpg`}
                            alt={
                                props.title
                                    ? `Thumbnail of ${props.title}`
                                    : "Video Thumbnail"
                            }
                            width={320} // アスペクト比のための幅
                            height={180} // アスペクト比のための高さ
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                                borderRadius: "1.2em",
                            }}
                        />
                    </Box>
                )}

                {/* タイトルをエリプシスで省略 */}
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
                    {props.title || ""}
                </Typography>

                {/* チャンネル名・再生回数・投稿日を表示 */}
                <Typography
                    variant="caption"
                    color="textSecondary"
                    sx={{ marginTop: 0.5, textAlign: "center" }}
                >
                    {props.channelTitle && props.channelTitle}
                    {props.viewCount && ` ・ ${String(props.viewCount)}回視聴`}
                    {props.publishedAt && ` ・ ${timeAgo(props.publishedAt)}`}
                </Typography>
            </Box>
        </Box>
    );
}
