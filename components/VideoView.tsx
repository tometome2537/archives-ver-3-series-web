import buildUrlWithQuery from "@/libs/buildUrl";
import fetcher from "@/libs/fetcher";
import { unescapeHtml } from "@/libs/unescapeHtml";
import { Button, Stack, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import type {
	MouseEvent,
	MouseEventHandler,
	Dispatch,
	SetStateAction,
} from "react";
import { useEffect, useRef, useState, useCallback } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import type YouTube from "react-youtube";
import type { YouTubeProps } from "react-youtube";
import useSWRInfinite from "swr/infinite";
import Loading from "./Loading";
import Thumbnail from "./Thumbnail";
import type { PlayerItem } from "./PlayerView";

interface Video {
	id: string;
	title: string;
}

type Props = {
	playerSize: number;
	isLargePlayer: boolean;
	searchQuery: string;
	playerItem: PlayerItem;
	setPlayerItem: Dispatch<SetStateAction<PlayerItem>>;
	setPlayerSearchResult: Dispatch<SetStateAction<Array<PlayerItem>>>;
};
type SortButtonProps = {
	order: string;
	currentOrder: string;
	text: string;
	onClick: MouseEventHandler<HTMLButtonElement>;
};

function SortButton(props: SortButtonProps) {
	const { order, currentOrder, onClick, text } = props;

	return (
		<Button
			variant={currentOrder === order ? "contained" : "outlined"}
			color="primary"
			data-order={order}
			onClick={onClick}
		>
			{text}
		</Button>
	);
}
export default function VideoView(props: Props) {
	// 見つかった動画の数を保持するステート
	const [videoCount, setVideoCount] = useState<number>(0);
	// ソート順を保持するステート（初期値は「人気順」）
	const [sortOrder, setSortOrder] = useState<string>("pop");

	// 選択されたYouTube動画のIDを保持するステート
	const [youtubeId, setYoutubeId] = useState<string>("");
	// YouTubeプレーヤーが表示されているかどうかのフラグ
	const [isYoutubePlayerVisible, setIsYoutubePlayerVisible] =
		useState<boolean>(false);

	// コンポーネントの初回マウント時に動画数を取得
	// コンポーネントの初回マウント時に動画数を取得
	useEffect(() => {
		const fetchData = async () => {
			await fetchVideoCount();
		};

		fetchData(); // 非同期関数を呼び出す
	}, []);

	// APIから動画数を取得する関数
	const fetchVideoCount = useCallback(async () => {
		// クエリを含むURLを作成
		const url = buildUrlWithQuery(
			`${process.env.NEXT_PUBLIC_BASE_URL}/videos/count`,
			{ search: props.searchQuery },
		);

		// fetchを使用して動画数を取得
		fetch(url, { cache: "no-store" })
			.then(async (response) => await response.json())
			.then((data) => {
				setVideoCount(Number.parseInt(data.videoCount)); // 取得した動画数をステートに設定
			});
	}, [props.searchQuery]);

	// 検索クエリが変更されるたびに動画数を再取得
	useEffect(() => {
		fetchVideoCount();
	}, [fetchVideoCount]);

	// YouTubeプレーヤーの参照を保持
	const youtubePlayer = useRef<YouTube>(null);

	// YouTubeプレーヤーの準備完了時に呼ばれるイベントハンドラ
	const onPlayerReady: YouTubeProps["onReady"] = (event) => {
		// プレーヤーの制御オブジェクトにアクセスし、一時停止させる
		event.target.pauseVideo();
	};

	// YouTubeプレーヤーのオプション設定
	const playerOptions: YouTubeProps["opts"] = {
		playerVars: {
			autoplay: 1, // 自動再生を有効にする
		},
	};

	// 動画サムネイルがクリックされたときに呼ばれる関数
	function handleVideoClick(event: React.MouseEvent<HTMLButtonElement>) {
		// クリックされた動画のIDを取得しステートに設定
		setYoutubeId(event.currentTarget.dataset.videoId ?? "");

		// プレーヤーが非表示のときだけ表示させる
		if (!isYoutubePlayerVisible) {
			setIsYoutubePlayerVisible(true);
		}

		// 新しいタブでYouTubeの動画を開く
		// window.open(`https://youtube.com/watch?v=${e.currentTarget.dataset.id}`);

		// ここからとめとめ追記 2024/09/26
		const videoId = event.currentTarget.getAttribute("data-videoId");
		props.setPlayerItem({
			videoId: videoId ?? "",
		});
		// APIから受け取った値の型を変換する。
		const searchResult: Array<PlayerItem> = [{ videoId: videoId ?? "" }];
		// const searchResult: Array<PlayerItem> = apiDataVideo.map((item: VideoTemporaryObj, index: number) => {
		//   let result: PlayerItem = {
		//     videoId: item.videoId,
		//     title: item.title,
		//     viewCount: Number(item.viewCount),
		//     channelId: item.channelId,
		//     channelTitle: item.channelTitle,
		//     publishedAt: item.publishedAt ? new Date(item.publishedAt) : undefined,
		//     actorId: item.person.split(/ , |,| ,|, /).filter(v => v),
		//     organization: Object.keys(JSON.parse(item.organization))
		//   };
		//   return result;
		// });
		props.setPlayerSearchResult(searchResult);
		// ここまでとめとめ追記
	}

	const itemsPerPage = 30; // 1ページあたりの表示数

	// ページごとにURLを生成する関数（無限スクロール用）
	const generateUrlForPage = (
		pageIndex: number,
		previousPageData: Video[][],
	) => {
		if (previousPageData && !previousPageData.length) return null; // 最後のページに到達した場合
		// クエリを含むURLを作成
		const url = buildUrlWithQuery(
			`${process.env.NEXT_PUBLIC_BASE_URL}/videos`,
			{
				search: props.searchQuery,
				page: pageIndex,
				take: itemsPerPage,
				sort: sortOrder,
			},
		);
		return url;
	};

	// useSWRInfiniteでデータを取得し、ページごとに管理
	const { data, size, setSize } = useSWRInfinite(generateUrlForPage, fetcher, {
		revalidateIfStale: false, // キャッシュがあっても再検証しない
		revalidateOnFocus: false, // ウィンドウをフォーカスしても再検証しない
		revalidateFirstPage: false, // 2ページ目以降を読み込むとき、1ページ目を再検証しない
	});

	// データが空かどうかのチェック
	const isEmpty = data?.[0]?.length === 0;
	// 最後のページかどうかのチェック
	const isReachingEnd =
		isEmpty ||
		(data && data?.[data?.length - 1]?.length < itemsPerPage) ||
		false;

	// 最後まで到達した場合のメッセージ
	const endMessage = (
		<Typography
			align="center"
			sx={{ my: 2 }}
			variant="h2"
			color="text.secondary"
		>
			{size > 0
				? "これ以上動画はありません(´;ω;｀)"
				: "動画が見つかりませんでした(´;ω;｀)"}
		</Typography>
	);

	// 動画サムネイルリストのコンテンツ
	const scrollContents = (
		<Grid2 container spacing={2} mx={2} justifyContent="left">
			{data?.flat()?.map((item, index) => (
				<Thumbnail
					key={item}
					isPlayingOnHover={
						props.playerItem.videoId === "" ||
						props.playerItem.videoId === undefined
					}
					thumbnailType="card"
					videoId={item.id}
					title={unescapeHtml(item.title)}
					onClick={handleVideoClick}
				/>
			))}
		</Grid2>
	);

	// ソートボタンの参照
	const sortRadio = useRef<HTMLDivElement>(null);

	// ソートボタンがクリックされたときの処理
	const handleSortChange = (e: MouseEvent<HTMLButtonElement>) => {
		const newOrder = e.currentTarget.dataset.order;
		if (newOrder === sortOrder) return; // 変更がない場合は処理しない

		setSortOrder(newOrder || ""); // ソート順を変更
	};

	return (
		<>
			{/* ヒットした動画数とソートオプションの表示 */}
			<Stack direction={"row"} sx={{ mx: 4 }} justifyContent={"space-between"}>
				<Typography variant="h5" sx={{ my: 2 }} color="text.secondary">
					{Number.isNaN(videoCount) ? "？" : videoCount.toLocaleString()} 件
				</Typography>
				<Stack
					direction="row"
					spacing={2}
					justifyContent="flex-end"
					alignItems="center"
					ref={sortRadio}
				>
					<SortButton
						order="pop"
						currentOrder={sortOrder}
						onClick={handleSortChange}
						text="人気順"
					/>
					<SortButton
						order="new"
						currentOrder={sortOrder}
						onClick={handleSortChange}
						text="新しい"
					/>
					<SortButton
						order="old"
						currentOrder={sortOrder}
						onClick={handleSortChange}
						text="古い"
					/>
				</Stack>
			</Stack>

			{/* 無限スクロールの実装 */}
			<InfiniteScroll
				dataLength={data?.flat().length || 0}
				next={() => setSize(size + 1)}
				hasMore={!isReachingEnd}
				loader={<Loading />}
				endMessage={endMessage}
			>
				{scrollContents}
			</InfiniteScroll>
		</>
	);
}
