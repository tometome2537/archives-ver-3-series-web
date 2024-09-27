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


type a = {
    id?: string;
    name: string;
    category: string;
}

export default function SuperSearchBar() {
    // 入力された値を管理するstate
    const [inputValues, setInputValues] = useState<Array<string>>([]);
    // 入力された値(Obj)
    const [inputValuesObj, setInputValuesObj] = useState<Array<a>>([]);

    // 離島データ（例）
    const islands: Array<a> = [
        { id: "1", name: '幾田りら', category: "actor" },
        { id: "2", name: "小玉ひかり", category: "actor" },
        { id: "3", name: '美稀', category: "actor" },
        { id: "4", name: 'みきまりあ', category: "actor" },
        { id: "5", name: 'てつと', category: "actor" },
        { id: "6", name: 'ぷらそにか', category: "organization" },
        { id: "7", name: 'ぷらそにか-YouTube', category: "YouTubeChannel" },
        { id: "8", name: 'ぷらそにか東京', category: "organization" },
        { id: "9", name: 'ながーーーーーーーーーーーい文字列', category: "organization" },
    ];
    // バリデーション用のダミーデータ
    const validation = {
        error: false, // エラーの状態を管理
        message: '', // エラーメッセージを管理
    };
    // 入力変更時のコールバック関数
    const handleInputChange = (event: any, newValue: string[]) => {
        setInputValues(newValue); // 入力値をstateに保存
        const result = []
        for (const value of newValue) {
            const resultItem = islands.find((v) => v.name === value)
            if (resultItem) {
                result.push(resultItem)
            } else {
                result.push({ id: "", name: value, category: "freeText" })
            }
        }
        setInputValuesObj(result)
    };

    return (<>
        <p>入力された値: {JSON.stringify(inputValues)}</p>
        <p>入力された値Obj: {JSON.stringify(inputValuesObj)}</p>
        <Autocomplete
            multiple // 複数選択可能
            freeSolo // 任意の値を入力可能
            filterSelectedOptions // 選択済みのオプションをドロップダウンから非表示
            options={islands.map(option => option.name)} // ドロップダウンメニューの項目
            value={inputValues} // 現在の入力値
            // value={islands.map(v => v.name)} // 現在の入力値
            onChange={handleInputChange} // 入力値変更時のハンドラ
            sx={{
                width: 600,
                display: 'inline-block',
            }}
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
            renderTags={(value: readonly string[], getTagProps) =>
                value.map((option: any, index: number) => (
                    <Chip
                        variant="outlined"
                        label={
                            <div style={{
                                textAlign: 'center',
                                maxWidth: '150px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}>
                                {/* オブジェクトを文字列として表示 */}
                                <div>
                                    {(() => {
                                        const result = inputValuesObj.find((v) => v.name === option)
                                        return result ? (
                                            <>
                                                <div>{result.name}</div>
                                                <div>{result.category}</div>
                                            </>
                                        ) : "この文字列は表示されないはず";
                                    })()}
                                </div>
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