import { darkTheme, lightTheme } from "@/app/theme";
import { createTheme } from "@mui/material/styles";
import { createContext, useMemo, useState } from "react";

export const ColorModeContext = createContext({
    toggleColorMode: () => {},
});

export function useThemeContent() {
    const [mode, setMode] = useState<"light" | "dark">("dark");

    const colorMode = {
        toggleColorMode: () => {
            setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
        },
    };

    const themePalette = mode === "dark" ? darkTheme : lightTheme;
    const theme = useMemo(
        () => createTheme({ palette: { mode, ...themePalette } }),
        [mode],
    );

    return { colorMode, theme };
}
