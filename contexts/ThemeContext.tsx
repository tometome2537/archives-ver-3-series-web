// Reference: https://qiita.com/KadoProG/items/15ceebf1aef774690bdf

"use client";

import { darkTheme, lightTheme } from "@/app/theme";
import { type PaletteMode, useMediaQuery } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Cookies from "js-cookie";
import React from "react";

/**カラーモードの選択オプション */
export type ColorModeChoice = "light" | "dark" | "device";

interface ColorModeContextType {
    /**選択中のカラーモード */
    selectedMode: ColorModeChoice;
    /**カラーモードを設定する関数 */
    setColorMode: (colorMode: ColorModeChoice) => void;
    toggleColorMode: () => void;
}

/**カラーモードのコンテキスト */
const ColorModeContext = React.createContext<ColorModeContextType>({
    selectedMode: "device", // 仮の設定
    setColorMode: (colorMode: ColorModeChoice) => {
        colorMode; // 仮の設定
    },
    toggleColorMode: () => {},
});

/**MUIの設定プロバイダ */
export const ThemeRegistry = (props: {
    children: React.ReactNode;
    initColorMode: ColorModeChoice;
}) => {
    const prefersInit = useMediaQuery("(prefers-color-scheme: dark)")
        ? "dark"
        : "light";

    // ユーザが選択しているカラーモード
    const [selectedMode, setSelectedMode] = React.useState<ColorModeChoice>(
        props.initColorMode,
    );

    /** 適用されるカラーモードの設定 */
    const mode = React.useMemo<PaletteMode>(
        () => (selectedMode !== "device" ? selectedMode : prefersInit),
        [prefersInit, selectedMode],
    );

    // コンテキストの指定（他のコンポーネントでも呼び出して使えるように）
    const colorMode = React.useMemo(
        () => ({
            selectedMode,
            setColorMode: (colorMode: ColorModeChoice) => {
                Cookies.set("colorMode", colorMode);
                setSelectedMode(colorMode);
            },
            toggleColorMode: () => {
                const setMode = selectedMode === "light" ? "dark" : "light";
                Cookies.set("colorMode", setMode);
                setSelectedMode(setMode);
            },
        }),
        [selectedMode],
    );

    // カスタムシーン
    const theme = React.useMemo(
        () => (mode === "light" ? lightTheme : darkTheme),
        [mode],
    );

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {props.children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
};

/**ColorModeContextを簡単に使うためのユーティリティ関数 */
export const useColorModeContext = (): ColorModeContextType =>
    React.useContext(ColorModeContext);
