"use client";

import { useBrowserInfoContext } from "@/contexts/BrowserInfoContext";
import rgbToHex from "@/libs/colorConverter";
import MenuIcon from "@mui/icons-material/Menu";
import { AppBar, Box, Container, Link, Toolbar } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";
import type { Dispatch, SetStateAction } from "react";
import { Fragment, useEffect, useRef, useState } from "react";
import SideMenu from "./SideMenu";

type NavbarProps = {
    setNavbarHeight?: Dispatch<SetStateAction<number | undefined>>;
    children?: React.ReactNode;
    style?: React.CSSProperties;
};

export default function Navbar(props: NavbarProps) {
    // テーマ設定を取得
    const theme = useTheme();
    // ブラウザ情報を取得
    const { isMobile } = useBrowserInfoContext();

    // メニューの開閉
    const [menu, setMenu] = useState<boolean>(false);

    // NavbarのHTMLが保存される
    const NavbarRef = useRef<HTMLDivElement | null>(null);

    // Navbarの高さ
    const [navbarHeight, setNavbarHeight] = useState<number | undefined>(
        undefined,
    );

    // BottomNavigationの高さを調べる
    useEffect(() => {
        if (typeof window !== "undefined") {
            // タブバーの高さを再計算する関数
            const updateNavHeight = () => {
                if (NavbarRef.current) {
                    const height = NavbarRef.current.clientHeight;
                    if (props.setNavbarHeight) {
                        props.setNavbarHeight(height);
                    }
                    setNavbarHeight(height);
                }
            };

            // 初回の高さ計算
            updateNavHeight();

            // ウィンドウリサイズ時に高さを再計算
            window.addEventListener("resize", updateNavHeight);

            // クリーンアップ: コンポーネントがアンマウントされたときにイベントリスナーを削除
            return () => {
                window.removeEventListener("resize", updateNavHeight);
            };
        }
    });

    return (
        <>
            <Fragment>
                <AppBar
                    ref={NavbarRef}
                    position="fixed"
                    color="default"
                    sx={{
                        ...{
                            // ↓ 背景色の指定と背景の透過
                            backgroundColor: `rgba(
                            ${rgbToHex(theme.palette.background.paper).r},
                            ${rgbToHex(theme.palette.background.paper).g},
                            ${rgbToHex(theme.palette.background.paper).b},
                            0.75)`,
                            // 背景をぼかす
                            backdropFilter: "blur(15px)",
                            // 背景をぼかす{Safari(WebKit)対応}
                            WebkitBackdropFilter: "blur(15px)",
                        },
                        ...props.style,
                    }}
                >
                    <Container maxWidth="xl">
                        <Toolbar
                            sx={{
                                width: isMobile ? "100%" : undefined,
                                padding: "0",
                            }}
                        >
                            {!isMobile && (
                                <>
                                    <IconButton
                                        color="inherit"
                                        aria-label="open drawer"
                                        onClick={() => {
                                            setMenu(true);
                                        }}
                                        edge="start"
                                        sx={[
                                            {
                                                height: "40",
                                                mr: 2,
                                            },
                                        ]}
                                    >
                                        <MenuIcon />
                                    </IconButton>
                                    <Link href="/" sx={{ margin: "0.25 auto" }}>
                                        <Image
                                            src="/icon_border_radius.png"
                                            alt="ぷらそにかアーカイブスロゴ"
                                            width={30}
                                            height={30}
                                        />
                                    </Link>
                                    <Box sx={{ flexGrow: 1 }} />
                                </>
                            )}

                            <Box
                                sx={{
                                    width: isMobile ? "100%" : "70%",
                                }}
                            >
                                {isMobile && (
                                    <Box
                                        sx={{
                                            display: "flex",
                                        }}
                                    >
                                        <Link
                                            href="/"
                                            sx={{
                                                paddingTop: 0.75,
                                                paddingBottom: 0.25,
                                            }}
                                        >
                                            <Image
                                                src="/icon_border_radius.png"
                                                alt="ぷらそにかアーカイブスロゴ"
                                                width={40}
                                                height={40}
                                            />
                                        </Link>
                                        <Box sx={{ flexGrow: 1 }} />
                                        <IconButton
                                            color="inherit"
                                            aria-label="open drawer"
                                            onClick={() => {
                                                setMenu(true);
                                            }}
                                            edge="start"
                                            sx={[
                                                {
                                                    mr: 2,
                                                },
                                            ]}
                                        >
                                            <MenuIcon />
                                        </IconButton>
                                    </Box>
                                )}
                                {props.children}
                            </Box>

                            {!isMobile && <Box sx={{ flexGrow: 1 }} />}
                        </Toolbar>
                    </Container>
                </AppBar>
                <Toolbar
                    sx={{
                        height: navbarHeight,
                    }}
                />
            </Fragment>

            {/* サイドメニュー */}
            <SideMenu open={menu} onClose={() => setMenu(false)} />
        </>
    );
}
