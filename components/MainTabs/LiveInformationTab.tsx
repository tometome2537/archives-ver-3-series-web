import { useApiDataContext } from "@/contexts/ApiDataContext";
import type { LiveInformation } from "@/contexts/ApiDataContext";
import { useAppleMusic } from "@/contexts/AppleMusicContext";
import {
    Box,
    Button,
    Chip,
    Divider,
    Link,
    Paper,
    Typography,
} from "@mui/material";
import { Fragment } from "react";
import { AppleMusicControls } from "../LiveInformation/AppleMusicControls";
import type { PlayerItem } from "../PlayerView";

type LiveInformationTabProps = {
    playerItem: PlayerItem | undefined;
};

// 日時フォーマット用のヘルパー関数
const formatDateTime = (dateTimeString: string | null) => {
    if (!dateTimeString) return "未定";
    const date = new Date(dateTimeString);
    return date.toLocaleString("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
};

// イベント表示コンポーネント
const EventCard = ({ event }: { event: LiveInformation }) => (
    <Paper
        elevation={2}
        sx={{
            border: "1px solid",
            borderColor: "grey.400",
            borderRadius: 1,
            p: 2,
            mb: 2,
        }}
    >
        <Typography variant="h6" gutterBottom>
            {event.タイトル || "タイトル未定"}
        </Typography>

        {event.サブタイトル && (
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                {event.サブタイトル}
            </Typography>
        )}

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, my: 1 }}>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                <Typography variant="body2" fontWeight="bold">
                    日時:
                </Typography>
                <Typography variant="body2">
                    開場 {formatDateTime(event.開場)} / 開演{" "}
                    {formatDateTime(event.開演)}
                </Typography>
            </Box>

            {event.会場 && (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    <Typography variant="body2" fontWeight="bold">
                        会場:
                    </Typography>
                    <Typography variant="body2">{event.会場}</Typography>
                </Box>
            )}

            {event.出演者 && (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    <Typography variant="body2" fontWeight="bold">
                        出演:
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {event.出演者.split(",").map((artist, index) => (
                            <Chip
                                key={index}
                                label={artist.trim()}
                                size="small"
                                variant="outlined"
                            />
                        ))}
                    </Box>
                </Box>
            )}
        </Box>

        <Divider sx={{ my: 1 }} />
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, my: 1 }}>
            <Typography variant="body2" fontWeight="bold">
                チケット情報:
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                    ml: 1,
                }}
            >
                {event.チケット !== null && (
                    <Typography variant="body2">
                        一般: {event.チケット.toLocaleString()}円
                    </Typography>
                )}
                {event.前売りチケット !== null && (
                    <Typography variant="body2">
                        前売: {event.前売りチケット.toLocaleString()}円
                    </Typography>
                )}
                {event.学生チケット !== null && (
                    <Typography variant="body2">
                        学生: {event.学生チケット.toLocaleString()}円
                    </Typography>
                )}
                {event.女性チケット !== null && (
                    <Typography variant="body2">
                        女性: {event.女性チケット.toLocaleString()}円
                    </Typography>
                )}
                {event.配信チケット !== null && (
                    <Typography variant="body2">
                        配信: {event.配信チケット.toLocaleString()}円
                    </Typography>
                )}
                {event.ドリンク !== null && (
                    <Typography variant="body2">
                        ドリンク: {event.ドリンク.toLocaleString()}円
                    </Typography>
                )}
            </Box>

            {event.配信開始日 && event.配信終了日 && (
                <Box sx={{ ml: 1 }}>
                    <Typography variant="body2">
                        配信期間: {formatDateTime(event.配信開始日)} 〜{" "}
                        {formatDateTime(event.配信終了日)}
                    </Typography>
                </Box>
            )}

            {event.チケット購入リンク && (
                <Box sx={{ mt: 1 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        component={Link}
                        href={event.チケット購入リンク}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        チケットを購入する
                    </Button>
                </Box>
            )}
        </Box>

        {(event.情報元 || event.情報元X) && (
            <Box sx={{ mt: 2, fontSize: "0.75rem", color: "text.secondary" }}>
                <Typography variant="caption">
                    情報元: {event.情報元 || event.情報元X || "不明"}
                </Typography>
            </Box>
        )}
    </Paper>
);

export function LiveInformationTab(props: LiveInformationTabProps) {
    const musicKit = useAppleMusic();

    const apiData = useApiDataContext("LiveInformation");

    return (
        <Fragment>
            {/* イベント一覧 */}
            <Typography variant="h6" sx={{ mb: 2 }}>
                イベント情報
            </Typography>
            {apiData.LiveInformation.data.length > 0 ? (
                apiData.LiveInformation.data.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))
            ) : (
                <Typography>イベント情報はありません</Typography>
            )}
            <AppleMusicControls musicKit={musicKit} />
            {props.playerItem && (
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6"> 現在の再生情報;</Typography>
                    <pre>JSON.stringify(props.playerItem, null, 2)</pre>
                </Box>
            )}
        </Fragment>
    );
}
