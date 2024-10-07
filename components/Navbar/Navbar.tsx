import rgbToHex from "@/libs/colorConverter";
import { AppBar, Box, Button, Container, Link, Toolbar } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";
import type { Dispatch, SetStateAction } from "react";
import { Fragment, useEffect, useRef, useState } from "react";
import EntitySelector from "../EntitySelector";
import type { EntityObj } from "../EntitySelector";
import SearchBar from "./SearchBar";
import UltraSuperSearchBar from "@/components/Navbar/UltraSuperSearchBar";
import SuperSearchBar, {
    type InputValueSearchSuggestion,
} from "@/components/Navbar/SuperSearchBar";
import type { ultraSuperSearchBarSearchSuggestion } from "@/components/Navbar/UltraSuperSearchBar";

export const NavButton = styled(Button)({
    color: "primary",
    fontWeight: "bold",
}) as typeof Button;

type NavbarProps = {
    // ウルトラスーパーサーチバー
    inputValue: InputValueSearchSuggestion[];
    setInputValue: Dispatch<SetStateAction<InputValueSearchSuggestion[]>>;
    searchSuggestion: ultraSuperSearchBarSearchSuggestion[];

    screenHeight: number;
    setSearchQuery: Dispatch<SetStateAction<string>>;
    search: () => void;
    setEntityId: Dispatch<SetStateAction<Array<EntityObj>>>;
    entityIdString: Array<string>;
    setNavbarHeight: Dispatch<SetStateAction<number>>;
};

export default function Navbar(props: NavbarProps) {
    // テーマ設定を取得
    const theme = useTheme();
    // NavbarのHTMLが保存される
    const NavbarRef = useRef<HTMLDivElement | null>(null);

    const [navbarHeight, setNavbarHeight] = useState<number>(0);

    // BottomNavigationの高さを調べる
    useEffect(() => {
        if (typeof window !== "undefined") {
            // タブバーの高さを再計算する関数
            const updateNavHeight = () => {
                if (NavbarRef.current) {
                    const height = NavbarRef.current.clientHeight;
                    props.setNavbarHeight(height);
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
    }, [props]);

    return (
        <Fragment>
            <AppBar
                ref={NavbarRef}
                position="fixed"
                color="default"
                sx={{
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
                }}
            >
                <Container maxWidth="xl">
                    <Toolbar>
                        <Link href="/" sx={{ margin: "0.25 auto" }}>
                            <Image
                                src="/MAP.png"
                                alt="Music Archives Project Logo"
                                width={160}
                                height={40}
                            />
                        </Link>
                        <Box sx={{ flexGrow: 1 }} />
                        {/* <SearchBar
                            setSearchQuery={props.setSearchQuery}
                            search={props.search}
                        /> */}
                        <Box
                            sx={{
                                width: "70%",
                            }}
                        >
                            <UltraSuperSearchBar
                                inputValue={props.inputValue}
                                setInputValue={props.setInputValue}
                                searchSuggestion={props.searchSuggestion}
                                dateSuggestionCategory={[
                                    {
                                        // カテゴリーのID
                                        categoryId: "since",
                                        // カテゴリーのラベル(表示に使用)
                                        categoryLabel: "開始日",
                                    },
                                    {
                                        categoryId: "until",
                                        categoryLabel: "終了日",
                                    },
                                ]}
                                limitSuperSearchCategory={[
                                    {
                                        categoryId: "actor",
                                        categoryLabel: "出演者",
                                    },
                                    {
                                        categoryId: "organization",
                                        categoryLabel: "組織",
                                    },
                                    {
                                        categoryId: "YouTubeChannel",
                                        categoryLabel: "YouTubeチャンネル",
                                    },
                                ]}
                            />
                        </Box>

                        {/* <Box sx={{ flexGrow: 1 }} /> */}
                        {/* <EntitySelector
                            entityIdString={props.entityIdString}
                            setEntityId={props.setEntityId}
                        /> */}
                        <Box sx={{ flexGrow: 1 }} />
                        <NavButton
                            href="https://forms.gle/osqdRqh1MxWhA51A8"
                            target="_blank"
                        >
                            contact
                        </NavButton>
                    </Toolbar>
                </Container>
            </AppBar>
            <Toolbar
                sx={{
                    height: navbarHeight,
                }}
            />
        </Fragment>
    );
}
