"use client";

import { Box, Link, Typography } from "@mui/material";
import Image from "next/image";
import type { MouseEventHandler } from "react";

type AlbumProps = {
    title?: string;
    onClick?: MouseEventHandler<HTMLElement>;
    imgSrc?: string;
};

export default function Album(props: AlbumProps) {
    return (
        <Box
            style={{
                // display: "block",
                minWidth: "18vw",
                margin: "0 1vw",
                cursor: "pointer",
                textAlign: "center",
            }}
            onClick={props.onClick}
        >
            <Image
                key={props.imgSrc}
                src={props.imgSrc ?? ""}
                alt={props.title ?? ""}
                width={160} // アスペクト比のための幅
                height={160} // アスペクト比のための高さ
                style={{
                    width: "100%",
                    height: "auto",
                    objectFit: "contain",
                    borderRadius: "10%",
                }}
            />
            <Typography
                sx={{
                    maxWidth: "30ch",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    marginTop: 1,
                    textAlign: "center",
                }}
            >
                {props.title ?? "不明"}
            </Typography>
        </Box>
    );
}
