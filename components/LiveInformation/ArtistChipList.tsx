import { Box, Chip } from "@mui/material";
import React from "react";

interface ArtistChipListProps {
    artists: string;
}

export const ArtistChipList = ({ artists }: ArtistChipListProps) => (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
        {artists.split(",").map((artist, index) => (
            <Chip
                key={artist.trim()}
                label={artist.trim()}
                size="small"
                variant="outlined"
            />
        ))}
    </Box>
);
