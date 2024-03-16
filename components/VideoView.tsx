import fetcher from "@/libs/fetcher";
import { unescapeHtml } from "@/libs/unescapeHtml";
import { Button, Stack, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import {
  MouseEvent,
  MouseEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import YouTube, { YouTubeProps } from "react-youtube";
import useSWRInfinite from "swr/infinite";
import Loading from "./Loading";
import Thumbnail from "./Thumbnail";

interface Video {
  id: string;
  title: string;
}

type Props = {
  playerSize: number;
  isLargePlayer: boolean;
  searchQuery: string
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
      variant={currentOrder == order ? "contained" : "outlined"}
      color="primary"
      data-order={order}
      onClick={onClick}
    >
      {text}
    </Button>
  );
}

export default function VideoView({ playerSize, isLargePlayer, searchQuery }: Props) {
  //見つかった動画の数
  const [hitVideos, setHitVideos] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<string>("pop");

  const [youtubeId, setYoutubeId] = useState<string>("");
  const [visibleYoutubePlayer, setVisibleYoutubePlayer] =
    useState<boolean>(false);

  fetchHitVideos();
  function fetchHitVideos() {
    fetch(`/api/videos/count${searchQuery ? "?search=" + searchQuery : ""}`, {
      cache: "no-store",
    })
      .then(async (x) => {
        return x.text();
      })
      .then((x) => {
        //エラーのときは処理しない
        if (x.includes("error") == false) {
          setHitVideos(parseInt(x));
        }
      }).catch();
  }

  useEffect(() => {
    fetchHitVideos();
  }, [searchQuery]);

  const youtubePlayer = useRef<YouTube>(null);

  const onPlayerReady: YouTubeProps["onReady"] = (event) => {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  };

  const opts: YouTubeProps["opts"] = {
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };

  function onClickVideo(e: React.MouseEvent<HTMLButtonElement>) {
    setYoutubeId(e.currentTarget.dataset.id ?? "");

    //非表示になってるときだけ、表示のフラグを立てる
    if (visibleYoutubePlayer == false) {
      setVisibleYoutubePlayer(true);
    }

    window.open(`https://youtube.com/watch?v=${e.currentTarget.dataset.id}`);
  }

  const limit = 30; // 1ページあたり表示数
  const getKey = (pageIndex: number, previousPageData: Video[][]) => {
    if (previousPageData && !previousPageData.length) return null;// 最後に到達した
    return `/api/videos?${searchQuery ? "search=" + searchQuery : ""}&page=${pageIndex}&take=${limit}&sort=${sortOrder}` // SWR キー
  }

  const { data, size, setSize } = useSWRInfinite(getKey, fetcher, {
    revalidateIfStale: false, // キャッシュがあっても再検証しない
    revalidateOnFocus: false, // windowをフォーカスすると再検証しない
    revalidateFirstPage: false, // 2ページ目以降を読み込むとき毎回1ページ目を再検証しない
  });

  const isEmpty = data?.[0]?.length === 0; // 1ページ目のデータが空
  const isReachingEnd = isEmpty || (data && data?.[data?.length - 1]?.length < limit) || false; // 1ページ目のデータが空 or データの最後のデータが1ページあたりの表示数より少ないない

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

  const scrollContents = (
    <Grid2 container spacing={2} mx={2} justifyContent="left">
      {data?.flat().map((item, index) => (
        <Thumbnail
          key={index}
          videoId={item.id}
          title={unescapeHtml(item.title)}
          onClick={onClickVideo}
        ></Thumbnail>
      ))}
    </Grid2>
  );

  const sortRadio = useRef<HTMLDivElement>(null);

  const sort = (e: MouseEvent<HTMLButtonElement>) => {
    const newOrder = e.currentTarget.dataset.order;
    //変わってないなら変更処理しなくていい
    if (newOrder == sortOrder) return;

    //すべての子要素からcurrentを削除
    setSortOrder(e.currentTarget.dataset.order || "");
  };

  return (
    <>
      <Stack direction={"row"} sx={{ mx: 4 }} justifyContent={"space-between"}>
        <Typography variant="h5" sx={{ my: 2 }} color="text.secondary">
          {hitVideos.toLocaleString()} 件
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
            onClick={sort}
            text="人気順"
          ></SortButton>
          <SortButton
            order="new"
            currentOrder={sortOrder}
            onClick={sort}
            text="新しい"
          ></SortButton>
          <SortButton
            order="old"
            currentOrder={sortOrder}
            onClick={sort}
            text="古い"
          ></SortButton>
        </Stack>
      </Stack>
      <InfiniteScroll
        dataLength={data?.flat().length || 0}
        next={() => { setSize(size + 1) }}
        hasMore={isReachingEnd == false}
        loader={<Loading />}
        endMessage={endMessage}
      >
        {scrollContents}
      </InfiniteScroll>

    </>
  );
}
