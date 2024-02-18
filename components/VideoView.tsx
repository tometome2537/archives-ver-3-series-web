import Thumbnail from "@/components/Thumbnail";
import { MouseEvent, useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import YouTube, { YouTubeProps } from "react-youtube";
import Loading from "./Loading";

interface Video {
  id: string;
  title: string;
}

type Props = {
  playerSize: number;
  isLargePlayer: boolean;
};

export default function VideoView({ playerSize, isLargePlayer }: Props) {
  const [items, setItems] = useState<Video[]>([]);
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

  const getVideos = async (take: number): Promise<Video[]> => {
    const result = await fetch(
      `/api/videos?skip=${items.length}&take=${take}&sort=${sortOrder}`,
      {
        cache: "no-store",
      }
    );
    const json: Video[] = await result.json();
    return json;
  };

  useEffect(() => {
    getVideos(30).then((x) => {
      setItems(x);
    });

    fetch(`/api/videos/count`, {
      cache: "no-store",
    })
      .then((x) => {
        return x.text();
      })
      .then((x) => {
        //エラーのときは処理しない
        if (x.includes("error") == false) {
          setHitVideos(parseInt(x));
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortOrder]);

  const fetchMoreData = async () => {
    const result = await getVideos(20);
    setItems(items.concat(result));

    if (result.length < 1) {
      setHasMore(false);
      return;
    }
  };

  //ロード中に表示する項目
  const loader = (
    <div className="my-8 flex items-center justify-center">
      <Loading />
    </div>
  );

  const endMessage = (
    <p className="flex items-center justify-center py-8 text-3xl">
      {items.length > 0
        ? "これ以上動画はありません(´;ω;｀)"
        : "動画が見つかりませんでした(´;ω;｀)"}
    </p>
  );

  const playerSizeAsClassName = () => {
    switch (playerSize) {
      case 0:
        return "xl:w-96";
      case 1:
        return "xl:w-128";
      case 2:
        return "xl:w-192";
    }
  };

  const sortRadio = useRef<HTMLDivElement>(null);

  const scrollContents = (
    <div className="container mx-[48px]">
      <div
        className={`flex flex-col items-center justify-center gap-4 xl:flex-row
        ${isLargePlayer ? "xl:items-start xl:justify-start" : ""}
        `}
      >
        <div className={`mb-4 flex max-w-full flex-wrap justify-between`}>
          {items.length > 0 &&
            items.map((item, index) => (
              <Thumbnail
                key={index}
                videoId={item.id}
                title={item.title}
                onClick={onClickVideo}
              ></Thumbnail>
            ))}
        </div>
      </div>
    </div>
  );

  const sort = (e: MouseEvent<HTMLButtonElement>) => {
    const current = sortRadio.current;
    if (current == null) return;

    const newOrder = e.currentTarget.dataset.order;
    //変わってないなら変更処理しなくていい
    if (newOrder == sortOrder) return;

    //すべての子要素からcurrentを削除
    const children = current?.children;
    for (let i = 0; i < children.length; i++) {
      const childElement = children[i];
      if (childElement.classList.contains("current") == false) continue;

      childElement.classList.remove("current");
    }

    e.currentTarget.classList.add("current");
    setSortOrder(e.currentTarget.dataset.order || "");
    setHasMore(true);
    setItems([]);
  };

  return (
    <>
      <div className="p-3">
        <div className="mt-14 pt-2">
          <div className="flex flex-row items-center justify-between pb-4">
            <p className="text-xl">{hitVideos.toLocaleString()} 件</p>
            <div
              className="flex flex-row items-center justify-between gap-4"
              ref={sortRadio}
            >
              <button
                data-order="pop"
                className="current current:bg-green-700 inline-flex items-center rounded-lg bg-stone-500 px-10 py-2 text-center text-white hover:bg-green-800 dark:bg-stone-500 dark:hover:bg-green-700 dark:focus:ring-green-800"
                onClick={(e: MouseEvent<HTMLButtonElement>) => sort(e)}
              >
                人気順
              </button>
              <button
                data-order="new"
                className="current:bg-green-700 inline-flex items-center rounded-lg bg-stone-500 px-10 py-2 text-center text-white hover:bg-green-800 dark:bg-stone-500 dark:hover:bg-green-700 dark:focus:ring-green-800"
                onClick={(e: MouseEvent<HTMLButtonElement>) => sort(e)}
              >
                新しい順
              </button>
              <button
                data-order="old"
                className="current:bg-green-700 inline-flex items-center rounded-lg bg-stone-500 px-10 py-2 text-center text-white hover:bg-green-800 dark:bg-stone-500 dark:hover:bg-green-700 dark:focus:ring-green-800"
                onClick={(e: MouseEvent<HTMLButtonElement>) => sort(e)}
              >
                古い順
              </button>
            </div>
          </div>
          <InfiniteScroll
            dataLength={items.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={loader}
            endMessage={endMessage}
          >
            {scrollContents}
          </InfiniteScroll>
        </div>
      </div>
    </>
  );
}
