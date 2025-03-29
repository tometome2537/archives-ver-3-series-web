import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Image from "next/image";

interface HeaderSectionProps {
    onClose: () => void;
}

export function HeaderSection({ onClose }: HeaderSectionProps) {
    return (
        <ListItem disablePadding>
            <ListItemButton onClick={onClose}>
                <ListItemIcon>
                    <Image
                        src="/icon_border_radius.png"
                        alt="ぷらそにかアーカイブスロゴ"
                        width={40}
                        height={40}
                    />
                </ListItemIcon>
                <ListItemText
                    primary="ぷらそにかアーカイブス"
                    secondary="当サイトはぷらそにかファンが制作しました。"
                />
            </ListItemButton>
        </ListItem>
    );
}
