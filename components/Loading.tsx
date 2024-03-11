import { Box, CircularProgress } from "@mui/material";

export default function Loading() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{ my: 2 }}
    >
      <CircularProgress size={60} />
    </Box>
  );
}
