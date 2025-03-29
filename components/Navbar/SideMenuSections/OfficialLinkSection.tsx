import HomeIcon from "@mui/icons-material/Home";
import XIcon from "@mui/icons-material/X";
import YouTubeIcon from "@mui/icons-material/YouTube";
import type { Theme } from "@mui/material";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Image from "next/image";
import { Fragment } from "react";

interface OfficialLinkSectionProps {
    theme: Theme;
}

export function OfficialLinkSection({ theme }: OfficialLinkSectionProps) {
    return (
        <Fragment>
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
                        <Image
                            src="/ig_logo.png"
                            alt="instagram ロゴ"
                            width={23}
                            height={23}
                            style={{
                                borderRadius: "20%",
                            }}
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
                    href="https://plusonica.com"
                    target="_blank"
                >
                    <ListItemIcon>
                        <HomeIcon sx={{ color: "#167c3b" }} />
                    </ListItemIcon>
                    <ListItemText primary="ぷらそにか公式 ホームページ " />
                </ListItemButton>
            </ListItem>
        </Fragment>
    );
}
