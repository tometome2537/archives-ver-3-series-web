# ぷらそにかアーカイブス（web版）ver3.0.0 


# 概要
ぷらそにか公式Youtubeチャンネル([↗︎](https://www.youtube.com/channel/UCZx7esGXyW6JXn98byfKEIA))内の動画約700本(2023/10/09 現在)において、特定のぷらそにかメンバーが出演している動画をリスト表示できることが主な機能である。１日１本見ても約２年楽しめるボリュームとなっている。


# 技術仕様
・GitHub内にあるwebサイト表示に必要なデータをnetlify（　http://netlify.app ）というサービスを利用して公開している。
・使用言語はTypeScript（JSでサイトを開発するより、型あり、大規模開発に適している言語を使用したいと考えたため。）


# 開発における注意点

## 動画一覧を古い順に表示する機能の廃止
古い動画より新しくパワーアップした動画を閲覧してほしいため。
初めてサイトを訪問した人が古い動画を最初に見ることを防止する。

## 一部ぷらそにかメンバーの非表示について
現在は活動が停止している過去のぷらそにかメンバーについてはサイト上で非表示にしている。


# 開発環境の構築

## node.jsのインストール
https://nodejs.org/ja/

インストール方法（参考）はこちら
https://tometome.notion.site/node-js-Mac-a071f2c301d94dc6a1e2445881332a10?pvs=4

## VS Codeインストール
https://code.visualstudio.com


# 使い方

メインディレクトリに移動して

```bash
npm install
```

でパッケージを読み込み

```bash
npx parcel index.html --open
```

でブラウザを開いてくれる。

TSのビルドもしてくれる

```bash
ctrl c
```

でコマンドプロンプトから抜ける


# 使用しているライブラリ（package.jsonで確認可能）

dependencies
	typescript → typescriptlang.org
	jquery → jquery.com
	materialize-css → materializecss.com
	firebase → firebase.google.com
	youtube-player → npmjs.com/package/youtube-player
	@types/firebase → ???

devDependencies(開発またはデプロイ時に必要なライブラリ)
	@types/materialize-css → materialize-cssをtypescriptに対応させるのに必要
	parcel → typescriptのコードをプレビューするために必要。
	process → ???



# 今後追記予定のコード
・スクレイピングを禁止するためのコード 
→ スクレイピングする人はgoogle.comへ
```jsx
if (navigator.webdriver === true) {
		location.href = 'https://google.com';
}
```
・右クリック禁止
```jsx
document.oncontextmenu = () => false;
```


<!-- This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details. -->
