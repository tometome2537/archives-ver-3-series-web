// Reference: https://ilxanlar.medium.com/ellipsis-the-art-of-truncation-in-web-applications-8b141ce33774

import { Avatar, Button, Chip, Typography } from "@mui/material";
import Linkify from "linkify-react";
import { useLayoutEffect, useRef, useState } from "react";
import Link from "./Link";
import { blue } from "@mui/material/colors";
import { useTheme } from "@mui/material/styles";

type DescriptionProps = {
    text: string;
    date?: Date;
    maxLine: number;
};

// 1行の高さ
const LINE_TO_PIXEL = 32;

const linkifyOptions = {
    render: {
        url: ({
            attributes,
            content,
        }: {
            attributes: { [attr: string]: React.ReactNode };
            content: string;
        }) => {
            try {
                const url = new URL(content);
                const pathSegments = url.pathname
                    .split("/")
                    .filter((segment) => segment);
                const userId = pathSegments[0]
                    ? pathSegments[0].replace("@", "")
                    : content;

                if (
                    url.hostname === "twitter.com" ||
                    url.hostname === "x.com"
                ) {
                    return (
                        <Link {...attributes}>
                            <Chip
                                size="small"
                                avatar={<Avatar src="/x_logo.png" />}
                                label={userId}
                            />
                        </Link>
                    );
                }

                if (
                    url.hostname === "instagram.com" ||
                    url.hostname === "www.instagram.com"
                ) {
                    return (
                        <Link {...attributes}>
                            <Chip
                                size="small"
                                avatar={<Avatar src="/ig_logo.png" />}
                                label={userId}
                            />
                        </Link>
                    );
                }

                if (
                    url.hostname === "tiktok.com" ||
                    url.hostname === "www.tiktok.com"
                ) {
                    return (
                        <Link {...attributes}>
                            <Chip
                                size="small"
                                avatar={<Avatar src="/tiktok_logo.png" />}
                                label={userId}
                            />
                        </Link>
                    );
                }

                if (
                    url.hostname === "youtube.com" ||
                    url.hostname === "www.youtube.com"
                ) {
                    return (
                        <Link {...attributes}>
                            <Chip
                                size="small"
                                avatar={<Avatar src="/yt_logo.png" />}
                                label={userId}
                            />
                        </Link>
                    );
                }

                return <Link {...attributes}>{content}</Link>;
            } catch (error) {
                return <Link {...attributes}>{content}</Link>;
            }
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
    },
    formatHref: {
        hashtag: (href: string) =>
            `https://www.youtube.com/hashtag/${href.substring(1)}`,
    },
};

export default function Description(props: DescriptionProps) {
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

    useLayoutEffect(() => {
        if (contentRef.current) {
            const contentHeight =
                contentRef.current.getBoundingClientRect().height;
            // テキストの行の高さは24pxだから
            setIsExpandable(contentHeight > maxLine * LINE_TO_PIXEL);
        }
    }, [maxLine]);

    const toggle = () => setIsExpanded((prev) => !prev);

    return (
        <>
            <div
                style={{
                    overflow: "hidden",
                    height:
                        isExpanded || isExpandable === false
                            ? "auto"
                            : maxLine * LINE_TO_PIXEL,
                    // 文字列内の\nを適切に反映させる。
                    whiteSpace: "pre-line",
                    backgroundColor: theme.palette.background.default,
                    margin: "0 10px",
                    borderRadius: "1em",
                }}
            >
                <Linkify
                    as="p"
                    options={{
                        ...linkifyOptions,
                        target: "_blank",
                    }}
                    ref={contentRef}
                >
                    {`${date}\n${text}`}
                </Linkify>
            </div>
            <Button onClick={toggle} variant="text">
                {isExpanded ? "一部を表示" : "...もっと見る"}
            </Button>
        </>
    );
}
