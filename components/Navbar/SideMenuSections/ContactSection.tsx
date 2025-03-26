import FeedbackIcon from "@mui/icons-material/Feedback";
import MailIcon from "@mui/icons-material/Mail";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

// フォームテンプレート
const formTemplate = `
【誤情報】
・対象のYouTubeのリンク
→
・対象のYouTubeのタイトル
→
・詳細
→


【バグ・不具合の報告】
・使用している端末名
→
・端末のOSバージョン
→
・使用しているブラウザ
→
・ブラウザのバージョン
→
・問題を再現する手順
→`;

export function ContactSection() {
    return (
        <>
            <ListItem disablePadding>
                <ListItemButton
                    component="a"
                    href="https://forms.gle/osqdRqh1MxWhA51A8"
                    target="_blank"
                >
                    <ListItemIcon>
                        <MailIcon sx={{ color: "rgb(50, 154, 229)" }} />
                    </ListItemIcon>
                    <ListItemText
                        style={{
                            whiteSpace: "pre-line",
                        }}
                        primary="お問い合わせ"
                    />
                </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
                <ListItemButton
                    component="a"
                    href={`https://docs.google.com/forms/d/e/1FAIpQLScfUbL_mPDFJP921o6bjvGi8Dq0VeyhNDpySpHSF97ECwWr8w/viewform?usp=pp_url&entry.1432192910=${encodeURIComponent(formTemplate)}`}
                    target="_blank"
                >
                    <ListItemIcon>
                        <FeedbackIcon sx={{ color: "rgb(165, 82, 242)" }} />
                    </ListItemIcon>
                    <ListItemText
                        style={{
                            whiteSpace: "pre-line",
                        }}
                        primary="フィードバック"
                        secondary={
                            "バグ報告・誤情報の報告もこちらからお願いします。\n削除依頼は上記メールアドレスへお願いします。"
                        }
                    />
                </ListItemButton>
            </ListItem>
        </>
    );
}
