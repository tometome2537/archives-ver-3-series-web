import { ApiDataProvider } from "@/contexts/ApiDataContext";
import { BrowserInfoProvider } from "@/contexts/BrowserInfoContext";
import { type ColorModeChoice, ThemeRegistry } from "@/contexts/ThemeContext";
import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { AppleMusicProvider } from "@/contexts/AppleMusicContext";

const inter = Inter({ subsets: ["latin"] });

// const title = "ミュージックアーカイブスプロジェクト";
const title = "ぷらそにかアーカイブス";
const description =
    "ぷらそにかアーカイブス - YouTubeチャンネル「ぷらそにか」の動画を詳細な検索機能、YouTubeの再生を提供します。";

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const preColorMode = (await cookies()).get("colorMode")?.value;
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
                {/* ↓ サーバーサイドで定義して返す必要がある。 */}
                <meta name="title" content={title} />
                <meta name="description" content={description} />
                {/* ↓ サイトのテーマに合わせてブラウザの設定を変更する */}
                <meta
                    name="theme-color"
                    content={initColorMode === "dark" ? "#000000" : "#FFFFFF"}
                />
                {process.env.NEXT_PUBLIC_STAGE !== "dev" && (
                    <>
                        {/* Googleサイトコンソール */}
                        <meta
                            name="google-site-verification"
                            content="0ERg8PZXOGMCKiCI-c-8BqDFTWZrUGbGI0SmzXBmiOo"
                        />
                        {/* Googleアナリティクス */}
                        <GoogleAnalytics gaId="G-EGPYKGH18H" />
                    </>
                )}
            </head>
            <body className={inter.className}>
                <ThemeRegistry initColorMode={initColorMode}>
                    <AppleMusicProvider>
                        <ApiDataProvider>
                            <BrowserInfoProvider>
                                {children}
                            </BrowserInfoProvider>
                        </ApiDataProvider>
                    </AppleMusicProvider>
                </ThemeRegistry>
            </body>
        </html>
    );
}

export async function generateMetadata(): Promise<Metadata> {
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
                    url: "/twitter_card.png",
                    width: 1600,
                    height: 900,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            site: "@MusicArchPJ",
            title: title,
            description: description,
            images: ["/twitter_card.png"],
        },
    };
}
