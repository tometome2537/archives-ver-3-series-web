import { Box, Typography } from "@mui/material";
import type React from "react";

interface EventInfoRowProps {
    label: string;
    children: React.ReactNode;
}

export const EventInfoRow = ({ label, children }: EventInfoRowProps) => (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        <Typography variant="body2" fontWeight="bold">
            {label}:
        </Typography>
        {children}
    </Box>
);
