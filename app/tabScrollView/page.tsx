"use client";

import { Box, Button, Typography } from "@mui/material";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";

const view: { id: string; children: React.ReactNode }[] = [
    {
        id: "section1",
        children: (
            <Box
                style={{
                    width: "100%",
                    height: "100px",
                    backgroundColor: "lightblue",
                }}
            >
                <Typography variant="h1">Section 1</Typography>
                <Typography variant="h1">Section 1</Typography>
                <Typography variant="h1">Section 1</Typography>
                <Typography variant="h1">Section 1</Typography>
                <Typography variant="h1">Section 1</Typography>
                <Typography variant="h1">Section 1</Typography>
                <Typography variant="h1">Section 1</Typography>
                <Typography variant="h1">Section 1</Typography>
                <Typography variant="h1">Section 1</Typography>
                <Typography variant="h1">Section 1</Typography>
                <Typography variant="h1">Section 1</Typography>
                <Typography variant="h1">Section 1</Typography>
                <Typography variant="h1">Section 1</Typography>
                <Typography variant="h1">Section 1</Typography>
                <Typography variant="h1">Section 1</Typography>
                <Typography variant="h1">Section 1</Typography>
                <Typography variant="h1">Section 1</Typography>
                <Typography variant="h1">Section 1</Typography>
                <Typography variant="h1">Section 1</Typography>
                <Typography variant="h1">Section 1</Typography>
                <Typography variant="h1">Section 1</Typography>
                <Typography variant="h1">Section 1</Typography>
                <Typography variant="h1">Section 1</Typography>
                <Typography variant="h1">Section 1</Typography>
                <Typography variant="h1">Section 1</Typography>
                <Typography variant="h1">Section 1</Typography>
                <Typography variant="h1">Section 1</Typography>
                <Typography variant="h1">Section 1</Typography>
                <Typography variant="h1">Section 1</Typography>
            </Box>
        ),
    },
    {
        id: "section2",
        children: (
            <Box
                style={{
                    width: "100",
                    height: "100px",
                    backgroundColor: "lightgreen",
                }}
            >
                <Typography variant="h1">Section 2</Typography>
            </Box>
        ),
    },
    {
        id: "section3",
        children: (
            <Box
                style={{
                    width: "100%",
                    height: "100px",
                    backgroundColor: "lightcoral",
                }}
            >
                <Typography variant="h1">Section 3</Typography>
            </Box>
        ),
    },
];

export default function tabScrollView() {
    // スクロール対象のHTMLが入る
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
    const [currentView, setCurrentView] = useState<number>(0);

    const scroll = useCallback(() => {
        scrollContainerRef.current?.scrollTo({
            left: currentView * windowWidth,
            top: 0,
            behavior: "smooth",
        });
    }, [currentView, windowWidth]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        scroll();
    }, [currentView]);

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;

        if (scrollContainer) {
            const handleScrollEnd = (event: Event) => {
                // setCurrentView(event.snapTargetBlock);
                console.log(event);
            };

            scrollContainer.addEventListener(
                "scrollsnapchange",
                handleScrollEnd,
            );

            return () => {
                scrollContainer.removeEventListener(
                    "scrollsnapchange",
                    handleScrollEnd,
                );
            };
        }
    }, []);

    // ウィンドウのリサイズを検知して、windowWidthを更新
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <Fragment>
            {view.map((x, index) => (
                <Button
                    key={x.id}
                    onClick={() => {
                        setCurrentView(index);
                    }}
                >
                    {x.id}
                </Button>
            ))}
            <Box
                ref={scrollContainerRef}
                sx={{
                    display: "flex",
                    height: "100vh",
                    overflowX: "scroll",
                    scrollSnapType: "x mandatory",
                }}
            >
                {view.map((x) => (
                    <Box
                        key={x.id}
                        sx={{
                            flexShrink: 0,
                            width: "100vw",
                            height: "100vh",
                            overflowY: "hidden",
                            scrollSnapAlign: "start",
                        }}
                    >
                        {x.children}
                    </Box>
                ))}
            </Box>
        </Fragment>
    );
}
