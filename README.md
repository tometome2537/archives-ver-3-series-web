# ぷらそにかアーカイブス（web 版）ver3.0.0

# 概要

ぷらそにか公式 Youtube チャンネル([↗︎](https://www.youtube.com/channel/UCZx7esGXyW6JXn98byfKEIA))内の動画約 700 本(2023/10/09 現在)において、特定のぷらそにかメンバーが出演している動画をリスト表示できることが主な機能である。１日１本見ても約２年楽しめるボリュームとなっている。

# 技術仕様

- GitHub 内にある web サイト表示に必要なデータを Vercel（https://vercel.com）というサービスを利用して公開している。
- 使用言語は TypeScript（JS でサイトを開発するより、型あり、大規模開発に適している言語を使用したいと考えたため。）

# 開発における注意点

頑張る

## 動画一覧を古い順に表示する機能の廃止

古い動画より新しくパワーアップした動画を閲覧してほしいため。
初めてサイトを訪問した人が古い動画を最初に見ることを防止する。

## 一部ぷらそにかメンバーの非表示について

現在は活動が停止している過去のぷらそにかメンバーについてはサイト上で非表示にしている。

# 開発環境の構築

## node.js のインストール

https://nodejs.org/ja/

インストール方法（参考）はこちら
https://tometome.notion.site/node-js-Mac-a071f2c301d94dc6a1e2445881332a10?pvs=4

## VS Code インストール

https://code.visualstudio.com

# 使い方

メインディレクトリに移動して

```bash
npm install
```

でパッケージを読み込み

```bash
npm run dev
```

でブラウザを開いてくれる。
ローカルネットワーク内で公開する場合。
```bash
npm run dev -- -H 0.0.0.0
```

TS のビルドもしてくれる

```bash
ctrl c
```

でコマンドプロンプトから抜ける

# prisma の db を push する

```
npm run prisma:push
```

# 今後追記予定のコード

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
