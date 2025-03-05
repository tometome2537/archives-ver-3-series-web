import XIcon from "@mui/icons-material/X";
import YouTubeIcon from "@mui/icons-material/YouTube";
import type { Theme } from "@mui/material";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

interface ProjectLinkSectionProps {
    theme: Theme;
}

export function ProjectLinkSection({ theme }: ProjectLinkSectionProps) {
    return (
        <>
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
        </>
    );
}
