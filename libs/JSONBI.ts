const replacer = (key: string, value: any) =>
  typeof value === "bigint" ? value.toString() : value;

export class JSONBI {
  private static stringify(data: any): string {
    return JSON.stringify(data, replacer);
  }

  public static serializable(data: any): string {
    return JSON.parse(JSONBI.stringify(data));
  }
}
