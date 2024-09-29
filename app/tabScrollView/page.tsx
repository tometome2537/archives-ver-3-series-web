"use client";

import { useRef, useEffect, useState } from "react";

export default function tabScrollView() {
    // スクロール対象のHTMLが入る
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    // 左からどのくらいスクロールされているか(px)
    const [scrollLeftPosition, setScrollLeftPosition] = useState<number>(0);

    // HTMLを監視するコードを追加
    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        let scrollTimeout: NodeJS.Timeout;

        if (scrollContainer) {
            const handleScroll = () => {
                setScrollLeftPosition(scrollContainer.scrollLeft);

                // スクロールが終了した後にhandleScrollEndを実行
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    handleScrollEnd();
                }, 150); // 150ミリ秒後にスクロールが終了したとみなす
            };

            scrollContainer.addEventListener("scroll", handleScroll);

            return () => {
                clearTimeout(scrollTimeout);
                scrollContainer.removeEventListener("scroll", handleScroll);
            };
        }
    }, []);

    const positions: { [key: string]: number } = {
        section1: 0,
        section2: window ? window.innerWidth : 1000,
        section3: window ? window.innerWidth * 2 : 2000,
    };

    // 名前をもとに適切な位置にスクロール
    const scrollToPositionFromName = (name: string) => {
        if (positions[name] !== undefined) {
            scrollToPosition(positions[name]);
        } else {
            console.error(`Invalid section name: ${name}`);
        }
    };

    // 指定された位置(px)にスクロールする関数
    const scrollToPosition = (number: number) => {
        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
            scrollContainer.scrollTo({
                left: number,
                behavior: "smooth",
            });
        }
    };

    // スクロールされた位置が不適切な場合に、適切な位置を計算してスクロールさせる。
    const handleScrollEnd = (): void => {
        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
            const nowPosition = scrollContainer.scrollLeft;
            const closestPosition = Object.values(positions).reduce(
                (prev, curr) =>
                    Math.abs(curr - nowPosition) < Math.abs(prev - nowPosition)
                        ? curr
                        : prev,
            );
            scrollToPosition(closestPosition);
        }
    };

    return (
        <div>
            <button
                type="button"
                onClick={() => scrollToPositionFromName("section1")}
            >
                Go to Section 1
            </button>
            <button
                type="button"
                onClick={() => scrollToPositionFromName("section2")}
            >
                Go to Section 2
            </button>
            <button
                type="button"
                onClick={() => scrollToPositionFromName("section3")}
            >
                Go to Section 3
            </button>
            <button type="button" onClick={undefined}>
                スクロール位置：{JSON.stringify(scrollLeftPosition)}
            </button>

            <div
                ref={scrollContainerRef}
                style={{
                    width: "100vw",
                    height: "100vh",
                    overflowX: "scroll",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        width: "300vw",
                    }}
                >
                    <div
                        style={{
                            width: "100vw",
                            height: "100vh",
                            backgroundColor: "lightblue",
                        }}
                    >
                        Section 1
                    </div>
                    <div
                        style={{
                            width: "100vw",
                            height: "100vh",
                            backgroundColor: "lightgreen",
                        }}
                    >
                        Section 2
                    </div>
                    <div
                        style={{
                            width: "100vw",
                            height: "100vh",
                            backgroundColor: "lightcoral",
                        }}
                    >
                        Section 3
                    </div>
                </div>
            </div>
        </div>
    );
}
