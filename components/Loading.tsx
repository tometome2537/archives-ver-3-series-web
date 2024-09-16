import { Box, CircularProgress } from "@mui/material";

export default function Loading() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{ width: "100%", height: "100%" }}
    >
      {/* ↓ 親要素を拡張させないサイズでCircularProgressを表示する必要がある。 */}
      <CircularProgress sx={{ width: "30%", height: "30%" }} />
    </Box>
  );
}
