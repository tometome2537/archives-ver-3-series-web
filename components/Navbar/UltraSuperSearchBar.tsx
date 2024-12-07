"use client";

import { DatePicker } from "@/components/Form/DatePicker";
import SuperSearchBar, {
    type SearchSuggestion,
    type InputValue,
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
import { type Dispatch, type SetStateAction,  useState } from "react";
import HistoryIcon from "@mui/icons-material/History";

export interface LimitedSuperSearchProps {
    searchSuggestions?: ultraSuperSearchBarSearchSuggestion[];
    // 外せない入力値を定義
    fixedOptionValues?: string[];
    availableCategoryIds?: string[];
    textSuggestionCategory?: additionalSearchSuggestions[];
    dateSuggestionCategory?: additionalSearchSuggestions[];
    showTagIcon?: boolean;
    showTagCount?: number;
    inputValue: InputValue[];
    setInputValue: Dispatch<SetStateAction<InputValue[]>>;
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
    showTagIcon,
    showTagCount,
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
    const handleSetInputValues = (values: InputValue[]) => {
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
            showTagIcon={showTagIcon}
            showTagCount={showTagCount}
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
    inputValue: InputValue[];
    setInputValue: Dispatch<SetStateAction<InputValue[]>>;
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

    showTagIcon?: boolean;
    showTagCount?: number;
};

export default function UltraSuperSearchBar(
    props: UltraSuperSearchBarSearchBarProps,
) {
    // リミットスーパーサーチバーが開いてるかどうか
    const [isOpen, setIsOpen] = useState<boolean>(false);

    // 入力履歴を保存(To DO)
    const [inputValueHistory, setInputValueHistory] = useState<
    InputValue[]
    >([]);

    return (
        <Box>
            {/* {JSON.stringify(props.inputValue[1])}
            <p>----</p>
            {JSON.stringify(
                props.searchSuggestion ? props.searchSuggestion[1] : {},
            )} */}
            {/* <Typography>全部</Typography> */}
            <SuperSearchBar
                inputValues={props.inputValue}
                availableCategoryIds={props.availableCategoryIds}
                textSuggestionCategory={props.textSuggestionCategory}
                dateSuggestionCategory={props.dateSuggestionCategory}
                showTagIcon={props.showTagIcon}
                showTagCount={props.showTagCount}
                // setInputValues={(values) => {
                //     setInputValue([...values]);
                // }}
                setInputValues={props.setInputValue}
                searchSuggestions={props.searchSuggestion}
                fixedOptionValues={props.fixedOptionValues}
            />
            <Box
                sx={{
                    display: "flex",
                }}
            >
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
                {/* <Box sx={{ flexGrow: 1 }} />
                <HistoryIcon /> */}
            </Box>

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
                                    showTagIcon={props.showTagIcon}
                                    showTagCount={props.showTagCount}
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
