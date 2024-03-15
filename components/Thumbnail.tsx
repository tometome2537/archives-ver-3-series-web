"use client";

import {
  Box,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Unstable_Grid2";
import { MouseEventHandler, useState } from "react";

type Props = {
  videoId: string;
  title: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
};

export default function Thumbnail({ videoId, title, onClick }: Props) {
  const [raised, setRaised] = useState<boolean>();

  return (
    <Grid xs={12} sm={6} md={3}>
      <Card
        sx={{ maxWidth: 480 }}
        onMouseOver={() => setRaised(true)}
        onMouseOut={() => setRaised(false)}
        raised={raised}
      >
        <CardActionArea>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              paddingTop: "56.25%",
              overflow: "hidden",
            }}
          >
            {/* https://stackoverflow.com/questions/77707474/responsive-image-sizing-in-react-with-material-ui-how-to-dynamically-adapt-imag */}
            <CardMedia
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: `transform ${100}ms`,
                transform: `scale(${raised ? 1.05 : 1})`,
              }}
              component="img"
              width={480}
              height={360}
              image={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
              alt={`Thumbnail of ${videoId}.`}
            />
          </Box>
          <CardContent>
            <Typography
              gutterBottom
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: "2",
                WebkitBoxOrient: "vertical",
              }}
            >
              {title}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
}
