import CloseIcon from "@mui/icons-material/Close";
import { Autocomplete, Box, Chip, Stack, TextField } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useTheme } from "@mui/material/styles";
import { darken, lighten, styled } from "@mui/system";
// import { DatePicker } from "@mui/x-date-pickers";
// import dayjs from "dayjs";
import type { SyntheticEvent } from "react";
import * as React from "react";
import { type Dispatch, type SetStateAction, useState } from "react";
const { toHiragana } = require("@koozaki/romaji-conv");

export interface SearchSuggestion {
    // 入力された値はsortの数値が大きい順に並び替えられる。
    // 数値が指定されていない場合は一番後ろになる。
    sort?: number;
    // ラベル(表示に使用)
    label: string;
    // 値
    value: string;
    // 入力途中の文字列に反応させる文字列
    filterMatchText?: string;
    // アイコン画像URL
    imgSrc?: string;
    // アイコン(MUIのアイコンを想定)
    // icon?: React.ReactElement<any>;
    icon?: React.ReactElement;
    // カテゴリーのID
    categoryId: string;
    // カテゴリーのラベル(表示に使用)
    categoryLabel: string;
    // 検索候補表示時のカテゴリーの並び順(大きい順)
    categorySort?: number;
    // 入力された文字列が何文字以上の時に、検索候補として表示するか。(デフォルトは0)
    queryMinLengthForSuggestions?: number;
}

export interface InputValue extends SearchSuggestion {
    sort: number;
    // 値が作成された時刻を定義。
    createdAt: Date;
}

// 追加の検索候補のカテゴリー
export type AdditionalSearchSuggestions = {
    // 並び替え
    sort?: number;
    // カテゴリーのID
    categoryId: string;
    // カテゴリーのラベル(表示に使用)
    categoryLabel: string;
};
// 各カテゴリーの入力値の上限個数を定義。
export type LimitInputValueCategoryCount = {
    // 制限個数
    limit: number;
    // カテゴリーのID
    categoryId: string;
};

type SearchBarProps = {
    textFieldLabel?: string;
    textFieldPlaceholder?: string;

    // 有効化されているカテゴリーIDのリスト
    availableCategoryIds?: string[];
    // テキストに付与するカテゴリー
    textSuggestionCategory?: AdditionalSearchSuggestions[];
    // 日付の入力を許可するカテゴリー
    dateSuggestionCategory?: AdditionalSearchSuggestions[];

    inputValues: InputValue[];
    setInputValues: (values: InputValue[]) => void;

    // タグにアイコンを表示するかどうか
    showTagIcon?: boolean;
    // 表示するタグの個数
    showTagCount?: number;

    // 検索候補
    searchSuggestions?: SearchSuggestion[];
    // 外せない入力値を定義
    fixedOptionValues?: string[];
    // 入力された値が変更された時に実行したい処理を追加できる。
    onChange?: () => void;
    // 入力途中かどうか
    setInProgressInput?: Dispatch<SetStateAction<boolean>>;
};

