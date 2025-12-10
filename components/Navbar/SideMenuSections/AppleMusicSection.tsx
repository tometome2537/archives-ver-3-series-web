import type { Theme } from "@mui/material";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AppleMusicIcon from "@/icon/AppleMusicIcon";
import { useAppleMusic } from "@/contexts/AppleMusicContext";

interface AppleMusicSectionProps {
    theme: Theme;
}

export function AppleMusicSection({ theme }: AppleMusicSectionProps) {
    const musicKit = useAppleMusic();
    return (
        <ListItem disablePadding>
            {musicKit.instance?.isAuthorized ? (
                <ListItemButton
                    onClick={() => musicKit.instance?.unauthorize()}
                >
                    <ListItemIcon>
                        <AppleMusicIcon />
                    </ListItemIcon>
                    <ListItemText primary="Apple Music ログアウト" />
                </ListItemButton>
            ) : (
                <ListItemButton onClick={() => musicKit.instance?.authorize()}>
                    <ListItemIcon>
                        <AppleMusicIcon />
                    </ListItemIcon>
                    <ListItemText primary="Apple Music ログイン" />
                </ListItemButton>
            )}
            {musicKit.instance?.previewOnly && (
                <ListItemText>注意 サブスクに未加入です</ListItemText>
            )}
        </ListItem>
    );
}
