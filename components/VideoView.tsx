import Thumbnail from "@/components/Thumbnail";
import { Button, Stack, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import {
  MouseEvent,
  MouseEventHandler,
  useRef,
  useState,
} from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import YouTube, { YouTubeProps } from "react-youtube";
import Loading from "./Loading";
import { unescapeHtml } from "@/libs/unescapeHtml";
import useVideos from "@/hooks/useVideos";

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
  const [hasMore, setHasMore] = useState<boolean>(true);

  //見つかった動画の数
  const [hitVideos, setHitVideos] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<string>("pop");

  const [youtubeId, setYoutubeId] = useState<string>("");
  const [visibleYoutubePlayer, setVisibleYoutubePlayer] =
    useState<boolean>(false);

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
  }

  const { data: videos, error, mutate: mutatePosts } = useVideos(searchQuery, 0, 30, sortOrder);

  // useEffect(() => {
  //   getVideos(30).then((x) => {
  //     setItems(x);
  //   });

  //   fetch(`/api/videos/count?search=${searchQuery}`, {
  //     cache: "no-store",
  //   })
  //     .then((x) => {
  //       return x.text();
  //     })
  //     .then((x) => {
  //       //エラーのときは処理しない
  //       if (x.includes("error") == false) {
  //         setHitVideos(parseInt(x));
  //       }
  //     });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [sortOrder]);

  const fetchMoreData = async () => {
    // setItems(videos.concat(result));

    // if (result.length < 1) {
    //   setHasMore(false);
    //   return;
    // }
  };

  //ロード中に表示する項目
  const loader = (
    <Loading />
  );

  const endMessage = (
    <Typography
      align="center"
      sx={{ my: 2 }}
      variant="h2"
      color="text.secondary"
    >
      {videos.length > 0
        ? "これ以上動画はありません(´;ω;｀)"
        : "動画が見つかりませんでした(´;ω;｀)"}
    </Typography>
  );

  const scrollContents = (
    <Grid2 container spacing={2} mx={2} justifyContent="left">
      {videos.length > 0 &&
        (videos as Video[]).map((item, index) => (
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
    setHasMore(true);
    // setItems([]);
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
        dataLength={10}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={loader}
        endMessage={endMessage}
      >
        {scrollContents}
      </InfiniteScroll>
    </>
  );
}
