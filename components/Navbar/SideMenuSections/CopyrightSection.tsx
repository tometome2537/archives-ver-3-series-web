import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

interface CopyrightSectionProps {
    onClose: () => void;
    version: string;
}

export function CopyrightSection({ onClose, version }: CopyrightSectionProps) {
    return (
        <ListItem disablePadding>
            <ListItemButton onClick={onClose}>
                <ListItemText
                    style={{
                        whiteSpace: "pre-line",
                    }}
                    secondary={`当サイトはファン制作の非公式サイトです。\n使用している画像の著作権および商標権、その他知的財産権は、\n当該コンテンツの提供元に帰属します。\n本当にありがとうございます。\n\n以下は当サイト独自の内容に関するものです。\nCopyright © 2025 ミュージックアーカイブスプロジェクト v${version}`}
                />
            </ListItemButton>
        </ListItem>
    );
}
