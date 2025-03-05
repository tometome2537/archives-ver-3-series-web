import { Computer } from "@mui/icons-material";
import { Policy } from "@mui/icons-material";
import { PrivacyTip } from "@mui/icons-material";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

export function LegalSection() {
    return (
        <>
            <ListItem disablePadding>
                <ListItemButton component="a" href="/license" target="_blank">
                    <ListItemIcon>
                        <Computer sx={{ color: "rgb(165, 82, 242)" }} />
                    </ListItemIcon>
                    <ListItemText primary="ライセンス情報" />
                </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
                <ListItemButton component="a" href="/tos" target="_blank">
                    <ListItemIcon>
                        <Policy sx={{ color: "rgb(165, 82, 242)" }} />
                    </ListItemIcon>
                    <ListItemText primary="利用規約" />
                </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
                <ListItemButton component="a" href="/policy" target="_blank">
                    <ListItemIcon>
                        <PrivacyTip sx={{ color: "rgb(165, 82, 242)" }} />
                    </ListItemIcon>
                    <ListItemText primary="プライバシーポリシー" />
                </ListItemButton>
            </ListItem>
        </>
    );
}
