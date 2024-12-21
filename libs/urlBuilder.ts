export function buildUrl(url: string, params: Record<string, string>): string {
    const urlSearchParam = new URLSearchParams(params).toString();

    if (url.endsWith("/")) {
        return `${url}?${urlSearchParam}`;
    }
    return `${url}/?${urlSearchParam}`;
}
