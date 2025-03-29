# ミュージックアーカイブスプロジェクト（web 版）ver3.0.0

## 概要

ぷらそにか公式 Youtube チャンネル([↗︎](https://www.youtube.com/channel/UCZx7esGXyW6JXn98byfKEIA))内の動画約 850 本(2025/2/25 現在)において、特定のぷらそにかメンバーが出演している動画をリスト表示できることを目的に開発された。
現在ではぷらそにかチャンネル以外にも対応している。

## 技術仕様

- GitHub 内にある web サイト表示に必要なデータを Vercel（<https://vercel.com）というサービスを利用して公開している。>
- 使用言語は TypeScript

- 動画一覧を古い順に表示する機能の廃止

  古い動画より新しくパワーアップした動画を閲覧してほしいため。
  初めてサイトを訪問した人が古い動画を最初に見ることを防止する。

## 開発環境の構築

### 前提条件

- VSCode がインストールされている。
  <https://code.visualstudio.com>

- コードのフォーマットには 拡張機能のBiome を使用しています。
([参考](https://tometome.notion.site/Biome-10f0553833378065a3b7cc7298b4d2fd?pvs=4))

  Biomeインストールコマンド

  ```bash
  code --install-extension biomejs.biome
  ```

### ① 実行環境のインストール

-  Node.jsを使用する場合

    <https://nodejs.org/ja/>

    `.nvmrc` のファイルで定義されているバージョンを使用。

    1 台の PC に複数バージョンの Node.Js を共存させる場合はこちらを参考にどうぞ。

    <https://tometome.notion.site/nvm-53d391fa3afb430e89e2bafbff852a1c>

- bunを使用する場合

  <https://bun.sh>

### ② サイトの起動

- 以下のコマンドで必要なライブラリをインストール

  ```bash
  # Node.jsの場合。
  npm install
  # bunの場合。 (早いけどバグがあるかも)
  bun install
  ```

- .env.example を参考に.env をファイルの作成。

- サイトの立ち上げ。

  ```bash
  # Node.jsの場合。
  npm run dev
  # bunの場合。 (早いけどバグがあるかも)
  bun run dev
  ```

- サイトを終了させる。

  ```bash
  ctrl c
  ```

## 今後追記予定のコード

- スクレイピングを禁止するためのコード

  → スクレイピングする人は google.com へ

  ```jsx
  if (navigator.webdriver === true) {
    location.href = "https://google.com";
  }
  ```

- 右クリック禁止

  ```jsx
  document.oncontextmenu = () => false;
  ```
