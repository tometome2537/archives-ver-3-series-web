// Reference: https://ilxanlar.medium.com/ellipsis-the-art-of-truncation-in-web-applications-8b141ce33774

import { Avatar, Button, Chip, Typography } from "@mui/material";
import Linkify from "linkify-react";
import { useLayoutEffect, useRef, useState } from "react";
import Link from "./Link";

type DescriptionProps = {
    text: string;
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
    const { text, maxLine } = props;

    const contentRef = useRef<HTMLDivElement>(null);
    const [isExpandable, setIsExpandable] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);

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
                    {text}
                </Linkify>
            </div>
            <Button onClick={toggle} variant="text">
                {isExpanded ? "一部を表示" : "...もっと見る"}
            </Button>
        </>
    );
}
