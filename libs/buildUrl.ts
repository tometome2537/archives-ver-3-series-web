export default function buildUrlWithQuery(baseUrl: string, queryParams: Record<string, any>) {
    const paramsObject = new URLSearchParams();

    // パラメータが渡されている場合のみ、クエリパラメータを追加します
    for (const [key, value] of Object.entries(queryParams)) {
        if (key && value) {
            paramsObject.append(key, value.toString());
        }
    }

    const queryString = paramsObject.toString();
    return queryString !== "" ? `${baseUrl}?${queryString}` : baseUrl;
}
