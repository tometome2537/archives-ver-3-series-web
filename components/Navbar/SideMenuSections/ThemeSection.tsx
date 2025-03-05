import { DarkModeOutlined, LightModeOutlined } from "@mui/icons-material";
import DevicesIcon from "@mui/icons-material/Devices";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import ListItem from "@mui/material/ListItem";

interface ThemeSectionProps {
    selectedMode: "light" | "dark" | "device";
    setColorMode: (mode: "light" | "dark" | "device") => void;
}

export function ThemeSection({
    selectedMode,
    setColorMode,
}: ThemeSectionProps) {
    return (
        <ListItem>
            <FormControl sx={{ width: 200 }}>
                <InputLabel id="theme-select-label">サイトテーマ</InputLabel>
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
    );
}
