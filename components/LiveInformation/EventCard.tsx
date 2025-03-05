import type { LiveInformation } from "@/contexts/ApiDataContext";
import { Box, Divider, Paper, Typography } from "@mui/material";
import React from "react";
import { ArtistChipList } from "./ArtistChipList";
import { EventInfoRow } from "./EventInfoRow";
import { TicketInfoSection } from "./TicketInfoSection";
import { formatDateTime } from "./utils";

interface EventCardProps {
    event: LiveInformation;
}

export const EventCard = ({ event }: EventCardProps) => (
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
            <EventInfoRow label="日時">
                <Typography variant="body2">
                    開場 {formatDateTime(event.開場)} / 開演{" "}
                    {formatDateTime(event.開演)}
                </Typography>
            </EventInfoRow>

            {event.会場 && (
                <EventInfoRow label="会場">
                    <Typography variant="body2">{event.会場}</Typography>
                </EventInfoRow>
            )}

            {event.出演者 && (
                <EventInfoRow label="出演">
                    <ArtistChipList artists={event.出演者} />
                </EventInfoRow>
            )}
        </Box>

        <Divider sx={{ my: 1 }} />
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, my: 1 }}>
            <TicketInfoSection event={event} />
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
