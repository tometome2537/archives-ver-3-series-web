"use client";

import { DatePicker } from "@/components/Form/DatePicker";
import SuperSearchBar, {
    type SearchSuggestion,
    type InputValueSearchSuggestion,
    type CategoryId,
} from "@/components/Navbar/SuperSearchBar";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import {
    Box,
    ButtonBase,
    Checkbox,
    Collapse,
    Stack,
    Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { type Dispatch, type SetStateAction, use, useState } from "react";

interface LimitedSuperSearchProps {
    suggestions: SearchSuggestion[];
    inputValue: InputValueSearchSuggestion[];
    setInputValue: Dispatch<SetStateAction<InputValueSearchSuggestion[]>>;
    categoryId: CategoryId;
    onChange?: () => void;
}

interface LimitDateProps {
    id: string;
    label: string;
    value: dayjs.Dayjs | null;
    setValue: (newValue: dayjs.Dayjs | null) => void;
    isEnable: boolean;
    setIsEnable: (newValue: boolean) => void;
}

const LimitDatePicker: React.FC<LimitDateProps> = ({
    id,
    label,
    value,
    setValue,
    isEnable,
    setIsEnable,
}) => {
    return (
        <Stack direction="row" alignItems="center" spacing={1}>
            <Checkbox
                sx={{ flexShrink: 0 }}
                onChange={(x) => setIsEnable(x.target.checked)}
            />
            <DatePicker
                id={id}
                label={label}
                value={value}
                setValue={setValue}
                disabled={!isEnable}
            />
        </Stack>
    );
};

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
    {
        sort: 100,
        label: "ぷらそにか東京",
        value: "ぷらそにか東京",
        categoryId: "organization",
        categoryLabel: "組織",
    },
    // {
    //     label: "ぷらそにか",
    //     value: "UCZx7esGXyW6JXn98byfKEIA",
    //     categoryId: "YouTubeChannel",
    //     categoryLabel: "YouTubeチャンネル",
    // },
];

const LimitedSuperSearch: React.FC<LimitedSuperSearchProps> = ({
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

    return (
        <SuperSearchBar
            label="検索ワードを入力"
            inputValues={filteredInputValues}
            setInputValues={handleSetInputValues}
            searchSuggestions={suggestions}
            onChange={onChange}
        />
    );
};

export default function Home() {
    const [inputValue, setInputValue] = useState<InputValueSearchSuggestion[]>(
        [],
    );

    const getAllSuggestion = [...ActorSuggestions, ...OrganizationSuggestions];
    const [isOpen, setIsOpen] = useState(false);

    const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(dayjs());
    const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(dayjs());
    const [isStartDateEnable, setIsStartDateEnable] = useState(false);
    const [isEndDateEnable, setIsEndDateEnable] = useState(false);

    return (
        <Box>
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

            <ButtonBase
                sx={{ py: 1, mb: 1 }}
                onClick={() => setIsOpen(isOpen === false)}
            >
                <Typography>閉じれるよ</Typography>
                {isOpen ? (
                    <ExpandLess sx={{ ml: 6 }} />
                ) : (
                    <ExpandMore sx={{ ml: 6 }} />
                )}
            </ButtonBase>
            <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <Stack gap={1}>
                    <Box>
                        <Typography>出演者</Typography>
                        <LimitedSuperSearch
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
                    </Box>

                    <Box>
                        <Typography>組織</Typography>

                        <LimitedSuperSearch
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
                    </Box>
                </Stack>
            </Collapse>
            <Stack direction="row">
                <LimitDatePicker
                    id="start"
                    label="開始日"
                    value={startDate}
                    setValue={setStartDate}
                    isEnable={isStartDateEnable}
                    setIsEnable={setIsStartDateEnable}
                />
                <LimitDatePicker
                    id="start"
                    label="開始日"
                    value={startDate}
                    setValue={setEndDate}
                    isEnable={isEndDateEnable}
                    setIsEnable={setIsEndDateEnable}
                />
            </Stack>
            <p>
                {isStartDateEnable && startDate?.format("YYYY年MM月DD日")}
                {isStartDateEnable || isEndDateEnable ? "〜" : "日付指定ナシ"}
                {isEndDateEnable && endDate?.format("YYYY年MM月DD日")}
            </p>
        </Box>
    );
}
