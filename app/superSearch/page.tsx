"use client";

import { DatePicker } from "@/components/Form/DatePicker";
import SuperSearchBar, {
    type SearchSuggestion,
    type InputValueSearchSuggestion,
    type dateSuggestion,
} from "@/components/Navbar/SuperSearchBar";
import { Category } from "@mui/icons-material";
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

// ウルトラスーパーサーチバーの検索候補
interface ultraSuperSearchBarSearchSuggestion extends SearchSuggestion {
    // LimitSuperSearchBarで使用します。
    categoryLabelSecond?: string;
}

type CategoryId = "actor" | "organization" | "YouTubeChannel" | "text";

interface LimitedSuperSearchProps {
    searchSuggestions: ultraSuperSearchBarSearchSuggestion[];
    inputValue: InputValueSearchSuggestion[];
    setInputValue: Dispatch<SetStateAction<InputValueSearchSuggestion[]>>;
    categoryId: CategoryId;
    onChange?: () => void;
}

const LimitedSuperSearch: React.FC<LimitedSuperSearchProps> = ({
    searchSuggestions,
    inputValue,
    setInputValue,
    categoryId,
    onChange,
}) => {
    // 入力値をcategoryIdが同じのに絞る
    const filteredInputValues = inputValue.filter(
        (x) => x.categoryId === categoryId,
    );
    // 他のサーチバーで入力された値を消さないように、入力された値を出力する。
    const handleSetInputValues = (values: InputValueSearchSuggestion[]) => {
        setInputValue([
            ...inputValue.filter((x) => x.categoryId !== categoryId),
            ...values,
        ]);
    };
    // 検索候補をcategoryIdが同じのに絞る
    // ディープカット
    const deepCutSuggestions: ultraSuperSearchBarSearchSuggestion[] =
        JSON.parse(JSON.stringify(searchSuggestions));
    const limitSearchSuggestion = deepCutSuggestions.filter(
        (item: ultraSuperSearchBarSearchSuggestion) => {
            if (item.categoryId === categoryId) {
                if (item.categoryLabelSecond) {
                    // LimitSuperSearchBarでは categoryLabelSecond を使用する。
                    item.categoryLabel = item.categoryLabelSecond;
                }
                return item;
            }
        },
    );

    return (
        <SuperSearchBar
            dateSuggestionCategory={dateSuggestionCategory}
            inputValues={filteredInputValues}
            setInputValues={handleSetInputValues}
            searchSuggestions={limitSearchSuggestion}
            onChange={onChange}
        />
    );
};

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
const dateSuggestionCategory: dateSuggestion[] = [
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

// 検索候補
const searchSuggestionList: ultraSuperSearchBarSearchSuggestion[] = [
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

export default function Home() {
    // 入力された値
    const [inputValue, setInputValue] = useState<InputValueSearchSuggestion[]>(
        [],
    );
    // 検索候補
    const [searchSuggestion, setSearchSuggestion] =
        useState<ultraSuperSearchBarSearchSuggestion[]>(searchSuggestionList);

    // 開いてるかどうか
    const [isOpen, setIsOpen] = useState(true);

    const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(dayjs());
    const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(dayjs());
    const [isStartDateEnable, setIsStartDateEnable] = useState(false);
    const [isEndDateEnable, setIsEndDateEnable] = useState(false);

    return (
        <Box>
            {JSON.stringify(inputValue)}
            {/* {JSON.stringify(searchSuggestion)} */}
            <Typography>全部</Typography>
            <SuperSearchBar
                inputValues={inputValue}
                dateSuggestionCategory={dateSuggestionCategory}
                // setInputValues={(values) => {
                //     setInputValue([...values]);
                // }}
                setInputValues={setInputValue}
                searchSuggestions={searchSuggestion}
            />

            <ButtonBase
                sx={{ py: 1, mb: 1 }}
                onClick={() => setIsOpen(isOpen === false)}
            >
                <Typography>閉じる</Typography>
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
                            searchSuggestions={searchSuggestion}
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
                            searchSuggestions={searchSuggestion}
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
                        label="終了日"
                        value={startDate}
                        setValue={setEndDate}
                        isEnable={isEndDateEnable}
                        setIsEnable={setIsEndDateEnable}
                    />
                </Stack>
                <p>
                    {isStartDateEnable && startDate?.format("YYYY年MM月DD日")}
                    {isStartDateEnable || isEndDateEnable
                        ? "〜"
                        : "日付指定ナシ"}
                    {isEndDateEnable && endDate?.format("YYYY年MM月DD日")}
                </p>
            </Collapse>
        </Box>
    );
}
