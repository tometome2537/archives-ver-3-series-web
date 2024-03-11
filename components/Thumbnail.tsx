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
import { MouseEventHandler } from "react";

type Props = {
  videoId: string;
  title: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
};

export default function Thumbnail({ videoId, title, onClick }: Props) {
  return (
    // <div className="w-80 rounded-lg bg-white dark:border-gray-700 dark:bg-gray-800">
    //   <button key={title} data-videoId={videoId} onClick={onClick}>
    //     <div className="overflow-hidden">
    //       <Image
    //         //sddefault
    //         //hqdefault
    //         src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
    //         width={480}
    //         height={360}
    //         alt={`https://youtube.com/watch?v=${videoId}`}
    //         className="size-full rounded-t-lg object-cover transition-all duration-300 hover:scale-110"
    //       />
    //     </div>
    //     <p className="my-1 ml-2 line-clamp-2 text-left font-normal text-gray-700 dark:text-gray-400">
    //       {title}
    //     </p>
    //   </button>
    // </div>
    <Grid xs={12} sm={6} md={3}>
      <Card sx={{ maxWidth: 480 }}>
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
              }}
              component="img"
              width={480}
              height={360}
              image={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
              alt=""
            />
          </Box>
          <CardContent>
            <Typography
              gutterBottom
              variant="h6"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: "2",
                WebkitBoxOrient: "vertical",
              }}
              component="div"
            >
              {title}
            </Typography>
            {/* <Typography variant="body2" color="text.secondary">
              Lizards are a widespread group of squamate reptiles, with over
              6,000 species, ranging across all continents except Antarctica
            </Typography> */}
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
}
