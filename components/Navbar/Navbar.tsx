import type {
    AdditionalSearchSuggestions,
    InputValue,
} from "@/components/Navbar/SearchBar/SearchBar";
import { useBrowserInfoContext } from "@/contexts/BrowserInfoContext";
import { useColorModeContext } from "@/contexts/ThemeContext";
import rgbToHex from "@/libs/colorConverter";
import { DarkModeOutlined, LightModeOutlined } from "@mui/icons-material";
import DevicesIcon from "@mui/icons-material/Devices";
import FeedbackIcon from "@mui/icons-material/Feedback";
import GradeIcon from "@mui/icons-material/Grade";
import HomeIcon from "@mui/icons-material/Home";
import InstagramIcon from "@mui/icons-material/Instagram";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import XIcon from "@mui/icons-material/X";
import YouTubeIcon from "@mui/icons-material/YouTube";
import {
    AppBar,
    Box,
    Button,
    Container,
    FormControl,
    InputLabel,
    Link,
    MenuItem,
    Select,
    Toolbar,
} from "@mui/material";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";
import type { Dispatch, SetStateAction } from "react";
import { Fragment, useEffect, useRef, useState } from "react";
import type { MultiSearchBarSearchSuggestion } from "./SearchBar/MultiSearchBar";
import MultiSearchBar from "./SearchBar/MultiSearchBar";

export const NavButton = styled(Button)({
    color: "primary",
    fontWeight: "bold",
}) as typeof Button;

type NavbarProps = {
    // マルチサーチバー
    inputValue: InputValue[];
    setInputValue: Dispatch<SetStateAction<InputValue[]>>;
    searchSuggestion: MultiSearchBarSearchSuggestion[];
    availableCategoryIds?: string[];
    // 外せない入力値を定義
    fixedOptionValues?: string[];
    // 入力するテキストのカテゴリー
    textSuggestionCategory?: AdditionalSearchSuggestions[];
    // 入力する日付のカテゴリー
    dateSuggestionCategory?: AdditionalSearchSuggestions[];
    // 表示するリミットサーチバーの定義
    limitSearchCategory?: AdditionalSearchSuggestions[];
    // サーチバーの変更時に実行する関数
    searchOnChange?: () => void;
    setNavbarHeight: Dispatch<SetStateAction<number>>;
};

