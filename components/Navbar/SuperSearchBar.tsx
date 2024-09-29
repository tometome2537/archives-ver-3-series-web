import { Autocomplete, Box, Chip, TextField, Typography } from "@mui/material";
import { darken, lighten, styled } from "@mui/system";
import type { SyntheticEvent } from "react";
import { useState } from "react";
import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { DatePicker } from "@/components/Form/DatePicker";
import dayjs, { type Dayjs } from "dayjs";

export interface SearchSuggestion {
    // 入力された値はsortの数値が大きい順に並び替えられる。
    // 数値が指定されていない場合は一番後ろになる。
    sort?: number;
    // ラベル(表示に使用)
    label: string;
    // 値
    value: string;
    // カテゴリーのID
    categoryId: string;
    // カテゴリーのラベル(表示に使用)
    categoryLabel: string;
}

export interface InputValueSearchSuggestion extends SearchSuggestion {
    sort: number;
}

export type dateSuggestion = {
    // カテゴリーのID
    categoryId: string;
    // カテゴリーのラベル(表示に使用)
    categoryLabel: string;
};

type SuperSearchBarProps = {
    textFieldLabel?: string;
    textFieldPlaceholder?: string;
    // 日付の入力を許可する場合
    dateSuggestionCategory?: dateSuggestion[];
    inputValues: InputValueSearchSuggestion[];
    setInputValues: (values: InputValueSearchSuggestion[]) => void;
    // 検索候補
    searchSuggestions?: SearchSuggestion[];
    // 入力された値が変更された時に実行したい処理を追加できる。
    onChange?: () => void;
};

