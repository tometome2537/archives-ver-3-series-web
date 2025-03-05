// export const unescapeHtml = (str: string | undefined): string | undefined => {
//   // strが文字列でない場合はそのまま返す
//   if (typeof str !== "string") return str;

//   const patterns: { [key: string]: string } = {
//     "&lt;": "<",
//     "&gt;": ">",
//     "&amp;": "&",
//     "&quot;": '"',
//     "&#x27;": "'",
//     "&#x60;": "`",
//     "&#39;": "'",
//     "&nbsp;": " ",
//   };

//   // HTMLエスケープを解除
//   return str.replace(
//     /&(lt|gt|amp|quot|#x27|#x60|#39|nbsp);/g,
//     (match: string) => patterns[match] || match // patternsに見つからない場合はそのまま返す
//   );
// };

export const unescapeHtml = (html: string): string => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.documentElement.textContent || "";
};
