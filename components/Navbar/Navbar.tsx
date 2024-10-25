import SuperSearchBar, {
    type InputValueSearchSuggestion,
    type additionalSearchSuggestions,
} from "@/components/Navbar/SuperSearchBar";
import UltraSuperSearchBar from "@/components/Navbar/UltraSuperSearchBar";
import type { ultraSuperSearchBarSearchSuggestion } from "@/components/Navbar/UltraSuperSearchBar";
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
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import MailIcon from "@mui/icons-material/Mail";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useColorModeContext } from "@/contexts/ThemeContext";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import XIcon from "@mui/icons-material/X";
import FeedbackIcon from "@mui/icons-material/Feedback";
import YouTubeIcon from "@mui/icons-material/YouTube";

export const NavButton = styled(Button)({
    color: "primary",
    fontWeight: "bold",
}) as typeof Button;

type NavbarProps = {
    // ウルトラスーパーサーチバー
    inputValue: InputValueSearchSuggestion[];
    setInputValue: Dispatch<SetStateAction<InputValueSearchSuggestion[]>>;
    searchSuggestion: ultraSuperSearchBarSearchSuggestion[];
    availableCategoryIds?: string[];
    // 外せない入力値を定義
    fixedOptionValues?: string[];
    // 入力するテキストのカテゴリー
    textSuggestionCategory?: additionalSearchSuggestions[];
    // 入力する日付のカテゴリー
    dateSuggestionCategory?: additionalSearchSuggestions[];
    // 表示するリミットスーパーサーチバーの定義
    limitSuperSearchCategory?: additionalSearchSuggestions[];

    screenHeight: number;
    isMobile: boolean;
    setSearchQuery: Dispatch<SetStateAction<string>>;
    search: () => void;
    setEntityId: Dispatch<SetStateAction<Array<EntityObj>>>;
    entityIdString: Array<string>;
    setNavbarHeight: Dispatch<SetStateAction<number>>;
};

export default function Navbar(props: NavbarProps) {
    // テーマ設定を取得
    const theme = useTheme();
    const { toggleColorMode } = useColorModeContext();

    // メニューの開閉
    const [menu, setMenu] = useState<boolean>(false);

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
        <>
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
                        <Toolbar
                            sx={{
                                width: props.isMobile ? "100%" : undefined,
                                padding: "0",
                            }}
                        >
                            {!props.isMobile && (
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
                                            src="/MAP.png"
                                            alt="Music Archives Project Logo"
                                            width={160}
                                            height={40}
                                        />
                                    </Link>
                                    <Box sx={{ flexGrow: 1 }} />
                                </>
                            )}

                            {/* <SearchBar
                            setSearchQuery={props.setSearchQuery}
                            search={props.search}
                        /> */}
                            <Box
                                sx={{
                                    width: props.isMobile ? "100%" : "70%",
                                }}
                            >
                                {props.isMobile && (
                                    <Box
                                        sx={{
                                            display: "flex",
                                        }}
                                    >
                                        <Link href="/" sx={{ mr: 2 }}>
                                            <Image
                                                src="/MAP.png"
                                                alt="Music Archives Project Logo"
                                                width={160}
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
                                <UltraSuperSearchBar
                                    inputValue={props.inputValue}
                                    setInputValue={props.setInputValue}
                                    searchSuggestion={props.searchSuggestion}
                                    fixedOptionValues={props.fixedOptionValues}
                                    availableCategoryIds={
                                        props.availableCategoryIds
                                    }
                                    // テキストの追加カテゴリー
                                    textSuggestionCategory={[
                                        {
                                            sort: 20,
                                            categoryId: "title",
                                            categoryLabel:
                                                "タイトルに含む文字列",
                                        },
                                        {
                                            sort: 22,
                                            categoryId: "description",
                                            categoryLabel: "概要欄に含む文字列",
                                        },
                                        {
                                            sort: 21,
                                            categoryId: "subTitle",
                                            categoryLabel:
                                                "サブタイトルに含む文字列",
                                        },
                                    ]}
                                    // 日付の追加カテゴリー
                                    dateSuggestionCategory={[
                                        {
                                            sort: 10,
                                            // カテゴリーのID
                                            categoryId: "since",
                                            // カテゴリーのラベル(表示に使用)
                                            categoryLabel: "開始日",
                                        },
                                        {
                                            sort: 11,
                                            categoryId: "until",
                                            categoryLabel: "終了日",
                                        },
                                    ]}
                                    limitSuperSearchCategory={
                                        props.limitSuperSearchCategory
                                    }
                                    // スマホの場合はタグのアイコンを非表示
                                    showTagIcon={!props.isMobile}
                                    // スマホの場合に表示するタグの個数を制限する。
                                    showTagCount={
                                        props.isMobile ? 2 : undefined
                                    }
                                />
                            </Box>

                            {/* <Box sx={{ flexGrow: 1 }} /> */}
                            {/* <EntitySelector
                            entityIdString={props.entityIdString}
                            setEntityId={props.setEntityId}
                        /> */}
                            {!props.isMobile && <Box sx={{ flexGrow: 1 }} />}
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
            <Drawer
                anchor={"left"}
                open={menu}
                onClose={() => {
                    setMenu(false);
                }}
            >
                <List>
                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={() => {
                                setMenu(false);
                            }}
                        >
                            <Image
                                src="/MAP.png"
                                alt="Music Archives Project Logo"
                                width={160}
                                height={40}
                            />
                        </ListItemButton>
                    </ListItem>
                    <Divider />
                    <ListItem disablePadding>
                        <ListItemButton
                            component="a"
                            href="https://x.com/MusicArchPJ"
                            target="_blank"
                        >
                            <ListItemIcon>
                                <XIcon />
                            </ListItemIcon>
                            <ListItemText primary="公式Xアカウント" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton
                            component="a"
                            href="https://forms.gle/osqdRqh1MxWhA51A8"
                            target="_blank"
                        >
                            <ListItemIcon>
                                {/* <MailIcon /> */}
                                <FeedbackIcon />
                            </ListItemIcon>
                            <ListItemText primary="お問い合わせ・フィードバック" />
                        </ListItemButton>
                    </ListItem>
                    <Divider />
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => toggleColorMode()}>
                            <ListItemIcon>
                                {theme.palette.mode === "dark" ? (
                                    <LightModeIcon />
                                ) : (
                                    <DarkModeIcon />
                                )}
                            </ListItemIcon>
                            <ListItemText
                                primary={
                                    theme.palette.mode === "dark"
                                        ? "ライトモードに切り替え"
                                        : "ダークモードに切り替え"
                                }
                            />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>
        </>
    );
}
