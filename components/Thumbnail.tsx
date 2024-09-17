"use client";

import {
  Box,
  CardActionArea,
  CardContent,
  CardMedia,
  Link,
  Typography,
} from "@mui/material";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Unstable_Grid2";
import Image from "next/image";
import React, { MouseEventHandler, useState, useEffect } from "react";



export interface NoteContentProps {
  content: string;
}
// テキスト中の #で始まる文章をリンクにする関数
const NoteContent: React.FC<NoteContentProps> = ({ content }) => {
  function findHashtags(searchText: string): [string[], string[]] {
    const regexp = /#[^#\s]*/g;
    const hashtags = searchText.match(regexp) || [];
    const result = searchText.split(regexp);
    if (result.length > 0 && result[result.length - 1] === "") {
      result.pop();
    }
    return [result, hashtags];
  }

  const [results, hashtags] = findHashtags(content);

  const hashtagLinks = hashtags.map((x, index) => (
    <Link
      href="#"
      key={index}
      color="primary"
      sx={{ display: "inline", paddingRight: 1 }}
    >
      {x}
    </Link>
  ));

  if (results === null && hashtagLinks === null) {
    return <span>{content}</span>;
  }

  if (results === null) {
    return <span>{hashtagLinks}</span>;
  }

  if (hashtagLinks === null) {
    return <span> {content}</span>;
  }

  const merged: React.ReactNode[] = [];
  const maxLength = Math.max(results.length, hashtagLinks.length);

  for (let i = 0; i < maxLength; i++) {
    if (i < results.length) {
      if (results[i] != null && results[i].trim() != "") {
        merged.push(results[i]);
      }
    }
    if (i < hashtagLinks.length) {
      merged.push(hashtagLinks[i]);
    }
  }

  return <span>{merged}</span>;
};

type ThumbnailProps = {
  thumbnailType?: string;
  videoId: string;
  title: string;
  // onClick?: MouseEventHandler<HTMLButtonElement>;
  onClick?: MouseEventHandler<HTMLElement>;
};

export default function Thumbnail({ thumbnailType, videoId, title, onClick }: ThumbnailProps) {
  const [raised, setRaised] = useState<boolean>();



  if (thumbnailType === "card") {
    return (
      <Grid xs={12} sm={6} md={3}>
        <Card
          sx={{ maxWidth: 480 }}
          onMouseOver={() => setRaised(true)}
          onMouseOut={() => setRaised(false)}
          raised={raised}
        >
          <CardActionArea onClick={onClick} data-id={videoId}>
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
                alt={title ? "Thumbnail of " + title : ""}
              />
            </Box>
            <CardContent>
              <Typography
                gutterBottom
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  height: "5ch",
                  WebkitLineClamp: "2",
                  WebkitBoxOrient: "vertical",
                }}
              >
                <NoteContent content={title} />
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    )
  }

  return (
    <div onClick={onClick ? onClick : undefined} data-videoId={videoId} data-title={title}>
      {/* Image を使用すると loading="lazy" が自動で使用される */}
      <div style={{
        display:"flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        <Image
          src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
          alt={title ? "Thumbnail of " + title : ""}
          width={320}
          height={180}
          style={{ objectFit: "contain", borderRadius: "1.2em" }}
        />
        <div
          style={{
            /* 要素に幅を持たせるために必要 */
            // display: "inline-block",
            // 確保する文字数
            width: "30ch",
            // 改行を防ぐ
            // whiteSpace: "nowrap",
            /* 溢れた文字を隠す  */
            /* overflow: hidden;      */
            /* 長すぎる場合に "..." を付ける  */
            textOverflow: "ellipsis",
          }}
        >
          {title}
        </div>
      </div>
    </div>
  );
}
