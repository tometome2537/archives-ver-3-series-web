import { Autocomplete, Box, Chip, TextField, Typography } from "@mui/material";
import { darken, lighten, styled } from "@mui/system";
import type { Dispatch, SetStateAction, SyntheticEvent } from "react";

export type CategoryId = "actor" | "organization" | "YouTubeChannel" | "text";

export interface SearchSuggestion {
    // 並び替え
    sort?: number;
    // ラベル(表示に使用)
    label: string;
    // 値
    value: string;
    // カテゴリーのID
    categoryId: CategoryId;
    // カテゴリーのラベル(表示に使用)
    categoryLabel: string;
}

export interface InputValueSearchSuggestion extends SearchSuggestion {
    // 入力された値はsortの数値が大きい順に並び替えられる。
    sort: number;
}

type SuperSearchBarProps = {
    label: string;
    inputValues: InputValueSearchSuggestion[];
    setInputValues: (values: InputValueSearchSuggestion[]) => void;
    // 検索候補
    searchSuggestions: SearchSuggestion[];
};

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

const GroupItems = styled("ul")({
    padding: 0,
});

export default function SuperSearchBar({
    label,
    inputValues,
    setInputValues,
    searchSuggestions,
}: SuperSearchBarProps) {
    // 参考
    // https://mui.com/material-ui/react-autocomplete/

    // 検索候補(SearchSuggestions)を加工してAutocompleteに渡す。
    const options: InputValueSearchSuggestion[] = searchSuggestions
        .map((option) => ({
            sort: option.sort ?? -9999999,
            ...option,
        }))
        .sort((a, b) => -b.categoryLabel.localeCompare(a.categoryLabel));

    // バリデーション用のダミーデータ
    const validation = {
        error: false, // エラーの状態を管理
        message: "", // エラーメッセージを管理
    };
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
            } else {
                result.push(value);
            }
        }
        // 並び替え
        const sortedResult = result.sort((a, b) => b.sort - a.sort);
        // 入力値をstateに保存
        setInputValues(sortedResult);
    };

    return (
        <>
            <Autocomplete
                multiple
                // 任意の値を入力可能。(入力された値はstring型になる。)
                freeSolo
                // 選択済みのオプションをドロップダウンから非表示
                filterSelectedOptions
                // ドロップダウンメニューの項目
                options={options}
                // ドロップダウンメニューの項目をグループ化(事前に並び替えをしておく必要がある。)
                groupBy={(option) => option.categoryLabel}
                // groupByでグループ化した際に表示するoptionのラベル。
                getOptionLabel={(option) =>
                    typeof option === "string"
                        ? "この文字列が出力されるのはおかしいよ"
                        : option.label
                }
                isOptionEqualToValue={(option, v) => option.value === v.value}
                value={inputValues}
                onChange={handleInputChange}
                // タグの表示に個数制限をかける。
                // limitTags={3}
                // テキスト入力フィールドを定義
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="standard"
                        label={label} // ラベル
                        placeholder="キーワードを選択か、入力後に「Enter」でタグが表示。" // プレースホルダー
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
                                                textAlign: "center", // テキストを中央揃え
                                                maxWidth: "150px", // テキストの最大幅を指定
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
        </>
    );
}
