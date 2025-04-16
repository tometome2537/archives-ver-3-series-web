import type { Theme } from "@mui/material";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Fragment } from "react";
import DiscordIcon from "@/icon/DiscordIcon";
import GitHubIcon from '@mui/icons-material/GitHub';
import GoogleSheetsIcon from "@/icon/GoogleSheetsIcon";
import DevBoxIcon from "@/icon/DevBoxIcon";

interface BetaSiteLinkSectionProps {
    theme: Theme;
}

export function BetaSiteLinkSection({ theme }: BetaSiteLinkSectionProps) {
    return (
        <Fragment>
            <ListItem disablePadding>
                <ListItemButton
                    component="a"
                    href="https://discord.com/invite/mEsfSKFueq"
                    target="_blank"
                >
                    <ListItemIcon>
                        <DiscordIcon sx={{ color: theme.palette.mode === "light" ? "#5865F2" : "rgb(87, 133, 226)" }} />
                    </ListItemIcon>
                    <ListItemText primary="アーカイブスサーバー" />
                </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
                <ListItemButton
                    component="a"
                    href="https://beta-music-archives-project.vercel.app"
                    target="_blank"
                >
                    <ListItemIcon>
                        <DevBoxIcon sx={{ color: theme.palette.mode === "light" ? "rgb(3, 46, 235)" : "rgb(87, 133, 226)" }} />
                    </ListItemIcon>
                    <ListItemText primary="β版 アーカイブス" />
                </ListItemButton>
            </ListItem>

            {/* <ListItem disablePadding>
                <ListItemButton
                    component="a"
                    href="https://github.com/tometome2537/archives-ver-3-series-web"
                    target="_blank"
                >
                    <ListItemIcon>
                        <GitHubIcon sx={{color: "#181717"}} />
                    </ListItemIcon>
                    <ListItemText primary="GitHubリポジトリ" />
                </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
                <ListItemButton
                    component="a"
                    href="https://docs.google.com/spreadsheets/d/1-Reapa-TeRj3FfRomqpj9e6aDCjwH2vMRkAv27bwSV4/edit?gid=0#gid=0"
                    target="_blank"
                >
                    <ListItemIcon>
                        <GoogleSheetsIcon sx={{ color: "#34A853" }} />
                    </ListItemIcon>
                    <ListItemText primary="データベース" />
                </ListItemButton>
            </ListItem> */}
        </Fragment>
    );
}
