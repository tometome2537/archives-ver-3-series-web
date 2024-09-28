"use client";

import SuperSearchBar, {
    type SearchSuggestion,
    type InputValueSearchSuggestion,
    type CategoryId,
} from "@/components/Navbar/SuperSearchBar";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Box, ButtonBase, Collapse, Stack, Typography } from "@mui/material";
import { type Dispatch, type SetStateAction, useState } from "react";

interface LimitedSuperSearchProps {
    label: string;
    suggestions: SearchSuggestion[];
    inputValue: InputValueSearchSuggestion[];
    setInputValue: Dispatch<SetStateAction<InputValueSearchSuggestion[]>>;
    categoryId: CategoryId;
    onChange?: () => void;
}

// 検索候補
const ActorSuggestions: SearchSuggestion[] = [
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
    // {
    //     label: "ぷらそにか",
    //     value: "UCZx7esGXyW6JXn98byfKEIA",
    //     categoryId: "YouTubeChannel",
    //     categoryLabel: "YouTubeチャンネル",
    // },
    {
        sort: 100,
        label: "ぷらそにか東京",
        value: "ぷらそにか東京",
        categoryId: "organization",
        categoryLabel: "組織",
    },
];

const LimitedSuperSearch: React.FC<LimitedSuperSearchProps> = ({
    label,
    suggestions,
    inputValue,
    setInputValue,
    categoryId,
    onChange,
}) => {
    const filteredInputValues = inputValue.filter(
        (x) => x.categoryId === categoryId,
    );

    const handleSetInputValues = (values: InputValueSearchSuggestion[]) => {
        setInputValue([
            ...inputValue.filter((x) => x.categoryId !== categoryId),
            ...values,
        ]);
    };
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Box>
            <ButtonBase
                sx={{ py: 1, mb: 1 }}
                onClick={() => setIsOpen(isOpen === false)}
            >
                <Typography variant="h6">{label}</Typography>
                {isOpen ? (
                    <ExpandLess sx={{ ml: 6 }} />
                ) : (
                    <ExpandMore sx={{ ml: 6 }} />
                )}
            </ButtonBase>
            <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <SuperSearchBar
                    label="検索ワードを入力"
                    inputValues={filteredInputValues}
                    setInputValues={handleSetInputValues}
                    searchSuggestions={suggestions}
                    onChange={onChange}
                />
            </Collapse>
        </Box>
    );
};

export default function Home() {
    const [inputValue, setInputValue] = useState<InputValueSearchSuggestion[]>(
        [],
    );

    const getAllSuggestion = [...ActorSuggestions, ...OrganizationSuggestions];

    return (
        <Stack gap={2}>
            <Typography>全部</Typography>
            <SuperSearchBar
                label="検索ワードを入力"
                inputValues={inputValue}
                setInputValues={(values) => {
                    setInputValue([...values]);
                }}
                // 全ての予測を入れるのを忘れないように
                searchSuggestions={getAllSuggestion}
            />
            <LimitedSuperSearch
                label="出演者"
                suggestions={ActorSuggestions}
                inputValue={inputValue}
                setInputValue={setInputValue}
                categoryId="actor"
                onChange={() =>
                    setInputValue((prev) =>
                        prev.sort((a, b) => b.sort - a.sort),
                    )
                }
            />
            <LimitedSuperSearch
                label="組織"
                suggestions={OrganizationSuggestions}
                inputValue={inputValue}
                setInputValue={setInputValue}
                categoryId="organization"
                onChange={() =>
                    setInputValue((prev) =>
                        prev.sort((a, b) => b.sort - a.sort),
                    )
                }
            />
        </Stack>
    );
}
