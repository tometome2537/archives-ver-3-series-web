// Reference: https://ilxanlar.medium.com/ellipsis-the-art-of-truncation-in-web-applications-8b141ce33774

import { Avatar, Box, Chip, Typography } from "@mui/material";
import { blue } from "@mui/material/colors";
import { useTheme } from "@mui/material/styles";
import Linkify from "linkify-react";
import { useLayoutEffect, useRef, useState } from "react";
import Link from "./Link";
import "linkify-plugin-hashtag";
import "linkify-plugin-mention";
import { useApiDataContext } from "@/contexts/ApiDataContext";

type DescriptionProps = {
    text: string;
    date?: Date;
    maxLine: number;
};

// 1行の高さ
const LINE_TO_PIXEL = 32;

const getLogoPath = (hostname: string) => {
    switch (hostname) {
        case "twitter.com":
        case "x.com":
            return "/x_logo.png";
        case "instagram.com":
        case "www.instagram.com":
            return "/ig_logo.png";
        case "tiktok.com":
        case "www.tiktok.com":
            return "/tiktok_logo.png";
        case "youtube.com":
        case "www.youtube.com":
            return "/yt_logo.png";
        default:
            return "";
    }
};

export default function Description(props: DescriptionProps) {
    const apiData = useApiDataContext();

    const linkifyOptions = {
        render: {
            url: ({
                attributes,
                content,
            }: {
                attributes: { [attr: string]: React.ReactNode };
                content: string;
            }) => {
                const url = new URL(content);
                const pathSegments = url.pathname
                    .split("/")
                    .filter((segment) => segment);
                const userId = pathSegments[0]
                    ? pathSegments[0].replace("@", "")
                    : content;

                const fetchVideo = async (videoId: string) => {
                    const r = await apiData.YdbVideo.getDataWithParams({
                        videoIds: videoId,
                    });
                    console.log(r);
                    return r?.videos[0].youTubeApi.snippet.title;
                };

                // 動画につながるリンクの場合
                if (
                    url.hostname === "youtu.be" ||
                    ((url.hostname === "youtube.com" ||
                        url.hostname === "www.youtube.com") &&
                        pathSegments[0] === "watch")
                ) {
                    const videoId =
                        url.hostname === "youtu.be"
                            ? pathSegments[0]
                            : (url.searchParams.get("v") ?? "");

                    const [label, setLabel] = useState<string>(content);
                    fetchVideo(videoId).then((r) => {
                        if (r === undefined) return;
                        setLabel(r);
                    });

                    return (
                        <Link {...attributes}>
                            <Chip
                                size="small"
                                avatar={<Avatar src={"/yt_logo.png"} />}
                                // label={(await fetchVideo(videoId)) ?? content}
                                label={label}
                            />
                        </Link>
                    );
                }

                const avatarSrc = getLogoPath(url.hostname);

                if (avatarSrc !== "") {
                    return (
                        <Link {...attributes}>
                            <Chip
                                size="small"
                                avatar={<Avatar src={avatarSrc} />}
                                label={userId}
                            />
                        </Link>
                    );
                }

                return <Link {...attributes}>{content}</Link>;
            },
            hashtag: ({
                attributes,
                content,
            }: {
                attributes: { [attr: string]: React.ReactNode };
                content: string;
            }) => {
                try {
                    return (
                        <Link
                            style={{ color: blue[400] }}
                            underline="none"
                            {...attributes}
                        >
                            {content}
                        </Link>
                    );
                } catch {
                    return <Link {...attributes}>{content}</Link>;
                }
            },
            mention: ({
                attributes,
                content,
            }: {
                attributes: { [attr: string]: React.ReactNode };
                content: string;
            }) => {
                return (
                    <Link
                        style={{ color: blue[400] }}
                        underline="none"
                        {...attributes}
                    >
                        {content}
                    </Link>
                );
            },
        },
        formatHref: {
            hashtag: (href: string) =>
                `https://www.youtube.com/hashtag/${href.substring(1)}`,
            mention: (href: string) =>
                `https://www.youtube.com/@${href.substring(1)}`,
        },
    };

    // テーマ設定を取得
    const theme = useTheme();

    const { text, maxLine } = props;

    const contentRef = useRef<HTMLDivElement>(null);
    const [isExpandable, setIsExpandable] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);

    const date = props.date
        ? `${props.date.toLocaleDateString("ja-JP", {
              year: "numeric", // 年
              month: "long", // 月（長い形式）
              day: "numeric", // 日
              // hour: "2-digit", // 時（2桁形式）
              // minute: "2-digit", // 分（2桁形式）
              // second: "2-digit", // 秒（2桁形式）
              hour12: false, // 24時間形式
          })} に公開済み`
        : null;

    // useLayoutEffect(() => {
    //     if (contentRef.current) {
    //         const contentHeight =
    //             contentRef.current.getBoundingClientRect().height;
    //         console.log(
    //             "a",
    //             contentHeight,
    //             contentRef.current.getBoundingClientRect(),
    //         );
    //         console.log("b", maxLine * LINE_TO_PIXEL);
    //         setIsExpandable(contentHeight > maxLine * LINE_TO_PIXEL);
    //     }
    // }, [maxLine]);

    const toggle = () => setIsExpanded((prev) => !prev);

    return (
        <Box
            style={{
                // 文字列内の\nを適切に反映させる。
                whiteSpace: "pre-line",
                backgroundColor: theme.palette.background.default,
                margin: "0 10px",
                borderRadius: "1em",
                cursor: isExpanded ? "default" : "pointer",
            }}
            onClick={() => {
                if (isExpanded === false) {
                    toggle();
                }
            }}
        >
            <Linkify
                as="p"
                options={{
                    ...linkifyOptions,
                    target: "_blank",
                }}
                style={{
                    height: isExpanded ? "auto" : maxLine * LINE_TO_PIXEL,
                    overflow: "hidden",
                }}
                ref={contentRef}
            >
                {`${date}\n${text}`}
            </Linkify>
            <Typography
                onClick={() => {
                    if (isExpanded) {
                        toggle();
                    }
                }}
                style={{ cursor: "pointer" }}
            >
                {isExpanded ? "一部を表示" : "...もっと見る"}
            </Typography>
        </Box>
    );
}
