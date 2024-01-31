import Thumbnail from "@/components/Thumbnail";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import InfiniteScroll from "react-infinite-scroll-component";
import YouTube, { YouTubeProps } from "react-youtube";

interface Video {
  id: string;
  title: string;
}

type Props = {
  playerSize: number;
};

export default function VideoView({ playerSize }: Props) {
  const [items, setItems] = useState<Video[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);

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
      .then((x) => x.text())
      .then((x) => {
        setHitVideos(parseInt(x));
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
    <div className="grid grid-cols-subgrid col-span-5">
      <div className="flex items-center justify-center my-8">
        <div role="status">
          <svg
            aria-hidden
            className="inline w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-green-500"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    </div>
  );

  const endMessage = (
    <p className="flex items-center justify-center text-3xl py-8">
      {items.length > 0
        ? "これ以上動画はありません(´;ω;｀)"
        : "動画が見つかりませんでした(´;ω;｀)"}
    </p>
  );

  const scrollContents = (
    <div className="grid grid-cols-5 gap-4 mb-4">
      {items.map((item, index) => (
        <Thumbnail
          key={index}
          id={item.id}
          title={item.title}
          onClick={onClickVideo}
        ></Thumbnail>
      ))}
    </div>
  );

  const sortRadio = useRef<HTMLDivElement>(null);

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
    setItems([]);
  };

  const playerSizeAsClassName = () => {
    switch (playerSize) {
      case 0:
        return "w-96";
      case 1:
        return "w-128";
      case 2:
        return "w-192";
    }
  };
  return (
    <>
      <div className="p-4">
        <div className="pt-2 mt-14">
          <div className="flex flex-row items-center justify-between pb-4">
            <p className="text-xl">{hitVideos.toLocaleString()} 件</p>
            <div
              className="flex flex-row items-center justify-between gap-4"
              ref={sortRadio}
            >
              <button
                data-order="pop"
                className="current text-white bg-stone-500 current:bg-green-700 hover:bg-green-800 rounded-lg px-10 py-2 text-center inline-flex items-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                onClick={(e: MouseEvent<HTMLButtonElement>) => sort(e)}
              >
                人気順
              </button>
              <button
                data-order="new"
                className="text-white bg-stone-500 current:bg-green-700 hover:bg-green-800 rounded-lg px-10 py-2 text-center inline-flex items-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                onClick={(e: MouseEvent<HTMLButtonElement>) => sort(e)}
              >
                新しい順
              </button>
              <button
                data-order="old"
                className="text-white bg-stone-500 current:bg-green-700 hover:bg-green-800 rounded-lg px-10 py-2 text-center inline-flex items-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
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
      <div
        className={`fixed bottom-0 right-0  ${playerSizeAsClassName()} rounded-lg transition-transform ${
          visibleYoutubePlayer ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          className="absolute -top-12 right-0 rounded-t-lg bg-green-700 w-12 h-12 flex items-center justify-center"
          onClick={() => {
            setVisibleYoutubePlayer(false);
            youtubePlayer.current?.internalPlayer.pauseVideo();
          }}
        >
          <IoClose size={32} />
        </button>
        <YouTube
          className="relative w-full pt-[56.25%] bg-white rounded-tl-lg rounded-tr-lg rounded-bl-lg"
          iframeClassName="absolute top-0 right-0 w-full h-full rounded-tl-lg rounded-tr-lg rounded-bl-lg"
          videoId={youtubeId}
          opts={opts}
          onReady={onPlayerReady}
          ref={youtubePlayer}
        />
      </div>
    </>
  );
}
