"use client";

import { type PaletteMode, createTheme } from "@mui/material";

export const lightTheme = createTheme({
	palette: {
		mode: "light", // 状態に基づいてライトまたはダークモードを選択
		// primaryはアプリケーションの主要な色で、最も頻繁に使われる色
		primary: {
			// メインカラー（ライトモードでは特定の色、ダークモードでは別の色を使用）
			main: "#167c3b",
			// メインカラーの明るいバージョン（補助的な要素やホバー状態などに使用）
			light: "#449662",
			// メインカラーの暗いバージョン（アクティブ状態や強調表示に使用）
			dark: "#0F5629",
			// テキストカラー（ダークモードでもホワイト）
			contrastText: "#FFFFFF",
		},
		// secondaryはアプリケーションの2番目に主要な色で、最も頻繁に使われる色はアプリケーションの主要な色で、最も頻繁に使われる色
		secondary: {
			main: "#6A8B9C",
			light: "#87A2AF",
			dark: "#4A616D",
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
			default: "#FFFFFF",
			paper: "#f0f0f0", // コンテンツの背景色
		},
		// テキストカラー
		text: {
			primary: "#000000", // プライマリテキストカラー
			secondary: "#555555", // セカンダリテキストカラー
		},
	},
});

export const darkTheme = createTheme({
	palette: {
		mode: "dark", // 状態に基づいてライトまたはダークモードを選択
		// primaryはアプリケーションの主要な色で、最も頻繁に使われる色
		primary: {
			// メインカラー（ライトモードでは特定の色、ダークモードでは別の色を使用）
			main: "#167c3b",
			// メインカラーの明るいバージョン（補助的な要素やホバー状態などに使用）
			light: "#449662",
			// メインカラーの暗いバージョン（アクティブ状態や強調表示に使用）
			dark: "#0F5629",
			// テキストカラー（ダークモードでもホワイト）
			contrastText: "#FFFFFF",
		},
		// secondaryはアプリケーションの2番目に主要な色で、最も頻繁に使われる色はアプリケーションの主要な色で、最も頻繁に使われる色
		secondary: {
			main: "#6A8B9C",
			light: "#87A2AF",
			dark: "#4A616D",
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
			default: "#121212",
			paper: "#1e1e1e", // コンテンツの背景色
		},
		// テキストカラー
		text: {
			primary: "#FFFFFF", // プライマリテキストカラー
			secondary: "#BBBBBB", // セカンダリテキストカラー
		},
	},
});
