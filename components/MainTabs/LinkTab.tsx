import type { InputValue } from "@/components/Navbar/SearchBar";
import { useDataContext } from "@/contexts/ApiDataContext";
import type { ApiData, DataContextType } from "@/contexts/ApiDataContext";

type LinkTabProps = {
    inputValue: InputValue[];
};
export default function LinkTab(props: LinkTabProps) {
    const apiData = useDataContext();

    const YouTubeAccounts: ApiData[] | undefined = apiData
        .find((item) => item.id === "YouTubeAccount")
        ?.data.filter((item) => {
            let match = true;
            // 各inputValueに対してすべての条件を確認
            for (const inputValue of props.inputValue) {
                if (inputValue.categoryId === "actor") {
                    if (!item.entityId?.match(inputValue.value)) {
                        match = false;
                    }
                }
            }
            return match;
        });
    const XAccounts: ApiData[] | undefined = apiData
        .find((item) => item.id === "XAccount")
        ?.data.filter((item) => {
            let match = true;
            // 各inputValueに対してすべての条件を確認
            for (const inputValue of props.inputValue) {
                if (inputValue.categoryId === "actor") {
                    if (!item.entityId?.match(inputValue.value)) {
                        match = false;
                    }
                }
            }
            return match;
        });

    return (
        <>
            <h1>それぞれのリンク集</h1>

            <h2>YouTube アカウント</h2>
            <div>
                {YouTubeAccounts?.map((item) => (
                    <p key={item.userName}>{item.userName}</p>
                ))}
            </div>

            <h2>𝕏 アカウント</h2>
            <div>
                {XAccounts?.map((item) => (
                    <p key={item.userName}>@{item.userName}</p>
                ))}
            </div>
        </>
    );
}
