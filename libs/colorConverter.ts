// カラーコードを変換する関数

export default function hexToRgb(hex: string) {
  // 先頭の#を除去
  hex = hex.replace(/^#/, "");

  // 16進数を3つの成分に分割
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255; // 赤成分
  const g = (bigint >> 8) & 255; // 緑成分
  const b = bigint & 255; // 青成分

  return { r, g, b }; // RGBオブジェクトを返す
}

// 使用例
//   const hexColor = "#ff6347"; // トマト色
//   const rgbColor = hexToRgb(hexColor);
//   console.log(rgbColor); // 出力: { r: 255, g: 99, b: 71 }

export function rgbToHex(r: number, g: number, b: number) {
  // 各成分を16進数に変換し、2桁にする
  const toHex = (c: number) => {
    const hex = c.toString(16).padStart(2, "0"); // 2桁になるように0で埋める
    return hex;
  };

  // 16進数カラーコードを生成
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// 使用例
//   const rgbColor = { r: 255, g: 99, b: 71 }; // RGB値 (例: トマト色)
//   const hexColor = rgbToHex(rgbColor.r, rgbColor.g, rgbColor.b);
//   console.log(hexColor); // 出力: #ff6347
