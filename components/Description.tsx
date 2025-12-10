import { Avatar, Box, Chip, Typography } from "@mui/material";
import { blue } from "@mui/material/colors";
import { useTheme } from "@mui/material/styles";
import Linkify from "linkify-react";
import { useRef, useState, useEffect } from "react";
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

const getLogoPath = (hostname: string): string => {
    const logoMap: Record<string, string> = {
        "twitter.com": "/x_logo.png",
        "x.com": "/x_logo.png",
        "instagram.com": "/ig_logo.png",
        "www.instagram.com": "/ig_logo.png",
        "tiktok.com": "/tiktok_logo.png",
        "www.tiktok.com": "/tiktok_logo.png",
        "youtube.com": "/yt_logo.png",
        "www.youtube.com": "/yt_logo.png",
    };

    return logoMap[hostname] || "";
};

// YouTube動画タイトルフェッチ用フック
const useYouTubeVideoTitle = (videoId: string) => {
    const apiData = useApiDataContext();
    const [label, setLabel] = useState<string>("");

    const fetchVideo = async () => {
        // try {
        //     const response = await apiData.YdbVideo.getDataWithParams({
        //         videoids: videoId,
        //     });
        //     const title = response?.videos[0]?.videoYouTubeApi?.snippet.title;
        //     if (title) setLabel(title);
        // } catch (error) {
        //     console.error("Error fetching video title:", error);
        // }
    };

    // コンポーネントマウント時にフェッチを実行
    useState(() => {
        fetchVideo();
    });

    return { label };
};

// リンク描画用コンポーネント
const LinkRenderer = ({
    attributes,
    content,
}: {
    attributes: { [attr: string]: React.ReactNode };
    content: string;
}) => {
    const apiData = useApiDataContext();
    const [label, setLabel] = useState<string>(content);

    let videoId = "";
    let isYouTubeLink = false;

    try {
        const url = new URL(content);
        const pathSegments = url.pathname
            .split("/")
            .filter((segment) => segment);
        const userId = pathSegments[0]
            ? pathSegments[0].replace("@", "")
            : content;

        // YouTube動画リンク処理
        if (
            url.hostname === "youtu.be" ||
            (/youtube.com/i.test(url.hostname) && pathSegments[0] === "watch")
        ) {
            isYouTubeLink = true;
            videoId =
                url.hostname === "youtu.be"
                    ? pathSegments[0]
                    : (url.searchParams.get("v") ?? "");
        }

        // その他のソーシャルメディアリンク処理
        const avatarSrc = getLogoPath(url.hostname);
        if (avatarSrc && !isYouTubeLink) {
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

        // YouTube リンク処理
        if (isYouTubeLink) {
            return (
                <Link {...attributes}>
                    <Chip
                        size="small"
                        avatar={<Avatar src="/yt_logo.png" />}
                        label={label || content}
                    />
                </Link>
            );
        }

        // 一般的なリンク
        return <Link {...attributes}>{content}</Link>;
    } catch {
        return <Link {...attributes}>{content}</Link>;
    }
};

// ハッシュタグ描画コンポーネント
const HashtagRenderer = ({
    attributes,
    content,
}: {
    attributes: { [attr: string]: React.ReactNode };
    content: string;
}) => (
    <Link style={{ color: blue[400] }} underline="none" {...attributes}>
        {content}
    </Link>
);

// メンション描画コンポーネント
const MentionRenderer = ({
    attributes,
    content,
}: {
    attributes: { [attr: string]: React.ReactNode };
    content: string;
}) => (
    <Link style={{ color: blue[400] }} underline="none" {...attributes}>
        {content}
    </Link>
);

export default function Description(props: DescriptionProps) {
    const { text, maxLine, date } = props;

    const theme = useTheme();
    const contentRef = useRef<HTMLDivElement>(null);
    const [isExpanded, setIsExpanded] = useState(false);

    const formattedDate = date
        ? `${date.toLocaleDateString("ja-JP", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour12: false,
          })} に公開済み`
        : null;

    const linkifyOptions = {
        render: {
            url: LinkRenderer,
            hashtag: HashtagRenderer,
            mention: MentionRenderer,
        },
        formatHref: {
            hashtag: (href: string) =>
                `https://www.youtube.com/hashtag/${href.substring(1)}`,
            mention: (href: string) =>
                `https://www.youtube.com/@${href.substring(1)}`,
        },
    };

    const toggle = () => setIsExpanded((prev) => !prev);

    return (
        <Box
            style={{
                whiteSpace: "pre-line",
                backgroundColor: theme.palette.background.default,
                margin: "0 10px",
                borderRadius: "1em",
                cursor: isExpanded ? "default" : "pointer",
            }}
            onClick={() => !isExpanded && toggle()}
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
                {formattedDate ? `${formattedDate}\n${text}` : text}
            </Linkify>
            <Typography
                onClick={() => isExpanded && toggle()}
                style={{ cursor: "pointer" }}
            >
                {isExpanded ? "一部を表示" : "...もっと見る"}
            </Typography>
        </Box>
    );
}
