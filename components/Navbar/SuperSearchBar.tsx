import { useState, useRef, useEffect, Dispatch, SetStateAction } from "react";
import { Grid } from "@mui/material";
import {
    ThemeProvider,
    createTheme,
    PaletteMode,
    Button,
    CssBaseline,
    Box,
    Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Autocomplete, TextField, Chip } from '@mui/material';
import { styled, lighten, darken } from '@mui/system';


interface searchSuggestions {
    id: string;
    label: string;
    value: string;
    categoryId: string;
    categoryLabel: string;
}

const GroupHeader = styled('div')(({ theme }) => ({
    position: 'sticky',
    top: '-8px',
    padding: '4px 10px',
    color: theme.palette.primary.main,
    backgroundColor: lighten(theme.palette.primary.light, 0.85),
    ...theme.applyStyles('dark', {
        backgroundColor: darken(theme.palette.primary.main, 0.8),
    }),
}));

const GroupItems = styled('ul')({
    padding: 0,
});

export default function SuperSearchBar() {

    // 参考
    // https://mui.com/material-ui/react-autocomplete/


    // 入力された値を管理するstate
    const [inputValues, setInputValues] = useState<Array<searchSuggestions>>([]);

    // 検索候補
    const searchSuggestions: Array<searchSuggestions> = [
        { id: "1", label: "幾田りら", value: "幾田りら", categoryId: "actor", categoryLabel: "出演者" },
        { id: "2", label: "小玉ひかり", value: "小玉ひかり", categoryId: "actor", categoryLabel: "出演者" },
        { id: "3", label: "HALDONA", value: "遥河", categoryId: "actor", categoryLabel: "出演者" },
        { id: "6", label: "ぷらそにか", value: "ぷらそにか", categoryId: "organization", categoryLabel: "組織" },
        { id: "7", label: "ぷらそにか", value: "UCZx7esGXyW6JXn98byfKEIA", categoryId: "YouTubeChannel", categoryLabel: "YouTubeチャンネル" },
        { id: "8", label: "ぷらそにか東京", value: "ぷらそにか東京", categoryId: "organization", categoryLabel: "組織" },
        { id: "9", label: "ながーーーーーーーーーーーい文字列", value: "長いテキスト", categoryId: "text", categoryLabel: "テキスト" },
    ];
    // 検索候補(searchSuggestions)を加工してAutocompleteに渡す。
    const options = searchSuggestions.map((option) => {
        return option
    }).sort((a, b) => {
        return -b.categoryLabel.localeCompare(a.categoryLabel)
    });


    // バリデーション用のダミーデータ
    const validation = {
        error: false, // エラーの状態を管理
        message: '', // エラーメッセージを管理
    };
    // 入力値変更時に呼び出される関数
    const handleInputChange = (event: any, newValues: Array<searchSuggestions | string>): void => {
        let result: Array<searchSuggestions> = []
        for (const value of newValues) {
            // optionから選択されず直接入力されたのはstring型として出力されるため、
            // 必要に応じて型変換をする必要がある。
            if (typeof value === "string") {
                const item: searchSuggestions = {
                    id: String(options.length + 1),
                    label: value,
                    categoryId: "text",
                    value: value,
                    categoryLabel: "テキスト"
                }
                result.push(item)
            } else {
                result.push(value)
            }
        }
        setInputValues(result); // 入力値をstateに保存
    };

    return (<>
        <p>入力された値: {JSON.stringify(inputValues)}</p>
        {/* <p>入力された値Obj: {JSON.stringify(inputValuesObj)}</p> */}
        <Autocomplete
            // 複数選択可能にする。
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
            getOptionLabel={(option) => typeof option === "string" ? "この文字列が出力されるのはおかしいよ" : option.label}
            // 選択不可のオプションを定義できる。
            // getOptionDisabled={(option) =>
            //     option === timeSlots[0] || option === timeSlots[2]
            // }
            // 現在の入力値
            // value={inputValues.map(option => option.title)}
            value={inputValues}
            // 入力値変更時に呼び出される関数
            onChange={handleInputChange}
            // CSS
            sx={{
                // width: 600,
                // display: 'inline-block',
            }}
            // タグの表示に個数制限をかける。
            limitTags={2}
            // テキスト入力フィールドを定義
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="standard"
                    label="検索ワードを入力" // ラベル
                    placeholder="キーワードを選択か、入力後に「Enter」でタグが表示。" // プレースホルダー
                    error={validation.error} // エラー時の見た目変更
                    helperText={validation.message} // エラーメッセージ
                />
            )}
            // 何これ？
            renderGroup={(params) => (
                <li key={params.key}>
                    <GroupHeader>{params.group}</GroupHeader>
                    <GroupItems>{params.children}</GroupItems>
                </li>
            )}
            // 入力された値をタグ🏷️の見た目で表示する
            renderTags={(value: Array<searchSuggestions>, getTagProps) =>
                value.map((option: searchSuggestions, index: number) => (
                    <Chip
                        variant="outlined"
                        style={{
                            height: "6ch",
                        }}
                        label={
                            <div style={{
                                textAlign: 'center',           // テキストを中央揃え
                                maxWidth: '150px',             // テキストの最大幅を指定
                                whiteSpace: 'nowrap',          // 改行させない
                                overflow: 'hidden',            // オーバーフロー時に隠す
                                textOverflow: 'ellipsis'       // 長いテキストを省略して表示
                            }}>
                                <div>{option.label}</div>
                                <div>{option.categoryLabel}</div>
                            </div>
                        }
                        color="info"
                        {...getTagProps({ index })}
                    />
                ))
            }

        />
    </>)

}