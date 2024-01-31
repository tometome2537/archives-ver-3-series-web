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
    <button
      className="max-w-sm rounded-lg flex-1 bg-white dark:bg-gray-800 dark:border-gray-700"
      key={title}
      data-id={id}
      onClick={onClick}
    >
      <Image
        //sddefault
        //hqdefault
        src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`}
        width={480}
        height={360}
        alt={`https://youtube.com/watch?v=${id}`}
        className="rounded-t-lg"
      ></Image>
      <p className="my-1 ml-2 text-left line-clamp-2 font-normal text-gray-700 dark:text-gray-400">
        {title}
      </p>
    </button>
  );
}
