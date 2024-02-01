"use client";

import Image from "next/image";
import { MouseEventHandler } from "react";

type Props = {
  id: string;
  title: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
};

export default function Thumbnail({ id, title, onClick }: Props) {
  return (
    <div className="w-80 mx-auto rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700">
      <button key={title} data-id={id} onClick={onClick}>
        <div className="overflow-hidden">
          <Image
            //sddefault
            //hqdefault
            src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`}
            width={480}
            height={360}
            alt={`https://youtube.com/watch?v=${id}`}
            className="rounded-t-lg w-ful h-full object-cover hover:scale-110 transition-all duration-300"
          />
        </div>
        <p className="my-1 ml-2 text-left line-clamp-2 font-normal text-gray-700 dark:text-gray-400">
          {title}
        </p>
      </button>
    </div>
  );
}
