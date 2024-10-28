import { useColorModeContext } from "@/contexts/ThemeContext";
import { Box, Button, Typography, useTheme } from "@mui/material";

export function DebugTab() {
    // テーマ設定を取得
    const theme = useTheme();
    const { toggleColorMode } = useColorModeContext();

    return (
        <div>
            <h3>テストUI</h3>
            <h3>デバッグ情報</h3>
            <div>
                <Button variant="outlined" onClick={() => toggleColorMode()}>
                    サイトテーマの切り替えボタン
                </Button>
                <Box sx={{ p: 2 }}>
                    <Typography variant="h5">
                        {theme.palette.mode} Theme Colors
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="h6">Primary Colors</Typography>
                        <Box sx={{ display: "flex", gap: 2 }}>
                            <Box
                                sx={{
                                    bgcolor: theme.palette.primary.main,
                                    color: theme.palette.primary.contrastText,
                                    p: 2,
                                }}
                            >
                                {theme.palette.primary.main}
                            </Box>
                            <Box
                                sx={{
                                    bgcolor: theme.palette.primary.light,
                                    color: theme.palette.primary.contrastText,
                                    p: 2,
                                }}
                            >
                                {theme.palette.primary.light}
                            </Box>
                            <Box
                                sx={{
                                    bgcolor: theme.palette.primary.dark,
                                    color: theme.palette.primary.contrastText,
                                    p: 2,
                                }}
                            >
                                {theme.palette.primary.dark}
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="h6">Secondary Colors</Typography>
                        <Box sx={{ display: "flex", gap: 2 }}>
                            <Box
                                sx={{
                                    bgcolor: theme.palette.secondary.main,
                                    color: theme.palette.secondary.contrastText,
                                    p: 2,
                                }}
                            >
                                {theme.palette.secondary.main}
                            </Box>
                            <Box
                                sx={{
                                    bgcolor: theme.palette.secondary.light,
                                    color: theme.palette.secondary.contrastText,
                                    p: 2,
                                }}
                            >
                                {theme.palette.secondary.light}
                            </Box>
                            <Box
                                sx={{
                                    bgcolor: theme.palette.secondary.dark,
                                    color: theme.palette.secondary.contrastText,
                                    p: 2,
                                }}
                            >
                                {theme.palette.secondary.dark}
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="h6">Background Colors</Typography>
                        <Box sx={{ display: "flex", gap: 2 }}>
                            <Box
                                sx={{
                                    bgcolor: theme.palette.background.default,
                                    color: theme.palette.text.primary,
                                    p: 2,
                                }}
                            >
                                {theme.palette.background.default}
                            </Box>
                            <Box
                                sx={{
                                    bgcolor: theme.palette.background.paper,
                                    color: theme.palette.text.primary,
                                    p: 2,
                                }}
                            >
                                {theme.palette.background.paper}
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="h6">Text Colors</Typography>
                        <Box sx={{ display: "flex", gap: 2 }}>
                            <Box
                                sx={{
                                    color: theme.palette.text.primary,
                                    p: 2,
                                }}
                            >
                                {theme.palette.text.primary}
                            </Box>
                            <Box
                                sx={{
                                    color: theme.palette.text.secondary,
                                    p: 2,
                                }}
                            >
                                {theme.palette.text.secondary}
                            </Box>
                        </Box>
                    </Box>
                </Box>
                {/* <p>デバッグモード:{JSON.stringify(debugMode)}</p>
                <p>
                    navbarの高さ: {JSON.stringify(navbarHeight)}
                    px
                </p>
                <p>
                    Tabberの高さ: {JSON.stringify(tabbarHeight)}
                    px
                </p>
                <p>playerViewの高さ: {JSON.stringify(playerViewHeight)}</p>
                <p>現在選択されているentityId: {JSON.stringify(entityId)}</p>
                <p>アクティブなタブ: {JSON.stringify(activeTabList)}</p>
                <p>Screen Width: {screenWidth}px</p>
                <p>Screen Height: {screenHeight}px</p>
                <p>Device Type: {isMobile ? "Mobile" : "Desktop"}</p>
                <p>現在再生中の楽曲： {JSON.stringify(playerItem)}</p>
                <p>検索結果一覧: {JSON.stringify(playerSearchResult)}</p> */}
            </div>
        </div>
    );
}