export default function Navbar(props: NavbarProps) {
    // テーマ設定を取得
    const theme = useTheme();
    const { selectedMode, setColorMode } = useColorModeContext();
    // ブラウザ情報を取得
    const { isMobile } = useBrowserInfoContext();

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
                                            // src="/MAP.png"
                                            src="/icon_border_radius.png"
                                            // alt="Music Archives Project Logo"
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
                                        <Link href="/" sx={{ mr: 2 }}>
                                            <Image
                                                // src="/MAP.png"
                                                src="/icon_border_radius.png"
                                                // alt="Music Archives Project Logo"
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
                                <MultiSearchBar
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
                                            categoryLabel: "タイトル",
                                        },
                                        {
                                            sort: 22,
                                            categoryId: "description",
                                            categoryLabel: "概要欄",
                                        },
                                        // {
                                        //     sort: 21,
                                        //     categoryId: "subTitle",
                                        //     categoryLabel:
                                        //         "サブタイトルに含む文字列",
                                        // },
                                    ]}
                                    // 日付の追加カテゴリー
                                    dateSuggestionCategory={
                                        [
                                            // {
                                            //     sort: 10,
                                            //     // カテゴリーのID
                                            //     categoryId: "since",
                                            //     // カテゴリーのラベル(表示に使用)
                                            //     categoryLabel: "開始日",
                                            // },
                                            // {
                                            //     sort: 11,
                                            //     categoryId: "until",
                                            //     categoryLabel: "終了日",
                                            // },
                                        ]
                                    }
                                    limitSearchCategory={
                                        props.limitSearchCategory
                                    }
                                    // スマホの場合はタグのアイコンを非表示
                                    showTagIcon={
                                        props.inputValue.length <= 2
                                            ? true
                                            : !isMobile
                                    }
                                    // スマホの場合に表示するタグの個数を制限する。
                                    showTagCount={isMobile ? 2 : undefined}
                                    searchOnChange={props.searchOnChange}
                                />
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
                            <ListItemIcon>
                                <Image
                                    // src="/MAP.png"
                                    src="/icon_border_radius.png"
                                    // alt="Music Archives Project Logo"
                                    alt="ぷらそにかアーカイブスロゴ"
                                    width={40}
                                    height={40}
                                />
                            </ListItemIcon>
                            <ListItemText
                                primary="ぷらそにかアーカイブス"
                                secondary={
                                    "当サイトはぷらそにかファンが制作しました。"
                                }
                            />
                        </ListItemButton>
                    </ListItem>
                    <Divider sx={{ borderBottomWidth: 3 }} />

                    <ListItem disablePadding>
                        <ListItemButton
                            component="a"
                            href="https://m.youtube.com/@plusonica"
                            target="_blank"
                        >
                            <ListItemIcon>
                                <YouTubeIcon sx={{ color: "rgb(236,44,46)" }} />
                            </ListItemIcon>
                            <ListItemText primary="ぷらそにか公式 YouTube" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton
                            component="a"
                            href="https://x.com/plusonica"
                            target="_blank"
                        >
                            <ListItemIcon>
                                <XIcon
                                    sx={{
                                        color:
                                            theme.palette.mode === "dark"
                                                ? "#F5F5F5"
                                                : "#121212",
                                    }}
                                />
                            </ListItemIcon>
                            <ListItemText primary="ぷらそにか公式 𝕏 " />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton
                            component="a"
                            href="https://www.instagram.com/plusonica/"
                            target="_blank"
                        >
                            <ListItemIcon>
                                <InstagramIcon
                                    sx={{ color: "rgb(247, 58, 5)" }}
                                />
                            </ListItemIcon>
                            <ListItemText primary="ぷらそにか公式 Instagram " />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton
                            component="a"
                            href="https://www.tiktok.com/@plusonica_official"
                            target="_blank"
                        >
                            <ListItemIcon>
                                <Image
                                    src="/tiktok_logo.png"
                                    alt="tiktok ロゴ"
                                    width={20}
                                    height={20}
                                    style={{
                                        borderRadius: "20%",
                                    }}
                                />
                            </ListItemIcon>
                            <ListItemText primary="ぷらそにか公式 TikTok " />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton
                            component="a"
                            href="https://plusonica.com
                            "
                            target="_blank"
                        >
                            <ListItemIcon>
                                <HomeIcon sx={{ color: "#167c3b" }} />
                            </ListItemIcon>
                            <ListItemText primary="ぷらそにか公式 ホームページ " />
                        </ListItemButton>
                    </ListItem>
                    <Divider sx={{ borderBottomWidth: 3 }} />
                    <ListItem disablePadding>
                        <ListItemButton
                            component="a"
                            href="https://m.youtube.com/@MusicArchPJ/playlists?view=1&sort=lad&flow=grid"
                            target="_blank"
                        >
                            <ListItemIcon>
                                <YouTubeIcon sx={{ color: "rgb(236,44,46)" }} />
                            </ListItemIcon>
                            <ListItemText
                                primary="YouTubeプレイリスト"
                                secondary={"ぷらそにかに関するプレイリスト"}
                            />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton
                            component="a"
                            href="https://x.com/MusicArchPJ"
                            target="_blank"
                        >
                            <ListItemIcon>
                                <XIcon
                                    sx={{
                                        color:
                                            theme.palette.mode === "dark"
                                                ? "#F5F5F5"
                                                : "#121212",
                                    }}
                                />
                            </ListItemIcon>
                            <ListItemText primary="サイト運営 𝕏 アカウント" />
                        </ListItemButton>
                    </ListItem>
                    {/* <ListItem disablePadding>
                        <ListItemButton
                            component="a"
                            href="https://docs.google.com/spreadsheets/d/1-Reapa-TeRj3FfRomqpj9e6aDCjwH2vMRkAv27bwSV4/edit?usp=sharing"
                            target="_blank"
                        >
                            <ListItemIcon>
                                <StorageIcon />
                            </ListItemIcon>
                            <ListItemText primary="サイトデータベース" />
                        </ListItemButton>
                    </ListItem> */}
                    <ListItem disablePadding>
                        <ListItemButton
                            component="a"
                            href="https://forms.gle/osqdRqh1MxWhA51A8"
                            target="_blank"
                        >
                            <ListItemIcon>
                                <MailIcon sx={{ color: "rgb(50, 154, 229)" }} />
                            </ListItemIcon>
                            <ListItemText primary="お問い合わせ" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton
                            component="a"
                            href="https://docs.google.com/forms/d/e/1FAIpQLScfUbL_mPDFJP921o6bjvGi8Dq0VeyhNDpySpHSF97ECwWr8w/viewform?usp=pp_url&entry.1432192910=%E3%80%90%E3%83%90%E3%82%B0%E3%83%BB%E4%B8%8D%E5%85%B7%E5%90%88%E3%81%AE%E5%A0%B1%E5%91%8A%E3%80%91%0A%E3%83%BB%E4%BD%BF%E7%94%A8%E3%81%97%E3%81%A6%E3%81%84%E3%82%8B%E7%AB%AF%E6%9C%AB%E5%90%8D%0A%E2%86%92%0A%E3%83%BB%E7%AB%AF%E6%9C%AB%E3%81%AEOS%E3%83%90%E3%83%BC%E3%82%B8%E3%83%A7%E3%83%B3%0A%E2%86%92%0A%E3%83%BB%E4%BD%BF%E7%94%A8%E3%81%97%E3%81%A6%E3%81%84%E3%82%8B%E3%83%96%E3%83%A9%E3%82%A6%E3%82%B6%0A%E2%86%92%0A%E3%83%BB%E3%83%96%E3%83%A9%E3%82%A6%E3%82%B6%E3%81%AE%E3%83%90%E3%83%BC%E3%82%B8%E3%83%A7%E3%83%B3%0A%E2%86%92%0A%E3%83%BB%E5%95%8F%E9%A1%8C%E3%82%92%E5%86%8D%E7%8F%BE%E3%81%99%E3%82%8B%E6%89%8B%E9%A0%86%0A%E2%86%92"
                            target="_blank"
                        >
                            <ListItemIcon>
                                {/* <MailIcon /> */}
                                <FeedbackIcon
                                    sx={{ color: "rgb(165, 82, 242)" }}
                                />
                            </ListItemIcon>
                            <ListItemText
                                primary="フィードバック"
                                secondary={
                                    "バグ報告・誤情報の報告もこちらからお願いします。"
                                }
                            />
                        </ListItemButton>
                    </ListItem>
                    <Divider sx={{ borderBottomWidth: 3 }} />
                    <ListItem>
                        <FormControl sx={{ width: 200 }}>
                            <InputLabel id="theme-select-label">
                                サイトテーマ
                            </InputLabel>
                            <Select
                                labelId="theme-select-label"
                                value={selectedMode}
                                label="サイトテーマ"
                                onChange={(mode) => {
                                    const value = mode.target.value as
                                        | "light"
                                        | "dark"
                                        | "device";

                                    if (value) {
                                        setColorMode(value);
                                    }
                                    // メニューを閉じる
                                    setMenu(false);
                                }}
                            >
                                <MenuItem value={"light"}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                        }}
                                    >
                                        ライト
                                        <LightModeOutlined />
                                    </Box>
                                </MenuItem>
                                <MenuItem value={"dark"}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                        }}
                                    >
                                        ダーク
                                        <DarkModeOutlined />
                                    </Box>
                                </MenuItem>

                                <MenuItem value={"device"}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                        }}
                                    >
                                        デバイス
                                        <DevicesIcon />
                                    </Box>
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </ListItem>
                    <Divider sx={{ borderBottomWidth: 3 }} />
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemText
                                primary="Special Thanks"
                                // secondary={
                                //     "〜当サイトの構築に貢献してくださった方々〜"
                                // }
                                primaryTypographyProps={{ fontSize: "1.3rem" }} // テキストサイズを1.5remに設定
                            />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton
                            component="a"
                            href="https://sssapi.app"
                            target="_blank"
                        >
                            <ListItemIcon>
                                <Image
                                    src="/sssapi_logo.png"
                                    alt="SSSAPI ロゴ"
                                    width={30}
                                    height={30}
                                    style={{
                                        borderRadius: "20%",
                                    }}
                                />
                            </ListItemIcon>
                            <ListItemText
                                style={{
                                    // 文字列内の\nを適切に反映させる。
                                    whiteSpace: "pre-line",
                                }}
                                primary={"SSSAPI"}
                                secondary={
                                    "当サイトではSSSAPI様のサービスを利用させていただいています。\nここに感謝の意を表します。"
                                }
                            />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <GradeIcon
                                    sx={{ color: "rgb(227, 220, 18)" }}
                                />
                            </ListItemIcon>
                            <ListItemText
                                style={{
                                    // 文字列内の\nを適切に反映させる。
                                    whiteSpace: "pre-line",
                                }}
                                secondary={
                                    "その他情報提供・バグ報告してくださった方々\n本当にありがとうございます。"
                                }
                            />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>
        </>
    );
}
