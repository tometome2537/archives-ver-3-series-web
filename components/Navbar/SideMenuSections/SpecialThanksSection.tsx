import GradeIcon from "@mui/icons-material/Grade";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Image from "next/image";

interface SpecialThanksSectionProps {
    onClose: () => void;
}

export function SpecialThanksSection({ onClose }: SpecialThanksSectionProps) {
    return (
        <>
            <ListItem disablePadding>
                <ListItemButton onClick={onClose}>
                    <ListItemText
                        primary="Special Thanks"
                        primaryTypographyProps={{ fontSize: "1.3rem" }}
                    />
                </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
                <ListItemButton
                    component="a"
                    href="https://sssapi.app"
                    target="_blank"
                >
                    <ListItemIcon>
                        <Image
                            src="/sssapi_logo.png"
                            alt="SSSAPI ロゴ"
                            width={25}
                            height={25}
                            style={{
                                borderRadius: "20%",
                            }}
                        />
                    </ListItemIcon>
                    <ListItemText
                        style={{
                            whiteSpace: "pre-line",
                        }}
                        primary={"SSSAPI"}
                        secondary={
                            "当サイトではSSSAPI様のサービスを利用させていただいています。\nここに感謝の意を表します。"
                        }
                    />
                </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
                <ListItemButton onClick={onClose}>
                    <ListItemIcon>
                        <GradeIcon sx={{ color: "rgb(227, 220, 18)" }} />
                    </ListItemIcon>
                    <ListItemText
                        style={{
                            whiteSpace: "pre-line",
                        }}
                        secondary={
                            "その他情報提供・バグ報告してくださった方々\n本当にありがとうございます。"
                        }
                    />
                </ListItemButton>
            </ListItem>
        </>
    );
}
