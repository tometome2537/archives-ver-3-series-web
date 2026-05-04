import type { Theme } from "@mui/material";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useEffect } from "react";
import { useAppleMusic } from "@/contexts/AppleMusicContext";
import AppleMusicIcon from "@/icon/AppleMusicIcon";

interface AppleMusicSectionProps {
	theme: Theme;
	setMenu: (value: boolean) => void;
}

export function AppleMusicSection({ theme, setMenu }: AppleMusicSectionProps) {
	const musicKit = useAppleMusic();

	useEffect(() => {
		if (!musicKit.isReady || !musicKit.instance) return;

		if (musicKit.isAuthorizationStatusDidChange) {
			setMenu(false);
			musicKit.isAuthorizationStatusDidChange = false;
		}
	}, [musicKit, setMenu]);

	return (
		<ListItem disablePadding>
			{musicKit.instance?.isAuthorized ? (
				<ListItemButton onClick={() => musicKit.instance?.unauthorize()}>
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
