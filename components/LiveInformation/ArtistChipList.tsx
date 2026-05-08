import { Box, Chip } from "@mui/material";

interface ArtistChipListProps {
	artists: string;
}

export const ArtistChipList = ({ artists }: ArtistChipListProps) => (
	<Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
		{artists.split(",").map((artist) => (
			<Chip
				key={artist.trim()}
				label={artist.trim()}
				size="small"
				variant="outlined"
			/>
		))}
	</Box>
);