export default function SuperSearchBar(props: SuperSearchBarProps) {
    // 参考
    // https://mui.com/material-ui/react-autocomplete/

    // 検索候補(SearchSuggestions)を加工してAutocompleteに渡す。
    const options: InputValueSearchSuggestion[] = props.searchSuggestions
        ? props.searchSuggestions
              .map((option) => ({
                  sort: option.sort ?? -9999999,
                  ...option,
              }))
              .sort((a, b) => a.categoryLabel.localeCompare(b.categoryLabel))
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
        React.useState<InputValueSearchSuggestion>({
            sort: 0,
            label: "",
            value: "",
            categoryId: "",
            categoryLabel: "",
        });
    // 日付ダイアログを閉じる
    const handleDialogDateClose = () => {
        setDialogDatePickerValue({
            sort: 0,
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
                    label: dialogDatePickerValue.value,
                    value: dialogDatePickerValue.value,
                    sort: 0,
                    categoryId: dialogDatePickerValue.label,
                    categoryLabel: dialogDatePickerValue.label,
                },
            ]),
        );
        handleDialogDateClose();
    };

    // 検索候補のフィルタリング関数
    function filter(
        options: InputValueSearchSuggestion[], // フィルタリング対象のオプションリスト
        params: { inputValue: string }, // フィルタリングに使用するパラメータ（入力値）
    ): InputValueSearchSuggestion[] {
        // 入力された値を小文字に変換して比較しやすくする
        const inputValueLowerCase = params.inputValue.toLowerCase();

        // optionsリストをフィルタリングし、inputValueがオプションのラベルに含まれるものを返す
        return options.filter((option) =>
            option.label.toLowerCase().includes(inputValueLowerCase),
        );
    }

    // 入力値変更時に呼び出される関数
    const handleInputChange = (
        _event: SyntheticEvent<Element, Event>,
        newValues: (InputValueSearchSuggestion | string)[],
    ): void => {
        const result: InputValueSearchSuggestion[] = [];
        for (const value of newValues) {
            // optionから選択されず直接入力されたのはstring型として出力されるため、
            // 必要に応じて型変換をする必要がある。
            if (typeof value === "string") {
                const item: InputValueSearchSuggestion = {
                    sort: 0,
                    label: value,
                    value: value,
                    categoryId: "text",
                    categoryLabel: "テキスト",
                };
                result.push(item);
            } else if (value.categoryId === "_DatePickerDialog") {
                // 日付ダイアログを開く
                setOpenDatePicker(true);
            } else {
                result.push(value);
            }
        }
        // 並び替え
        // 入力値をstateに保存
        props.setInputValues(result.sort((a, b) => b.sort - a.sort));
        if (props.onChange) {
            props.onChange();
        }
    };
    // 検索候補のHTML
    const GroupHeader = styled(Box)(({ theme }) => ({
        position: "sticky",
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
        padding: 0,
    });

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
                    typeof option === "string" ? "エラーテキスト" : option.label
                }
                isOptionEqualToValue={(option, v) => option.value === v.value}
                value={props.inputValues}
                onChange={handleInputChange}
                // 入力途中の文字列を取得
                onInputChange={(event, newInputValue: string) => {
                    // 日付を入力するよう設定されている場合。
                    // if (props.dateSuggestionCategory) {
                    //     // 全角の数値を半角に変更 文字列はそのまま 半角と全角スペースを削除
                    //     const convertToHalfWidth = (str: string): string => {
                    //         // 全角数字のUnicode範囲
                    //         const fullWidthNumbers = /[\uFF10-\uFF19]/g;
                    //         // 全角スペースと半角スペースの正規表現
                    //         const spaces = /[　\s]/g; // 　は全角スペース、\sは半角スペースを表す
                    //         // 全角数字を半角に変換し、スペースを削除
                    //         return str
                    //             .replace(fullWidthNumbers, (char) => {
                    //                 // 全角数字を半角に変換するため、0xFEE0を引く
                    //                 return String.fromCharCode(
                    //                     char.charCodeAt(0) - 0xfee0,
                    //                 );
                    //             })
                    //             .replace(spaces, ""); // スペースを削除
                    //     };
                    //     // 全角数字を半角に変換
                    //     const halfWidthString =
                    //         convertToHalfWidth(newInputValue);
                    //     const date = new Date(halfWidthString);
                    //     if (!Number.isNaN(date.getTime())) {
                    //         const year = date.getFullYear(); // 年を取得
                    //         const month = date.getMonth() + 1; // 月を取得（0から始まるため +1）
                    //         const day = date.getDate(); // 日を取得
                    //         const hours = date.getHours(); // 時を取得
                    //         const minutes = date.getMinutes(); // 分を取得
                    //         // フォーマットして表示
                    //         const formattedDate = `${year}年${month}月${day}日 ${hours}時${minutes}分`;
                    //         for (const i of props.dateSuggestionCategory) {
                    //             // 検索候補に追加
                    //             options.unshift({
                    //                 sort: 999999999999,
                    //                 label: formattedDate,
                    //                 value: formattedDate,
                    //                 categoryId: i.categoryId,
                    //                 categoryLabel: i.categoryLabel, //`${i.categoryLabel}を入力するにはここをタップ`,
                    //             });
                    //         }
                    //     }
                    // }
                }}
                // 検索候補のフィルタリングをする。
                filterOptions={(options, params) => {
                    const filtered = filter(options, params);

                    // 日付を入力しようとしている場合に日付を入力する選択肢を検索候補に表示
                    if (
                        props.dateSuggestionCategory &&
                        props.dateSuggestionCategory.length !== 0 &&
                        params.inputValue !== ""
                    ) {
                        // 全角の数値を半角に変更 文字列はそのまま 半角と全角スペースを削除
                        const convertToHalfWidth = (str: string): string => {
                            // 全角数字のUnicode範囲
                            const fullWidthNumbers = /[\uFF10-\uFF19]/g;
                            // 全角スペースと半角スペースの正規表現
                            const spaces = /[　\s]/g; // 　は全角スペース、\sは半角スペースを表す

                            // 全角数字を半角に変換し、スペースを削除
                            return str
                                .replace(fullWidthNumbers, (char) => {
                                    // 全角数字を半角に変換するため、0xFEE0を引く
                                    return String.fromCharCode(
                                        char.charCodeAt(0) - 0xfee0,
                                    );
                                })
                                .replace(spaces, ""); // スペースを削除
                        };
                        // 全角数字を半角に変換
                        const halfWidthString = convertToHalfWidth(
                            params.inputValue,
                        );
                        const date = new Date(halfWidthString);
                        if (!Number.isNaN(date.getTime())) {
                            const year = date.getFullYear(); // 年を取得
                            const month = date.getMonth() + 1; // 月を取得（0から始まるため +1）
                            const day = date.getDate(); // 日を取得
                            const hours = date.getHours(); // 時を取得
                            const minutes = date.getMinutes(); // 分を取得

                            // フォーマットして表示
                            const formattedDate = `${year}年${month}月${day}日 ${hours}時${minutes}分`;

                            // 日付ダイアログを開く場合
                            filtered.unshift({
                                sort: 0,
                                label: "日付を入力する場合ここをタップ", //`Add "${formattedDate}"`,
                                value: formattedDate,
                                categoryId: "_DatePickerDialog",
                                categoryLabel: "日付", //`${i.categoryLabel}を入力するにはここをタップ`,
                            });
                            // 候補から直接確定する場合
                            for (const i of props.dateSuggestionCategory) {
                                filtered.unshift({
                                    sort: 0,
                                    label: formattedDate, //`Add "${formattedDate}"`,
                                    value: formattedDate,
                                    categoryId: i.categoryId,
                                    categoryLabel: i.categoryLabel, //`${i.categoryLabel}を入力するにはここをタップ`,
                                });
                            }
                        }
                    }
                    return filtered;
                }}
                // タグの表示に個数制限をかける。
                // limitTags={3}
                // テキスト入力フィールドを定義
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="standard"
                        label={
                            props.textFieldLabel
                                ? props.textFieldLabel
                                : "検索ワードを入力"
                        }
                        placeholder={
                            props.textFieldPlaceholder
                                ? props.textFieldPlaceholder
                                : "キーワードを選択か、入力後に「Enter」でタグが表示。"
                        }
                        error={validation.error} // エラー時の見た目変更
                        helperText={validation.message} // エラーメッセージ
                    />
                )}
                renderGroup={(params) => (
                    <li key={params.key}>
                        <GroupHeader>{params.group}</GroupHeader>
                        <GroupItems>{params.children}</GroupItems>
                    </li>
                )}
                // 入力された値をタグ🏷️の見た目で表示する
                renderTags={(
                    value: Array<InputValueSearchSuggestion>,
                    getTagProps,
                ) =>
                    value.map(
                        (option: InputValueSearchSuggestion, index: number) => (
                            <Box
                                key={`${option.label}-${option.categoryLabel}`} // 一意なキーを設定
                            >
                                <Chip
                                    variant="outlined"
                                    sx={{
                                        height: "6ch",
                                    }}
                                    label={
                                        <Box
                                            sx={{
                                                textAlign: "center",
                                                maxWidth: "150px",
                                                whiteSpace: "nowrap", // 改行させない
                                                overflow: "hidden", // オーバーフロー時に隠す
                                                textOverflow: "ellipsis", // 長いテキストを省略して表示
                                            }}
                                        >
                                            <Typography>
                                                {option.label}
                                            </Typography>
                                            <Typography>
                                                {option.categoryLabel}
                                            </Typography>
                                        </Box>
                                    }
                                    color="info"
                                    {...getTagProps({ index })}
                                />
                            </Box>
                        ),
                    )
                }
            />
            <Dialog open={openDatePicker} onClose={handleDialogDateClose}>
                <form onSubmit={handleDialogDateSubmit}>
                    <DialogTitle>日付を入力</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            日付を選んで....泣
                        </DialogContentText>
                        <p>{JSON.stringify(props.dateSuggestionCategory)}</p>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="label"
                            value={dialogDatePickerValue.label}
                            onChange={(event) =>
                                setDialogDatePickerValue({
                                    ...dialogDatePickerValue,
                                    label: event.target.value,
                                })
                            }
                            label="Label"
                            type="text"
                            variant="standard"
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="value"
                            value={dialogDatePickerValue.value}
                            onChange={(event) =>
                                setDialogDatePickerValue({
                                    ...dialogDatePickerValue,
                                    value: event.target.value,
                                })
                            }
                            label="value"
                            type="text"
                            variant="standard"
                        />
                        {/* <DatePicker
                            label="Select Date"
                            value={dayjs("2019-01-25")}
                            onChange={(newValue) =>
                                setDialogDatePickerValue({
                                    ...dialogDatePickerValue,
                                    value: newValue, // 新しい日付の値に更新
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
