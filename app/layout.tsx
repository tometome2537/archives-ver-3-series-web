import { type ColorModeChoice, ThemeRegistry } from "@/contexts/ThemeContext";
import { ApiDataProvider } from "@/contexts/ApiDataContext";
import { BrowserInfoProvider } from "@/contexts/BrowserInfoContext";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { GoogleAnalytics } from "@next/third-parties/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const preColorMode = cookies().get("colorMode")?.value;
    const initColorMode: ColorModeChoice =
        preColorMode === "light" || preColorMode === "dark"
            ? preColorMode
            : "device";

    return (
        <html lang="ja">
            <head>
                <link rel="icon" href="/favicon.ico" sizes="any" />
                <meta
                    name="viewport"
                    content="initial-scale=1, width=device-width"
                />
                <meta charSet="UTF-8" />
                {/* ↓ サイトのテーマに合わせてブラウザの設定を変更する */}
                <meta
                    name="theme-color"
                    content={initColorMode === "dark" ? "#000000" : "#FFFFFF"}
                />
                {/* Googleサイトコンソール */}
                <meta
                    name="google-site-verification"
                    content="0ERg8PZXOGMCKiCI-c-8BqDFTWZrUGbGI0SmzXBmiOo"
                />
                {/* Googleアナリティクス */}
                <GoogleAnalytics gaId="G-EGPYKGH18H" />
            </head>
            <body className={inter.className}>
                <ThemeRegistry initColorMode={initColorMode}>
                    <ApiDataProvider>
                        <BrowserInfoProvider>{children}</BrowserInfoProvider>
                    </ApiDataProvider>
                </ThemeRegistry>
            </body>
        </html>
    );
}

export async function generateMetadata(): Promise<Metadata> {
    // const title = "ミュージックアーカイブスプロジェクト";
    const title = "ぷらそにかアーカイブス";
    const description =
        "ぷらそにかアーカイブス - YouTubeチャンネル「ぷらそにか」の動画を詳細な検索機能、YouTubeの再生を提供します。";

    return {
        title: title,
        description: description,
        icons: {
            icon: "/favicon.ico",
            apple: "/apple-touch-icon.png",
        },
        openGraph: {
            title: title,
            description: description,
            url: "music-archives-project.vercel.app",
            siteName: title,
            type: "website",
            images: [
                {
                    url: "/banner1.PNG",
                    width: 800,
                    height: 600,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            site: "@MusicArchPJ",
            title: title,
            description: description,
            images: ["/banner1.PNG"],
        },
    };
}
