"use client";

import UltraSuperSearchBar from "@/components/Navbar/UltraSuperSearchBar";
import type { ultraSuperSearchBarSearchSuggestion } from "@/components/Navbar/UltraSuperSearchBar";
import { type Dispatch, type SetStateAction,  useState } from "react";
import SuperSearchBar, {
    type SearchSuggestion,
    type InputValue,
    type additionalSearchSuggestions,
} from "@/components/Navbar/SuperSearchBar";

type CategoryId = "actor" | "organization" | "YouTubeChannel" | "text";

// 検索候補
const searchSuggestion: ultraSuperSearchBarSearchSuggestion[] = [
    {
        sort: 99,
        label: "幾田りら",
        value: "幾田りら",
        categoryId: "actor",
        categoryLabel: "出演者",
        categoryLabelSecond: "ぷらそにか東京",
    },
    {
        sort: 99,
        label: "小玉ひかり",
        value: "小玉ひかり",
        categoryId: "actor",
        categoryLabel: "出演者",
        categoryLabelSecond: "ぷらそにか東京",
    },
    {
        sort: 99,
        label: "HALDONA",
        value: "遥河",
        categoryId: "actor",
        categoryLabel: "出演者",
        categoryLabelSecond: "ぷらそにか東京",
    },
    {
        sort: 99,
        label: "けちゃこ",
        value: "けちゃこ",
        categoryId: "actor",
        categoryLabel: "出演者",
        categoryLabelSecond: "ぷらそにか北海道",
    },
    {
        sort: 100,
        label: "ぷらそにか",
        value: "ぷらそにか",
        categoryId: "organization",
        categoryLabel: "アーティストグループ",
    },
    {
        sort: 100,
        label: "ぷらそにか東京",
        value: "ぷらそにか東京",
        categoryId: "organization",
        categoryLabel: "アーティストグループ",
    },
    {
        sort: 100,
        label: "YOASOBI",
        value: "YOASOBI",
        categoryId: "organization",
        categoryLabel: "アーティストグループ",
    },
    {
        sort: 100,
        label: "株式会社ソニー・ミュージックエンタテインメント",
        value: "株式会社ソニー・ミュージックエンタテインメント",
        categoryId: "organization",
        categoryLabel: "会社",
    },
    {
        label: "ぷらそにか",
        value: "UCZx7esGXyW6JXn98byfKEIA",
        imgSrc: "https://yt3.ggpht.com/ytc/AIdro_lB6NxMtujj7oK0See-TGPL5eq-TjowmK6DFSjgLyCj0g=s88-c-k-c0x00ffffff-no-rj",
        categoryId: "YouTubeChannel",
        categoryLabel: "YouTubeチャンネル",
    },
    {
        label: "ぷらそにか - Topic",
        value: "UC3tYTei6p55gWg2rr0g4ybQ",
        categoryId: "YouTubeChannel",
        categoryLabel: "YouTubeトピックチャンネル",
        // categoryLabelSecond: "YouTubeトピックチャンネル",
    },
    {
        sort: 99,
        label: "日付芸人 20240101",
        value: "日付芸人",
        categoryId: "actor",
        categoryLabel: "出演者",
        categoryLabelSecond: "日付の一族",
    },
];
// テキストの追加カテゴリー
const textSuggestionCategory: additionalSearchSuggestions[] = [
    {
        // カテゴリーのID
        categoryId: "title",
        // カテゴリーのラベル(表示に使用)
        categoryLabel: "タイトル",
    },
    {
        categoryId: "description",
        categoryLabel: "概要欄",
    },
];
// 日付入力を許可する。
const dateSuggestionCategory: additionalSearchSuggestions[] = [
    {
        // カテゴリーのID
        categoryId: "since",
        // カテゴリーのラベル(表示に使用)
        categoryLabel: "開始日",
    },
    {
        categoryId: "until",
        categoryLabel: "終了日",
    },
];

// 分ける項目
const limitSuperSearchCategory = [
    { categoryId: "actor", categoryLabel: "出演者" },
    {
        categoryId: "organization",
        categoryLabel: "組織",
    },
    {
        categoryId: "YouTubeChannel",
        categoryLabel: "YouTubeチャンネル",
    },
];

export default function Home() {
    // 入力された値
    const [inputValue, setInputValue] = useState<InputValue[]>(
        [],
    );
    return (
        <UltraSuperSearchBar
            inputValue={inputValue}
            setInputValue={setInputValue}
            searchSuggestion={searchSuggestion}
            textSuggestionCategory={textSuggestionCategory}
            dateSuggestionCategory={dateSuggestionCategory}
            limitSuperSearchCategory={limitSuperSearchCategory}
        />
    );
}
