"use client";

import SuperSearchBar, {
    type SearchSuggestion,
    type InputValueSearchSuggestion,
} from "@/components/Navbar/SuperSearchBar";
import { Stack } from "@mui/material";
import { useState } from "react";

const PeopleSuggestions: SearchSuggestion[] = [
    {
        sort: 99,
        label: "幾田りら",
        value: "幾田りら",
        categoryId: "actor",
        categoryLabel: "出演者",
    },
    {
        sort: 99,
        label: "小玉ひかり",
        value: "小玉ひかり",
        categoryId: "actor",
        categoryLabel: "出演者",
    },
    {
        sort: 99,
        label: "HALDONA",
        value: "遥河",
        categoryId: "actor",
        categoryLabel: "出演者",
    },
];

const OrganizationSuggestions: SearchSuggestion[] = [
    {
        sort: 100,
        label: "ぷらそにか",
        value: "ぷらそにか",
        categoryId: "organization",
        categoryLabel: "組織",
    },
    {
        label: "ぷらそにか",
        value: "UCZx7esGXyW6JXn98byfKEIA",
        categoryId: "YouTubeChannel",
        categoryLabel: "YouTubeチャンネル",
    },
    {
        sort: 100,
        label: "ぷらそにか東京",
        value: "ぷらそにか東京",
        categoryId: "organization",
        categoryLabel: "組織",
    },
];

export default function Home() {
    // 検索候補
    /*,
        {
            sort: 100,
            label: "ぷらそにか",
            value: "ぷらそにか",
            categoryId: "organization",
            categoryLabel: "組織",
        },
        {
            label: "ぷらそにか",
            value: "UCZx7esGXyW6JXn98byfKEIA",
            categoryId: "YouTubeChannel",
            categoryLabel: "YouTubeチャンネル",
        },
        {
            sort: 100,
            label: "ぷらそにか東京",
            value: "ぷらそにか東京",
            categoryId: "organization",
            categoryLabel: "組織",
        },
        {
            label: "ながー４５６７８９１２３４５６い文字列",
            value: "長いテキスト",
            categoryId: "text",
            categoryLabel: "テキスト",
        },
        {
            label: "ながいカテゴリラベル",
            value: "長いカテゴリラベル",
            categoryId: "text",
            categoryLabel: "ながー４５６７８９１２３４５６いカテゴリラベル",
        }, */
    const [inputValue, setInputValue] = useState<InputValueSearchSuggestion[]>(
        [],
    );
    return (
        <Stack gap={2}>
            <SuperSearchBar
                label="検索ワードを入力"
                inputValues={inputValue}
                setInputValues={setInputValue}
                searchSuggestions={SearchSuggestions}
            />
            <SuperSearchBar
                label="検索ワードを入力"
                inputValues={inputValue}
                setInputValues={setInputValue}
                searchSuggestions={SearchSuggestions}
            />
            <SuperSearchBar
                label="検索ワードを入力"
                inputValues={inputValue}
                setInputValues={setInputValue}
                searchSuggestions={SearchSuggestions}
            />
        </Stack>
    );
}
