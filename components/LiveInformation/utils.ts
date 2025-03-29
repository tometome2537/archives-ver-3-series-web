// 日時フォーマット用のヘルパー関数
export const formatDateTime = (dateTimeString: string | null) => {
    if (!dateTimeString) return "未定";
    const date = new Date(dateTimeString);
    return date.toLocaleString("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
};
