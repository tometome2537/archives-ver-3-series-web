"use client";

import Main from "@/components/Main";
import { type PaletteMode, ThemeProvider, createTheme } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { useEffect, useMemo, useState } from "react";

export default function Home() {
  // テーマの状態を保持（初期はライトモード）
  const [mode, setMode] = useState<PaletteMode | undefined>("light");

  // ダークモードとライトモードの切り替え関数
  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  // 端末の設定が変わったときにモードを変更
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e: any) => {
        setMode(e.matches ? "dark" : "light");
      };

      // イベントリスナーでモード変更を検知
      mediaQuery.addEventListener("change", handleChange);

      // クリーンアップ関数でリスナーを解除
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  // テーマ設定をメモ化し、モードが変更されたときに再生成
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: mode, // 状態に基づいてライトまたはダークモードを選択
          // primaryはアプリケーションの主要な色で、最も頻繁に使われる色
          primary: {
            // メインカラー（ライトモードでは特定の色、ダークモードでは別の色を使用）
            main: mode === "light" ? "#167c3b" : "#167c3b",
            // メインカラーの明るいバージョン（補助的な要素やホバー状態などに使用）
            light: mode === "light" ? "#449662" : "#449662",
            // メインカラーの暗いバージョン（アクティブ状態や強調表示に使用）
            dark: mode === "light" ? "#0F5629" : "#0F5629",
            // テキストカラー（ダークモードでもホワイト）
            contrastText: "#FFFFFF",
          },
          // secondaryはアプリケーションの2番目に主要な色で、最も頻繁に使われる色はアプリケーションの主要な色で、最も頻繁に使われる色
          secondary: {
            main: mode === "light" ? "#6A8B9C" : "#6A8B9C",
            light: mode === "light" ? "#87A2AF" : "#87A2AF",
            dark: mode === "light" ? "#4A616D" : "#4A616D",
            contrastText: "#FFFFFF",
          },
          error: {
            main: "#BA1A1A",
            light: "#C74747",
            dark: "#821212",
          },
          warning: {
            main: "#FF9800",
          },
          // 背景色
          background: {
            default: mode === "light" ? "#FFFFFF" : "#121212",
            paper: mode === "light" ? "#f0f0f0" : "#1e1e1e", // コンテンツの背景色
          },
          // テキストカラー
          text: {
            primary: mode === "light" ? "#000000" : "#FFFFFF", // プライマリテキストカラー
            secondary: mode === "light" ? "#555555" : "#BBBBBB", // セカンダリテキストカラー
          },
        },
      }),
    [mode], // `mode`が変わるたびにテーマを再生成
  );

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Main setSiteTheme={setMode} />
      </ThemeProvider>
    </>
  );
}
