export const unescapeHtml = (str: any): string | any => {
    if (typeof str !== 'string') return str;

    const patterns: { [key: string]: string } = {
        '&lt;': '<',
        '&gt;': '>',
        '&amp;': '&',
        '&quot;': '"',
        '&#x27;': '\'',
        '&#x60;': '`',
        '&#39;': '\'',
        '&nbsp;': ' '
    };

    return str.replace(/&(lt|gt|amp|quot|#x27|#x60|#39|nbsp);/g, (match: string) => {
        return patterns[match];
    });
};