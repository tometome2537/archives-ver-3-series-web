import type { Theme } from "@mui/material";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Fragment } from "react";
import CodeIcon from "@mui/icons-material/Code";

interface BetaSiteLinkSectionProps {
    theme: Theme;
}

export function BetaSiteLinkSection({ theme }: BetaSiteLinkSectionProps) {
    return (
        <Fragment>
            <ListItem disablePadding>
                <ListItemButton
                    component="a"
                    href="https://beta-music-archives-project.vercel.app/"
                    target="_blank"
                >
                    <ListItemIcon>
                        <CodeIcon sx={{ color: theme.palette.mode === "light" ? "rgb(3, 46, 235)" : "rgb(87, 133, 226)" }} />
                    </ListItemIcon>
                    <ListItemText primary="β版 アーカイブス" />
                </ListItemButton>
            </ListItem>
        </Fragment>
    );
}