export default function SearchBar(props: SearchBarProps) {
    // 参考
    // https://mui.com/material-ui/react-autocomplete/

    // テーマ設定を取得
    const theme = useTheme();

    // 検索候補(SearchSuggestions)を加工してAutocompleteに渡す。
    const options: SearchSuggestion[] = props.searchSuggestions
        ? props.searchSuggestions
              // categoryLabelの名前で並び替える
              //   .sort((a, b) => a.categoryLabel.localeCompare(b.categoryLabel))
              .sort((a, b) => {
                  const bb = b.categorySort ? b.categorySort : 0;
                  const aa = a.categorySort ? a.categorySort : 0;
                  return bb - aa;
              })
        : [];

    // バリデーション用のダミーデータ
    const validation = {
        error: false, // エラーの状態を管理
        message: "", // エラーメッセージを管理
    };

    //  日付ダイアログ(モーダルを開くかどうか)を
    const [openDatePicker, setOpenDatePicker] = useState(false);
    // 日付ダイアログの値
    const [dialogDatePickerValue, setDialogDatePickerValue] =
        React.useState<InputValue>({
            sort: 0,
            createdAt: new Date(),
            label: "",
            value: "",
            categoryId: "",
            categoryLabel: "",
        });
    // 日付ダイアログを閉じる
    const handleDialogDateClose = () => {
        setDialogDatePickerValue({
            sort: 0,
            createdAt: new Date(),
            label: "",
            value: "",
            categoryId: "",
            categoryLabel: "",
        });
        setOpenDatePicker(false);
    };
    // 日付ダイアログで送信が押された場合
    const handleDialogDateSubmit = (
        event: React.FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();
        props.setInputValues(
            props.inputValues.concat([
                {
                    label: formatDate(dialogDatePickerValue.value),
                    value: dialogDatePickerValue.value,
                    sort: dialogDatePickerValue.sort,
                    createdAt: new Date(),
                    categoryId: dialogDatePickerValue.categoryId,
                    categoryLabel: dialogDatePickerValue.categoryLabel,
                },
            ]),
        );
        handleDialogDateClose();
        handleOnChange(event, props.inputValues);
    };

    // 検索候補のフィルタリング関数
    function filter(
        options: SearchSuggestion[], // フィルタリング対象のオプションリスト
        params: { inputValue: string }, // フィルタリングに使用するパラメータ（入力値）
    ): SearchSuggestion[] {
        // ① 入力された値を小文字に変換して比較しやすくする
        const inputValueLowerCase = params.inputValue.toLowerCase();

        // ② 入力された値がローマ字の場合はひらがなに変換する。(アルファベットは削除)
        const hiragana = toHiragana(inputValueLowerCase).replace(
            /[a-zA-Z]/g,
            "",
        );

        // optionsリストをフィルタリングし、inputValueがオプションのラベルに含まれるものを返す
        return options.filter((option) => {
            // 入力途中の文字数に応じてフィルタリングを行う。
            if (option.queryMinLengthForSuggestions) {
                if (
                    inputValueLowerCase.length <
                    option.queryMinLengthForSuggestions
                ) {
                    return false;
                }
            }

            // ① inputValueLowerCaseでフィルタリング
            // ①-1 filterMatchTextnの検証
            const i1 = option.filterMatchText
                ?.toLowerCase()
                .includes(inputValueLowerCase);
            if (i1) {
                return i1;
            }
            // ①-2 labelの検証
            const i2 = String(option.label)
                .toLowerCase()
                .includes(inputValueLowerCase);
            if (i2) {
                return i2;
            }

            // ② hiraganaでフィルタリング

            // ②-1 filterMatchTextnの検証
            const h1 = option.filterMatchText?.toLowerCase().includes(hiragana);
            if (h1) {
                return h1;
            }
            // ②-2 labelの検証
            const h2 = String(option.label).toLowerCase().includes(hiragana);
            if (h2) {
                return h2;
            }

            return false;
        });
    }

    // 入力値変更時に呼び出される関数
    const handleOnChange = (
        _event: SyntheticEvent<Element, Event>,
        newValues: (SearchSuggestion | string)[],
    ): void => {
        const result: InputValue[] = [];
        for (const value of newValues) {
            // optionから選択されず直接入力されたのはstring型として出力されるため、
            // 必要に応じて型変換をする必要がある。
            if (typeof value === "string") {
                const item: InputValue = {
                    sort: 0,
                    createdAt: new Date(),
                    label: value,
                    value: value,
                    categoryId: "",
                    categoryLabel: "",
                };
                result.push(item);
            } else if (value.categoryId === "_DatePickerDialog") {
                setDialogDatePickerValue({
                    sort: value.sort ? value.sort : -999999,
                    createdAt: new Date(),
                    label: value.label,
                    value: value.value,
                    categoryId: "",
                    categoryLabel: "",
                });
                // 日付ダイアログを開く
                setOpenDatePicker(true);
            } else {
                const item = {
                    sort: value.sort ? value.sort : -999999,
                    createdAt: new Date(),
                    ...value,
                };
                result.push(item);
            }
        }
        // 並び替え
        // 入力値をstateに保存
        props.setInputValues(result.sort((a, b) => b.sort - a.sort));
        if (props.onChange) {
            props.onChange();
        }
    };
    // 全角の数値を半角に変更 文字列はそのまま 全角スペースを半角スペースに
    const convertStringToDate = (str: string): Date => {
        // 全角数字のUnicode範囲
        const fullWidthNumbers = /[０-９]/g;

        // 全角数字を半角に変換し、スペースを削除
        const dateString = str
            .replace(fullWidthNumbers, (char) => {
                // 全角数字を半角に変換するため、0xFEE0を引く
                return String.fromCharCode(char.charCodeAt(0) - 0xfee0);
            })
            .replace(/　/g, " ")
            .trim();

        return new Date(dateString);
    };
    // 日付を人が読みやすい形にフォーマット
    const formatDate = (value: string | Date) => {
        const date = new Date(value);
        const year = date.getFullYear(); // 年を取得
        const month = date.getMonth() + 1; // 月を取得（0から始まるため +1）
        const day = date.getDate(); // 日を取得
        const hours = date.getHours(); // 時を取得
        const minutes = date.getMinutes(); // 分を取得
        const seconds = date.getSeconds();

        // フォーマットして表示
        return `${year}年${month}月${day}日 ${hours}時${minutes}分${seconds}秒`;
    };
    // 検索候補のHTML
    const GroupHeader = styled(Box)(({ theme }) => ({
        position: "sticky",
        zIndex: "1", // 強制的に上にする。
        top: "-8px",
        padding: "4px 10px",
        color: theme.palette.primary.main,
        backgroundColor: lighten(theme.palette.primary.light, 0.85),
        ...theme.applyStyles("dark", {
            backgroundColor: darken(theme.palette.primary.main, 0.8),
        }),
    }));
    // 検索候補のアイテムのHTML
    const GroupItems = styled("ul")({
        // zIndex: "0",
        display: "flex",
        flexWrap: "wrap", //要素を折り返す
        gap: "3px", // 要素間のスペース
        padding: 0,
        backgroundColor: theme.palette.background.paper,
    });
    // 検索候補からデータを取得(ラベルとカテゴリラベルを利用。)
    const getSearchSuggestionFromLabel = (
        label: string,
        categoryLabel: string,
    ) => {
        const r = props.searchSuggestions?.find(
            (item) =>
                item.label === label && item.categoryLabel === categoryLabel,
        );
        if (r) {
            return r;
        }
        return undefined;
    };

    return (
        <React.Fragment>
            <Autocomplete
                multiple
                // 任意の値を入力可能。(入力された値はstring型になる。)
                freeSolo
                // 選択済みのオプションをドロップダウンから非表示
                filterSelectedOptions
                // ドロップダウンメニューの項目(検索候補)
                options={options}
                // ドロップダウンメニューの項目をグループ化(事前に並び替えをしておく必要がある。)
                groupBy={(option) => option.categoryLabel}
                // groupByでグループ化した際に表示するoptionのラベル。
                getOptionLabel={(option) =>
                    typeof option === "string" ? "？？？" : option.label
                }
                isOptionEqualToValue={(option, v) =>
                    typeof v !== "string" && option.value === v.value
                }
                value={props.inputValues}
                onChange={handleOnChange}
                // 入力途中の文字列を取得
                onInputChange={(event, newInputValue: string) => {
                    // ↓ 消さないで。
                    // 日付を入力するよう設定されている場合。
                    // if (
                    //     props.dateSuggestionCategory &&
                    //     props.dateSuggestionCategory.length !== 0
                    // ) {
                    // const date: Date = convertStringToDate(newInputValue);
                    // if (!Number.isNaN(date.getTime())) {
                    //     const year = date.getFullYear(); // 年を取得
                    //     const month = date.getMonth() + 1; // 月を取得（0から始まるため +1）
                    //     const day = date.getDate(); // 日を取得
                    //     const hours = date.getHours(); // 時を取得
                    //     const minutes = date.getMinutes(); // 分を取得
                    //     // フォーマットして表示
                    //     const formattedDate = `${year}年${month}月${day}日 ${hours}時${minutes}分`;
                    //     for (const i of props.dateSuggestionCategory) {
                    //         // 検索候補に追加
                    //         options.unshift({
                    //             sort: 999999999999,
                    //             label: formattedDate,
                    //             value: formattedDate,
                    //             categoryId: i.categoryId,
                    //             categoryLabel: i.categoryLabel, //`${i.categoryLabel}を入力するにはここをタップ`,
                    //         });
                    //     }
                    // }
                    // }
                }}
                // 検索候補のフィルタリングをする。
                filterOptions={(options, params) => {
                    const filtered: SearchSuggestion[] = filter(
                        options,
                        params,
                    );

                    // 追加カテゴリーのテキストを入力しようとしている場合に日付を入力する選択肢を検索候補に表示
                    if (
                        props.textSuggestionCategory &&
                        props.textSuggestionCategory.length !== 0 &&
                        params.inputValue !== ""
                    ) {
                        // 候補から直接確定する場合
                        for (const i of props.textSuggestionCategory) {
                            filtered.push({
                                label: params.inputValue, //`Add "${formattedDate}"`,
                                value: params.inputValue,
                                categoryId: i.categoryId,
                                categoryLabel: i.categoryLabel, //`${i.categoryLabel}を入力するにはここをタップ`,
                            });
                        }
                    }

                    // 日付を入力しようとしている場合に日付を入力する選択肢を検索候補に表示
                    if (
                        props.dateSuggestionCategory &&
                        props.dateSuggestionCategory.length !== 0 &&
                        params.inputValue !== ""
                    ) {
                        const date = convertStringToDate(params.inputValue);
                        console.log(`変換後の日付${date.toString()}`);
                        if (!Number.isNaN(date.getTime())) {
                            // フォーマットして表示
                            const formattedDate = formatDate(date);

                            // 日付ダイアログを開く場合
                            filtered.unshift({
                                label: "日付を簡単に入力する場合ここをタップ", //`Add "${formattedDate}"`,
                                value: formattedDate,
                                categoryId: "_DatePickerDialog",
                                categoryLabel: "日付", //`${i.categoryLabel}を入力するにはここをタップ`,
                            });
                            // 候補から直接確定する場合
                            for (const i of props.dateSuggestionCategory) {
                                filtered.unshift({
                                    label: formattedDate, //`Add "${formattedDate}"`,
                                    value: date.toString(),
                                    categoryId: i.categoryId,
                                    categoryLabel: i.categoryLabel, //`${i.categoryLabel}を入力するにはここをタップ`,
                                });
                            }
                            // 日付の入力形式をお知らせ
                            filtered.unshift({
                                label: "YYYY/MM/DD hh:mm:ss",
                                value: date.toString(),
                                categoryId: "_DatePickerDialog",
                                categoryLabel: "日付の入力形式のお知らせ",
                            });
                        }
                    }

                    return filtered;
                }}
                // タグの表示に個数制限をかける。
                limitTags={props.showTagCount}
                // テキスト入力フィールドを定義
                renderInput={(params) => (
                    <TextField
                        {...params}
                        fullWidth // 横幅いっぱいまで広げる
                        // variant="standard"
                        variant="filled"
                        label={
                            props.textFieldLabel === undefined
                                ? "検索ワードを入力"
                                : props.textFieldLabel
                        }
                        placeholder={
                            props.textFieldPlaceholder === undefined
                                ? "キーワードを選択か、入力後に「Enter」でタグが表示。"
                                : props.textFieldPlaceholder
                        }
                        error={validation.error} // エラー時の見た目変更
                        helperText={validation.message} // エラーメッセージ
                        onFocus={() => {
                            // 入力中true
                            if (props.setInProgressInput) {
                                props.setInProgressInput(true);
                            }
                        }}
                        onBlur={() => {
                            // 入力中false
                            if (props.setInProgressInput) {
                                props.setInProgressInput(false);
                            }
                        }}
                    />
                )}
                // 検索候補の表示デザイン
                renderGroup={(params) => (
                    <li key={params.key}>
                        <GroupHeader>{params.group}</GroupHeader>
                        {/* params.childrenはReact.ReactNode(文字列、数値、React要素、配列、null、undefined 等の)webで表示できるすべての型。 */}
                        {/* <GroupItems>{params.children}</GroupItems> */}
                        <GroupItems>
                            {React.Children.map(
                                // 検索候補の各項目を繰り返す。
                                params.children,
                                (child, index) => (
                                    <Box
                                        key={child?.toString()}
                                        sx={{
                                            // タグの横幅を定義
                                            width: props.showTagCount
                                                ? "100%"
                                                : "32%",
                                        }}
                                    >
                                        {/* 各要素にユニークなkeyを設定 */}
                                        {
                                            React.isValidElement(child) &&
                                            child.props &&
                                            typeof child.props === "object" &&
                                            "children" in child.props ? (
                                                <>
                                                    {/*  各項目の要素をReact.cloneElementでクローンを作成する。 */}
                                                    {React.cloneElement(
                                                        <Chip />,
                                                        {
                                                            // コメント消さないで by とめとめ
                                                            // 既存のchildのpropsをスプレッド演算子で展開
                                                            ...child.props,
                                                            variant: "outlined",
                                                            sx: {
                                                                // 既存のスタイルを維持
                                                                // ...child.props.style,
                                                                // height: "110%",
                                                                marginBottom:
                                                                    "3px",
                                                                // "& .MuiChip-label": {},
                                                            },
                                                            // getSearchSuggestionFromLabelの結果を一度取得して再利用
                                                            ...(() => {
                                                                const suggestion =
                                                                    props.showTagIcon
                                                                        ? getSearchSuggestionFromLabel(
                                                                              String(
                                                                                  child
                                                                                      .props
                                                                                      .children,
                                                                              ),
                                                                              params.group,
                                                                          )
                                                                        : undefined;

                                                                return {
                                                                    icon: suggestion?.imgSrc
                                                                        ? undefined
                                                                        : suggestion?.icon,
                                                                    avatar: suggestion?.imgSrc ? (
                                                                        <Avatar
                                                                            alt={String(
                                                                                child
                                                                                    .props
                                                                                    .children,
                                                                            )}
                                                                            src={
                                                                                suggestion.imgSrc
                                                                            }
                                                                        />
                                                                    ) : suggestion?.icon ? undefined : (
                                                                        <Avatar>
                                                                            {child
                                                                                .props
                                                                                .children
                                                                                ? String(
                                                                                      child
                                                                                          .props
                                                                                          .children,
                                                                                  )[0]
                                                                                : ""}
                                                                        </Avatar>
                                                                    ),
                                                                };
                                                            })(),
                                                            label: child.props
                                                                .children,
                                                            color: "secondary",

                                                            // ↓ onClick()がChipを一意に特定するために必要。
                                                            // id: `:r${index}:-option-${index}`,
                                                            // "data-option-index":
                                                            //     child.props[
                                                            //         "data-option-index"
                                                            //     ],

                                                            onClick: (
                                                                e: React.MouseEvent,
                                                            ) => {
                                                                // 親要素のonClickを発火させたくない場合に追記
                                                                // e.stopPropagation();

                                                                // 既存のonClickを呼び出す
                                                                const childProps =
                                                                    child.props as {
                                                                        onClick?: (
                                                                            e: React.MouseEvent,
                                                                        ) => void;
                                                                    };
                                                                if (
                                                                    childProps.onClick
                                                                ) {
                                                                    childProps.onClick(
                                                                        e,
                                                                    );
                                                                }
                                                            },
                                                        },
                                                    )}

                                                    {/* {(() => {
                                                        const suggestion =
                                                            getSearchSuggestionFromLabel(
                                                                child.props
                                                                    .children,
                                                                params.group,
                                                            );

                                                        return (
                                                            <div
                                                                style={{
                                                                    display:
                                                                        "flex",
                                                                    marginBottom:
                                                                        "3px",
                                                                }}
                                                                data-option-index={
                                                                    child.props[
                                                                        "data-option-index"
                                                                    ]
                                                                }
                                                                // クリックイベント
                                                                onClick={(
                                                                    e: React.MouseEvent,
                                                                ) => {
                                                                    child.props.onClick(
                                                                        e,
                                                                    );
                                                                }}
                                                                // キーボードイベント
                                                                onKeyDown={(
                                                                    e: React.KeyboardEvent,
                                                                ) => {
                                                                    child.props.onClick(
                                                                        e,
                                                                    );
                                                                }}
                                                            >
                                                                {(() => {
                                                                    if (
                                                                        suggestion?.imgSrc
                                                                    ) {
                                                                        return (
                                                                            <Avatar
                                                                                alt={
                                                                                    child
                                                                                        .props
                                                                                        .children
                                                                                }
                                                                                src={
                                                                                    suggestion?.imgSrc
                                                                                }
                                                                            />
                                                                        );
                                                                    }
                                                                    if (
                                                                        suggestion?.icon
                                                                    ) {
                                                                        return suggestion?.icon;
                                                                    }
                                                                    return (
                                                                        <Avatar>
                                                                            {child
                                                                                .props
                                                                                .children
                                                                                ? child
                                                                                      .props
                                                                                      .children[0]
                                                                                : ""}
                                                                        </Avatar>
                                                                    );
                                                                })()}
                                                                {
                                                                    child.props
                                                                        .children
                                                                }
                                                            </div>
                                                        );
                                                    })()} */}
                                                </>
                                            ) : (
                                                child
                                            ) // 子要素がReactエレメントでない場合はそのまま表示
                                        }
                                    </Box>
                                ),
                            )}
                        </GroupItems>
                    </li>
                )}
                // 入力された値をタグ🏷️の見た目で表示する
                renderValue={(value, getItemProps) =>
                    value.map((option, index) => {
                        const itemProps = getItemProps({ index });
                        const { key, onDelete, ...restProps } = itemProps;

                        // freeSolo対策（重要）
                        if (typeof option === "string") {
                            return (
                                <Chip key={key} label={option} {...restProps} />
                            );
                        }

                        const isFixed =
                            props.fixedOptionValues?.includes(option.value) ??
                            false;

                        return (
                            <Box
                                key={`${option.value}-${option.categoryId}`}
                                sx={{ position: "relative" }}
                            >
                                <Chip
                                    key={key}
                                    variant="outlined"
                                    sx={{
                                        height: "auto",
                                        "& .MuiChip-label": {
                                            display: "flex",
                                            alignItems: "center",
                                            maxWidth: "100%",
                                            height: "3em",
                                            lineHeight: "1.5",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                        },
                                    }}
                                    icon={
                                        props.showTagIcon === false
                                            ? undefined
                                            : option.icon
                                    }
                                    avatar={
                                        props.showTagIcon ===
                                        false ? undefined : option.imgSrc ? (
                                            <Avatar
                                                alt={option.label}
                                                src={option.imgSrc}
                                            />
                                        ) : option.icon ? undefined : (
                                            <Avatar>{option.label[0]}</Avatar>
                                        )
                                    }
                                    label={
                                        <>
                                            {option.label}
                                            {option.categoryLabel && (
                                                <>
                                                    <br />
                                                    {option.categoryLabel}
                                                </>
                                            )}
                                        </>
                                    }
                                    color="success"
                                    {...restProps}
                                    disabled={isFixed ? true : undefined}
                                    onDelete={isFixed ? undefined : onDelete}
                                />

                                {props.availableCategoryIds &&
                                    !props.availableCategoryIds.includes(
                                        option.categoryId,
                                    ) && (
                                        <CloseIcon
                                            sx={{
                                                position: "absolute",
                                                top: "10%",
                                                left: "40%",
                                                color: theme.palette.warning
                                                    .main,
                                                fontSize: "2.5rem",
                                            }}
                                        />
                                    )}
                            </Box>
                        );
                    })
                }
            />
            <Dialog open={openDatePicker} onClose={handleDialogDateClose}>
                <form onSubmit={handleDialogDateSubmit}>
                    <DialogTitle>日付を入力</DialogTitle>
                    <DialogContent>
                        <DialogContentText>↓ どちらかを選択</DialogContentText>
                        {props.dateSuggestionCategory &&
                            props.dateSuggestionCategory.length !== 0 &&
                            props.dateSuggestionCategory.map((item) => (
                                <Button
                                    key={item.categoryId}
                                    variant="outlined"
                                    onClick={() => {
                                        // 引数を省略してアロー関数を使用
                                        setDialogDatePickerValue({
                                            label: formatDate(
                                                dialogDatePickerValue.value,
                                            ),
                                            value: dialogDatePickerValue.value,
                                            sort: dialogDatePickerValue.sort,
                                            createdAt: new Date(),
                                            categoryId: item.categoryId,
                                            categoryLabel: item.categoryLabel,
                                        });
                                    }}
                                >
                                    {item.categoryLabel}
                                </Button> // keyプロパティを追加
                            ))}

                        <Stack>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="label"
                                defaultValue={formatDate(
                                    dialogDatePickerValue.value,
                                )}
                                onChange={(event) =>
                                    setDialogDatePickerValue({
                                        ...dialogDatePickerValue,
                                        label: event.target.value,
                                    })
                                }
                                label="Label"
                                type="text"
                                slotProps={{
                                    input: {
                                        inputProps: {
                                            readOnly: true,
                                        },
                                    },
                                }}
                            />
                        </Stack>
                        <Stack>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="value"
                                defaultValue={convertStringToDate(
                                    dialogDatePickerValue.value,
                                )}
                                onChange={(event) =>
                                    setDialogDatePickerValue({
                                        ...dialogDatePickerValue,
                                        value: new Date(
                                            event.target.value,
                                        ).toString(),
                                    })
                                }
                                label="value"
                                type="datetime-local"
                            />
                        </Stack>
                        <Stack direction="row">
                            <TextField
                                autoFocus
                                margin="dense"
                                id="categoryId"
                                defaultValue={dialogDatePickerValue.categoryId}
                                onChange={(event) =>
                                    setDialogDatePickerValue({
                                        ...dialogDatePickerValue,
                                        categoryId: event.target.value,
                                    })
                                }
                                label="categoryId"
                                type="text"
                                slotProps={{
                                    input: {
                                        inputProps: {
                                            readOnly: true,
                                        },
                                    },
                                }}
                            />
                            <TextField
                                autoFocus
                                margin="dense"
                                id="categoryLabel"
                                defaultValue={
                                    dialogDatePickerValue.categoryLabel
                                }
                                onChange={(event) =>
                                    setDialogDatePickerValue({
                                        ...dialogDatePickerValue,
                                        categoryLabel: event.target.value,
                                    })
                                }
                                label="categoryLabel"
                                type="text"
                                slotProps={{
                                    input: {
                                        inputProps: {
                                            readOnly: true,
                                        },
                                    },
                                }}
                            />
                        </Stack>
                        {/* <DatePicker
                            label="Select Date"
                            value={dayjs("2019-01-25")}
                            onChange={(newValue) =>
                                setDialogDatePickerValue({
                                    ...dialogDatePickerValue,
                                    value: newValue?.toString() ?? "", // 新しい日付の値に更新
                                })
                            }
                        /> */}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDialogDateClose}>Cancel</Button>
                        <Button type="submit">Add</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </React.Fragment>
    );
}
