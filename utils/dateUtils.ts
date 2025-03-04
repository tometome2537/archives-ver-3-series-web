/**
 * 指定された日時から現在までの経過時間を「〇〇前」形式で返す
 * @param publishedAt 基準となる日時
 * @returns 経過時間の文字列表現
 */
export function timeAgo(publishedAt: Date): string {
    const now: Date = new Date();
    const elapsed: number = now.getTime() - publishedAt.getTime(); // 経過時間をミリ秒で取得

    const seconds: number = Math.floor(elapsed / 1000); // 秒に変換
    const minutes: number = Math.floor(seconds / 60); // 分に変換
    const hours: number = Math.floor(minutes / 60); // 時間に変換
    const days: number = Math.floor(hours / 24); // 日に変換
    const weeks: number = Math.floor(days / 7); // 週に変換
    const months: number = Math.floor(days / 30); // 月に変換
    const years: number = Math.floor(days / 365); // 年に変換

    if (years > 0) {
        return `${years}年前`; // 年の場合
    }
    if (months > 0) {
        return `${months}ヶ月前`; // 月の場合
    }
    if (weeks > 0) {
        return `${weeks}週間前`; // 週の場合
    }
    if (days > 0) {
        return `${days}日前`; // 日の場合
    }
    if (hours > 0) {
        return `${hours}時間前`; // 時間の場合
    }
    if (minutes > 0) {
        return `${minutes}分前`; // 分の場合
    }

    return "たった今"; // 秒の場合
}

/**
 * 秒数を "分:秒" 形式の文字列に変換
 * @param seconds 秒数
 * @returns MM:SS 形式の文字列
 */
export function formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}
