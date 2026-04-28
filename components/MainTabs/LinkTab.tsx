import type { InputValue } from "@/components/Navbar/SearchBar/SearchBar";
import { useApiDataContext } from "@/contexts/ApiDataContext";

type LinkTabProps = {
	inputValue: InputValue[];
};
export default function LinkTab(props: LinkTabProps) {
	const apiData = useApiDataContext("YouTubeAccount", "XAccount");

	const resultYouTubeAccounts = apiData.YouTubeAccount.data.filter((item) => {
		// 各inputValueに対してすべての条件を確認
		for (const inputValue of props.inputValue) {
			if (inputValue.categoryId === "actor") {
				if (!item.entityId?.match(inputValue.value)) {
					return false;
				}
			}
		}
		return true;
	});
	const resultXAccounts = apiData.XAccount.data.filter((item) => {
		// 各inputValueに対してすべての条件を確認
		for (const inputValue of props.inputValue) {
			if (inputValue.categoryId === "actor") {
				if (!item.entityId?.match(inputValue.value)) {
					return false;
				}
			}
		}
		return true;
	});

	return (
		<>
			<h1>それぞれのリンク集</h1>

			<h2>YouTube アカウント</h2>

			<div>
				{resultYouTubeAccounts?.map((item) => (
					<p key={item.userName}>{item.userName}</p>
				))}
			</div>

			<h2>𝕏 アカウント</h2>
			<div>
				{resultXAccounts?.map((item) => (
					<p key={item.userName}>@{item.userName}</p>
				))}
			</div>
		</>
	);
}
