import type { LiveInformation } from "@/contexts/ApiDataContext";
import { Box, Button, Link, Typography } from "@mui/material";
import React, { Fragment } from "react";
import { formatDateTime } from "./utils";

interface TicketInfoSectionProps {
    event: LiveInformation;
}

export const TicketInfoSection = ({ event }: TicketInfoSectionProps) => (
    <Fragment>
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
    </Fragment>
);
