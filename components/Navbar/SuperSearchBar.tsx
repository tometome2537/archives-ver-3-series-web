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
import { Autocomplete, TextField, Chip } from "@mui/material";
import { styled, lighten, darken } from "@mui/system";
import type { SyntheticEvent } from "react";

interface searchSuggestion {
	// 並び替え
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

interface inputValueSearchSuggestion extends searchSuggestion {
	// 入力された値はsortの数値が大きい順に並び替えられる。
	sort: number;
}

const GroupHeader = styled("div")(({ theme }) => ({
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

export default function SuperSearchBar() {
	// 参考
	// https://mui.com/material-ui/react-autocomplete/

	// 入力された値を管理するstate
	const [inputValues, setInputValues] = useState<
		Array<inputValueSearchSuggestion>
	>([]);

	// 検索候補
	const searchSuggestions: Array<searchSuggestion> = [
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
		{
			sort: 100,
			label: "ぷらそにか",
			value: "ぷらそにか",
			categoryId: "organization",
			categoryLabel: "組織",
		},
		{
			label: "ぷらそにか",
			value: "UCZx7esGXyW6JXn98byfKEIA",
			categoryId: "YouTubeChannel",
			categoryLabel: "YouTubeチャンネル",
		},
		{
			sort: 100,
			label: "ぷらそにか東京",
			value: "ぷらそにか東京",
			categoryId: "organization",
			categoryLabel: "組織",
		},
		{
			label: "ながー４５６７８９１２３４５６い文字列",
			value: "長いテキスト",
			categoryId: "text",
			categoryLabel: "テキスト",
		},
		{
			label: "ながいカテゴリラベル",
			value: "長いカテゴリラベル",
			categoryId: "text",
			categoryLabel: "ながー４５６７８９１２３４５６いカテゴリラベル",
		},
	];
	// 検索候補(searchSuggestions)を加工してAutocompleteに渡す。
	const options: Array<inputValueSearchSuggestion> = searchSuggestions
		.map((option) => ({
			// sortが未定義の場合はデフォルトの数値を設定
			sort: option.sort !== undefined ? option.sort : -9999999,
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
		event: SyntheticEvent<Element, Event>,
		newValues: Array<inputValueSearchSuggestion | string>,
	): void => {
		let result: Array<inputValueSearchSuggestion> = [];
		for (const value of newValues) {
			// optionから選択されず直接入力されたのはstring型として出力されるため、
			// 必要に応じて型変換をする必要がある。
			if (typeof value === "string") {
				const item: inputValueSearchSuggestion = {
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
		result = result.sort((a, b) => b.sort - a.sort);
		setInputValues(result); // 入力値をstateに保存
	};

	return (
		<>
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
				getOptionLabel={(option) =>
					typeof option === "string"
						? "この文字列が出力されるのはおかしいよ"
						: option.label
				}
				// 選択不可のオプションを定義できる。
				// getOptionDisabled={(option) =>
				//     option === timeSlots[0] || option === timeSlots[2]
				// }
				// 現在の入力値
				value={inputValues}
				// 入力値変更時に呼び出される関数
				onChange={handleInputChange}
				// CSS
				sx={
					{
						// width: 600,
						// display: 'inline-block',
					}
				}
				// タグの表示に個数制限をかける。
				limitTags={3}
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
				renderTags={(value: Array<inputValueSearchSuggestion>, getTagProps) =>
					value.map((option: inputValueSearchSuggestion, index: number) => (
						<div
							key={`${option.label}-${option.categoryLabel}`} // 一意なキーを設定
						>
							<Chip
								variant="outlined"
								style={{
									height: "6ch",
								}}
								label={
									<div
										style={{
											textAlign: "center", // テキストを中央揃え
											maxWidth: "150px", // テキストの最大幅を指定
											whiteSpace: "nowrap", // 改行させない
											overflow: "hidden", // オーバーフロー時に隠す
											textOverflow: "ellipsis", // 長いテキストを省略して表示
										}}
									>
										<div>{option.label}</div>
										<div>{option.categoryLabel}</div>
									</div>
								}
								color="info"
								{...getTagProps({ index })}
							/>
						</div>
					))
				}
			/>
		</>
	);
}
