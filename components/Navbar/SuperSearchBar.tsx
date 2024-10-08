import {
    Autocomplete,
    Box,
    Chip,
    TextField,
    Typography,
    Stack,
} from "@mui/material";
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
import { useTheme } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import CloseIcon from "@mui/icons-material/Close";

export interface SearchSuggestion {
    // 入力された値はsortの数値が大きい順に並び替えられる。
    // 数値が指定されていない場合は一番後ろになる。
    sort?: number;
    // ラベル(表示に使用)
    label: string;
    // 値
    value: string;
    // アイコン画像
    imgSrc?: string;
    // アイコン
    icon?: React.ReactElement;
    // カテゴリーのID
    categoryId: string;
    // カテゴリーのラベル(表示に使用)
    categoryLabel: string;
}

export interface InputValueSearchSuggestion extends SearchSuggestion {
    sort: number;
}

// 追加の検索候補のカテゴリー
export type additionalSearchSuggestions = {
    // カテゴリーのID
    categoryId: string;
    // カテゴリーのラベル(表示に使用)
    categoryLabel: string;
};

type SuperSearchBarProps = {
    textFieldLabel?: string;
    textFieldPlaceholder?: string;

    // 有効化されているカテゴリーIDのリスト
    availableCategoryIds?: string[];
    // テキストに付与するカテゴリー
    textSuggestionCategory?: additionalSearchSuggestions[];
    // 日付の入力を許可するカテゴリー
    dateSuggestionCategory?: additionalSearchSuggestions[];

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

    // テーマ設定を取得
    const theme = useTheme();

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
                    label: formatDate(dialogDatePickerValue.value),
                    value: dialogDatePickerValue.value,
                    sort: 0,
                    categoryId: dialogDatePickerValue.categoryId,
                    categoryLabel: dialogDatePickerValue.categoryLabel,
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
    const handleOnChange = (
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
                setDialogDatePickerValue({
                    sort: 0,
                    label: value.label,
                    value: value.value,
                    categoryId: "",
                    categoryLabel: "",
                });
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
    // 全角の数値を半角に変更 文字列はそのまま 全角スペースを半角スペースに
    const convertStringToDate = (str: string): Date => {
        // 全角数字のUnicode範囲
        const fullWidthNumbers = /[\uFF10-\uFF19]/g;

        // 全角数字を半角に変換し、スペースを削除
        const dateString = str
            .replace(fullWidthNumbers, (char) => {
                // 全角数字を半角に変換するため、0xFEE0を引く
                return String.fromCharCode(char.charCodeAt(0) - 0xfee0);
            })
            .replace(/\u3000/g, " ") // 全角スペースを半角スペースに
            .trim(); // 文字列の前後の空白等を取り除く

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
                    typeof option === "string" ? "？？？" : option.label
                }
                isOptionEqualToValue={(option, v) => option.value === v.value}
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
                    const filtered = filter(options, params);

                    // 追加カテゴリーのテキストを入力しようとしている場合に日付を入力する選択肢を検索候補に表示
                    if (
                        props.textSuggestionCategory &&
                        props.textSuggestionCategory.length !== 0 &&
                        params.inputValue !== ""
                    ) {
                        // 候補から直接確定する場合
                        for (const i of props.textSuggestionCategory) {
                            filtered.unshift({
                                sort: 0,
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
                                sort: 0,
                                label: "日付を簡単に入力する場合ここをタップ", //`Add "${formattedDate}"`,
                                value: formattedDate,
                                categoryId: "_DatePickerDialog",
                                categoryLabel: "日付", //`${i.categoryLabel}を入力するにはここをタップ`,
                            });
                            // 候補から直接確定する場合
                            for (const i of props.dateSuggestionCategory) {
                                filtered.unshift({
                                    sort: 0,
                                    label: formattedDate, //`Add "${formattedDate}"`,
                                    value: date.toString(),
                                    categoryId: i.categoryId,
                                    categoryLabel: i.categoryLabel, //`${i.categoryLabel}を入力するにはここをタップ`,
                                });
                            }
                            // 日付の入力形式をお知らせ
                            filtered.unshift({
                                sort: 0,
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
                // 検索候補の表示デザイン
                renderGroup={(params) => (
                    <li key={params.key}>
                        <GroupHeader>{params.group}</GroupHeader>
                        {/* params.childrenはReact.ReactNode(文字列、数値、React要素、配列、null、undefined 等の)webで表示できるすべての型。 */}
                        <GroupItems>{params.children}</GroupItems>
                        {/* ↓ 開発中のGroupItems */}
                        <GroupItems>
                            {React.Children.map(
                                params.children,
                                (child, index) => (
                                    <Box
                                        sx={{
                                            display: "none",
                                            // display: "flex", // Flexboxを使用してアバターと内容を横に並べる
                                            height: "110%",
                                            borderRadius: "4px",
                                            marginBottom: "4px",
                                            border: "1px solid #ddd",
                                            alignItems: "center", // 垂直方向に中央揃え
                                            padding: "8px", // 余白を追加
                                        }}
                                    >
                                        {child} {/* 子要素 */}
                                    </Box>
                                ),
                            )}
                        </GroupItems>
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
                                key={`${option.value}-${option.categoryId}`} // 一意なキーを設定
                                sx={{
                                    position: "relative", // アイコンの位置を指定するために relative を設定
                                }}
                            >
                                <Chip
                                    variant="outlined"
                                    sx={{
                                        height: "auto",
                                        "& .MuiChip-label": {
                                            // textAlign: "center",
                                            maxWidth: "100%",
                                            lineHeight: "1.5", // 文字の上下間隔
                                            whiteSpace: "nowrap", // 改行させない
                                            overflow: "hidden", // オーバーフロー時に隠す
                                            textOverflow: "ellipsis", // 長いテキストを省略して表示
                                        },
                                    }}
                                    icon={option.icon}
                                    avatar={
                                        option.imgSrc ? (
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
                                            <br />
                                            {option.categoryLabel}
                                        </>
                                    }
                                    color="success"
                                    {...getTagProps({ index })}
                                />
                                {/* 有効化されていないcategoryIdのタグに❌を表示する。 */}
                                {props.availableCategoryIds ? (
                                    props.availableCategoryIds.includes(
                                        option.categoryId,
                                    ) ? null : ( // availableCategoryIdsが存在する場合のみincludesを呼び出す
                                        <CloseIcon
                                            sx={{
                                                position: "absolute", // Box内の絶対位置に表示
                                                top: "10%", // 上から20%の位置に配置
                                                left: "40%", // 左から40%の位置に配置
                                                color: "orange", // アイコンの色をオレンジに設定
                                                fontSize: "2.5rem", // アイコンのサイズを調整
                                            }}
                                        />
                                    )
                                ) : null}
                            </Box>
                        ),
                    )
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
                                            sort: 0,
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
                                inputProps={{ readOnly: true }}
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
                                inputProps={{ readOnly: true }}
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
                                inputProps={{ readOnly: true }}
                            />
                        </Stack>
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
