"use client";

import { DatePicker } from "@/components/Form/DatePicker";
import SuperSearchBar, {
    type SearchSuggestion,
    type InputValueSearchSuggestion,
    type additionalSearchSuggestions,
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

export interface LimitedSuperSearchProps {
    searchSuggestions?: ultraSuperSearchBarSearchSuggestion[];
    // 外せない入力値を定義
    fixedOptionValues?: string[];
    availableCategoryIds?: string[];
    textSuggestionCategory?: additionalSearchSuggestions[];
    dateSuggestionCategory?: additionalSearchSuggestions[];
    inputValue: InputValueSearchSuggestion[];
    setInputValue: Dispatch<SetStateAction<InputValueSearchSuggestion[]>>;
    textFieldLabel?: string;
    categoryId: string;
    onChange?: () => void;
}

// スーパーサーチバーの範囲を制限するためのスーパーサーチバー
const LimitedSuperSearch: React.FC<LimitedSuperSearchProps> = ({
    searchSuggestions,
    fixedOptionValues,
    availableCategoryIds,
    textSuggestionCategory,
    dateSuggestionCategory,
    inputValue,
    setInputValue,
    textFieldLabel,
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
            textFieldLabel={textFieldLabel}
            textFieldPlaceholder={
                "キーワードを入力し、候補の中から該当する選択肢をタップ"
            }
            availableCategoryIds={availableCategoryIds}
            textSuggestionCategory={textSuggestionCategory}
            dateSuggestionCategory={dateSuggestionCategory}
            inputValues={filteredInputValues}
            setInputValues={handleSetInputValues}
            searchSuggestions={limitSearchSuggestion}
            fixedOptionValues={fixedOptionValues}
            onChange={onChange}
        />
    );
};

// ウルトラスーパーサーチバーの検索候補の型
export interface ultraSuperSearchBarSearchSuggestion extends SearchSuggestion {
    // LimitSuperSearchBarで使用します。
    categoryLabelSecond?: string;
}

type UltraSuperSearchBarSearchBarProps = {
    inputValue: InputValueSearchSuggestion[];
    setInputValue: Dispatch<SetStateAction<InputValueSearchSuggestion[]>>;
    // 検索候補
    searchSuggestion?: ultraSuperSearchBarSearchSuggestion[];
    // 外せない入力値を定義
    fixedOptionValues?: string[];

    availableCategoryIds?: string[];
    // 入力するテキストのカテゴリー
    textSuggestionCategory?: additionalSearchSuggestions[];
    // 入力する日付のカテゴリー
    dateSuggestionCategory?: additionalSearchSuggestions[];
    // 表示するリミットスーパーサーチバーの定義
    limitSuperSearchCategory?: additionalSearchSuggestions[];
};

export default function UltraSuperSearchBar(
    props: UltraSuperSearchBarSearchBarProps,
) {
    // 開いてるかどうか
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Box>
            {/* {JSON.stringify(props.inputValue)} */}
            {/* {JSON.stringify(searchSuggestion)} */}
            {/* <Typography>全部</Typography> */}
            <SuperSearchBar
                inputValues={props.inputValue}
                availableCategoryIds={props.availableCategoryIds}
                textSuggestionCategory={props.textSuggestionCategory}
                dateSuggestionCategory={props.dateSuggestionCategory}
                // setInputValues={(values) => {
                //     setInputValue([...values]);
                // }}
                setInputValues={props.setInputValue}
                searchSuggestions={props.searchSuggestion}
                fixedOptionValues={props.fixedOptionValues}
            />
            {props.limitSuperSearchCategory &&
                props.limitSuperSearchCategory.length !== 0 && (
                    <ButtonBase
                        sx={{ py: 0.5, mb: 0.5 }} // パディングとマージンを小さく
                        onClick={() => setIsOpen(isOpen === false)}
                    >
                        <Typography variant="body2">
                            {isOpen ? "閉じる" : "開く"}
                        </Typography>
                        {isOpen ? (
                            <ExpandLess sx={{ ml: 4, fontSize: "small" }} />
                        ) : (
                            <ExpandMore sx={{ ml: 4, fontSize: "small" }} />
                        )}
                    </ButtonBase>
                )}

            {props.limitSuperSearchCategory &&
                props.limitSuperSearchCategory.length !== 0 &&
                props.limitSuperSearchCategory.map((v, index) => (
                    <Collapse
                        key={v.categoryId}
                        in={isOpen}
                        timeout="auto"
                        unmountOnExit
                    >
                        <Stack gap={1}>
                            <Box>
                                {/* <Typography>{v.categoryLabel}</Typography> */}
                                <LimitedSuperSearch
                                    textFieldLabel={v.categoryLabel}
                                    searchSuggestions={props.searchSuggestion}
                                    fixedOptionValues={props.fixedOptionValues}
                                    inputValue={props.inputValue}
                                    setInputValue={props.setInputValue}
                                    categoryId={v.categoryId}
                                    onChange={() =>
                                        props.setInputValue((prev) =>
                                            [...prev].sort(
                                                (a, b) => b.sort - a.sort,
                                            ),
                                        )
                                    }
                                />
                            </Box>
                        </Stack>
                    </Collapse>
                ))}
        </Box>
    );
}
