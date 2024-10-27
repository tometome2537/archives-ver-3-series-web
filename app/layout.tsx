import { type ColorModeChoice, ThemeRegistry } from "@/contexts/ThemeContext";
import { DataProvider } from "@/contexts/ApiDataContext";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
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
            </head>
            <body className={inter.className}>
                <ThemeRegistry initColorMode={initColorMode}>
                    <DataProvider>{children}</DataProvider>
                </ThemeRegistry>
            </body>
        </html>
    );
}

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "ミュージックアーカイブスプロジェクト",
    };
}
