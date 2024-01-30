"use client";

import Main from "@/components/Main";
import Thumbnail from "@/components/Thumbnail";
import { useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

export default function Home() {
  const [items, setItems] = useState<number[]>(Array.from({ length: 50 }));
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchMoreData = () => {
    if (items.length >= 500) {
      setHasMore(false);
      return;
    }
    // a fake async api call like which sends
    // 20 more records in .5 secs
    setTimeout(() => {
      setItems(items.concat(Array.from({ length: 10 })));
    }, 500);
  };

  // //各スクロール要素
  // const items = (
  //   <div className="grid grid-cols-5 gap-4 mb-4">
  //     {list.map((value) => (
  //       <Thumbnail title={value.toString()}></Thumbnail>
  //     ))}
  //   </div>
  // );

  const scroll = useRef<HTMLDivElement>(null);

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

  return (
    <>
      <Main />

      <div className="p-4">
        <div className="pt-2 mt-14">
          <div className="flex flex-row items-center justify-between pb-4">
            <p className="text-lg">999,999,999 件</p>
            <div className="flex flex-row items-center justify-between gap-4">
              <a
                href="#"
                className="text-white bg-green-700 hover:bg-green-800 rounded-lg px-10 py-2 text-center inline-flex items-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              >
                人気順
              </a>
              <a
                href="#"
                className="text-white bg-green-700 hover:bg-green-800 rounded-lg px-10 py-2 text-center inline-flex items-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              >
                新しい順
              </a>
              <a
                href="#"
                className="text-white bg-green-700 hover:bg-green-800 rounded-lg px-10 py-2 text-center inline-flex items-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              >
                古い順
              </a>
            </div>
          </div>
          <InfiniteScroll
            dataLength={items.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={loader}
            endMessage={
              <p style={{ textAlign: "center" }}>
                <b>Yay! You have seen it all</b>
              </p>
            }
          >
            {
              <div className="grid grid-cols-5 gap-4 mb-4">
                {items.map((i, index) => (
                  <Thumbnail key={index} title={index.toString()}></Thumbnail>
                ))}
              </div>
            }
          </InfiniteScroll>
          <div className="grid grid-cols-5 gap-4 mb-4" ref={scroll}>
            {/* <Thumbnail title={"1"}></Thumbnail>
            <Thumbnail title={"1"}></Thumbnail>
            <Thumbnail title={"1"}></Thumbnail>
            <Thumbnail title={"1"}></Thumbnail>
            <Thumbnail title={"1"}></Thumbnail>
            <Thumbnail title={"1"}></Thumbnail>
            <Thumbnail title={"1"}></Thumbnail>
            <Thumbnail title={"1"}></Thumbnail>
            <Thumbnail title={"1"}></Thumbnail>
            <Thumbnail title={"1"}></Thumbnail>
            <Thumbnail title={"1"}></Thumbnail>
            <Thumbnail title={"1"}></Thumbnail>
            <Thumbnail title={"1"}></Thumbnail>
            <Thumbnail title={"1"}></Thumbnail>
            <Thumbnail title={"1"}></Thumbnail> */}
          </div>
        </div>
      </div>
    </>
  );
}
