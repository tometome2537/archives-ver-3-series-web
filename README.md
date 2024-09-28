# ミュージックアーカイブスプロジェクト（web 版）ver3.0.0

## 概要

ぷらそにか公式 Youtube チャンネル([↗︎](https://www.youtube.com/channel/UCZx7esGXyW6JXn98byfKEIA))内の動画約 700 本(2023/10/09 現在)において、特定のぷらそにかメンバーが出演している動画をリスト表示できることを目的に開発された。
現在ではぷらそにかチャンネル以外にも対応している。

## 技術仕様

- GitHub 内にある web サイト表示に必要なデータを Vercel（https://vercel.com）というサービスを利用して公開している。
- 使用言語は TypeScript

### 動画一覧を古い順に表示する機能の廃止

古い動画より新しくパワーアップした動画を閲覧してほしいため。
初めてサイトを訪問した人が古い動画を最初に見ることを防止する。

## 開発環境の構築

### 前提条件

- VSCode がインストールされている。
  https://code.visualstudio.com

- コードの整形には Biome を使用しています。

インストールコマンド

```bash
code --install-extension biomejs.biome
```

### ①node.js のインストール

https://nodejs.org/ja/

.nvmrc のファイルで定義されているバージョンを使用。不定期にアップデートしてます。

1 台の PC に複数バージョンの Node.Js を共存させる場合はこちらを参考にどうぞ。
https://tometome.notion.site/nvm-53d391fa3afb430e89e2bafbff852a1c

### ② サイトの起動

以下のコマンドで必要なライブラリをインストール

```bash
npm install
```

.env.example を参考に.env をファイルの作成。

サイトの立ち上げ。

```bash
npm run dev
```

サイト(サーバー)の立ち上げ。(ローカルネットワーク内で公開する場合。)

```bash
npm run dev -- -H 0.0.0.0
```

サイトを終了させる。

```bash
ctrl c
```

## 今後追記予定のコード

・スクレイピングを禁止するためのコード
→ スクレイピングする人は google.com へ

```jsx
if (navigator.webdriver === true) {
  location.href = "https://google.com";
}
```

・右クリック禁止

```jsx
document.oncontextmenu = () => false;
```
