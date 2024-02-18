"use client";

import Image from "next/image";
import { MouseEventHandler } from "react";

type Props = {
  videoId: string;
  title: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
};

export default function Thumbnail({ videoId, title, onClick }: Props) {
  return (
    <div className="w-80 rounded-lg bg-white dark:border-gray-700 dark:bg-gray-800">
      <button key={title} data-videoId={videoId} onClick={onClick}>
        <div className="overflow-hidden">
          <Image
            //sddefault
            //hqdefault
            src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
            width={480}
            height={360}
            alt={`https://youtube.com/watch?v=${videoId}`}
            className="size-full rounded-t-lg object-cover transition-all duration-300 hover:scale-110"
          />
        </div>
        <p className="my-1 ml-2 line-clamp-2 text-left font-normal text-gray-700 dark:text-gray-400">
          {title}
        </p>
      </button>
    </div>
  );
}
