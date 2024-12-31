"use client";

import { Box, Link, Typography } from "@mui/material";
import Image from "next/image";
import type { MouseEventHandler } from "react";

type AlbumProps = {
    title?: string;
    onClick?: MouseEventHandler<HTMLElement>;
    imgSrc?: string;
    style?: React.CSSProperties; // 外部からスタイルを受け取る（オプション）
    year?: string;
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
                    borderRadius: "0.6em",
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
            {/* リリース年を表示 */}
            <Typography
                variant="caption"
                color="textSecondary"
                sx={{ marginTop: 0.1, textAlign: "center" }}
            >
                {props.year && props.year}
            </Typography>
        </Box>
    );
}
