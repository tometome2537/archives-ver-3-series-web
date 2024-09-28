// 型をより具体的に定義するために、anyをunknownに置き換え
const replacer = (key: string, value: unknown) =>
  typeof value === "bigint" ? value.toString() : value;

// JSONBIとしての機能を持つ関数群
export const JSONBI = {
  // dataの型をunknownに変更
  stringify(data: unknown): string {
    return JSON.stringify(data, replacer);
  },

  // データをシリアライズするメソッド
  serializable(data: unknown): string {
    return JSONBI.stringify(data);
  },
};
