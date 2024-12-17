import type {
    InputValue,
    additionalSearchSuggestions,
} from "@/components/Navbar/SuperSearchBar";
import UltraSuperSearchBar from "@/components/Navbar/UltraSuperSearchBar";
import type { ultraSuperSearchBarSearchSuggestion } from "@/components/Navbar/UltraSuperSearchBar";
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
import Switch from "@mui/material/Switch";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";
import type { Dispatch, SetStateAction } from "react";
import { Fragment, useEffect, useRef, useState } from "react";

export const NavButton = styled(Button)({
    color: "primary",
    fontWeight: "bold",
}) as typeof Button;

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    "& .MuiSwitch-switchBase": {
        margin: 1,
        padding: 0,
        transform: "translateX(6px)",
        "&.Mui-checked": {
            color: "#fff",
            transform: "translateX(22px)",
            "& .MuiSwitch-thumb:before": {
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                    "#fff",
                )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
            },
            "& + .MuiSwitch-track": {
                opacity: 1,
                backgroundColor: "#aab4be",
                ...theme.applyStyles("dark", {
                    backgroundColor: "#8796A5",
                }),
            },
        },
    },
    "& .MuiSwitch-thumb": {
        backgroundColor: "#001e3c",
        width: 32,
        height: 32,
        "&::before": {
            content: "''",
            position: "absolute",
            width: "100%",
            height: "100%",
            left: 0,
            top: 0,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                "#fff",
            )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
        },
        ...theme.applyStyles("dark", {
            backgroundColor: "#003892",
        }),
    },
    "& .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: "#aab4be",
        borderRadius: 20 / 2,
        ...theme.applyStyles("dark", {
            backgroundColor: "#8796A5",
        }),
    },
}));

type NavbarProps = {
    // ウルトラスーパーサーチバー
    inputValue: InputValue[];
    setInputValue: Dispatch<SetStateAction<InputValue[]>>;
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
    // スーパーサーチバーの変更時に実行する関数
    superSearchOnChange?: () => void;

    screenHeight: number;
    isMobile: boolean;
    setNavbarHeight: Dispatch<SetStateAction<number>>;
};

export default function Navbar(props: NavbarProps) {
    // テーマ設定を取得
    const theme = useTheme();
    const { selectedMode, setColorMode } = useColorModeContext();

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
                                    limitSuperSearchCategory={
                                        props.limitSuperSearchCategory
                                    }
                                    // スマホの場合はタグのアイコンを非表示
                                    showTagIcon={
                                        props.inputValue.length <= 2
                                            ? true
                                            : !props.isMobile
                                    }
                                    // スマホの場合に表示するタグの個数を制限する。
                                    showTagCount={
                                        props.isMobile ? 2 : undefined
                                    }
                                    superSearchOnChange={
                                        props.superSearchOnChange
                                    }
                                />
                            </Box>

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
                                <XIcon />
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
                                <InstagramIcon />
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
                                {/* // ↓ 未設定 TO Do */}
                                {/* <InstagramIcon /> */}
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
                                <HomeIcon />
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
                                <XIcon />
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
                                <MailIcon />
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
                                <FeedbackIcon />
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
                    {/* <Divider />
                    <Divider />
                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={() => {
                                toggleColorMode();
                                setMenu(false);
                            }}
                        >
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
                    </ListItem> */}
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
                                    width={40}
                                    height={40}
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
                                <GradeIcon />
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
