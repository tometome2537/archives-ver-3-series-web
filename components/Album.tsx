"use client";

import { Box, Typography } from "@mui/material";
import type { MouseEventHandler } from "react";

type AlbumProps = {
    title?: string;
    onClick?: MouseEventHandler<HTMLElement>;
    imgSrc?: string;
    style?: React.CSSProperties; // 外部からスタイルを受け取る（オプション）
};

export default function Album(props: AlbumProps) {
    return (
        <Box
            style={{
                ...{
                    // display: "block",
                    minWidth: "18vw",
                    margin: "0 1vw",
                    cursor: "pointer",
                    textAlign: "center",
                },
                ...props.style,
            }}
            onClick={props.onClick}
        >
            <img
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
                    // maxWidth: "30ch",
                    fontSize: "0.5",
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
