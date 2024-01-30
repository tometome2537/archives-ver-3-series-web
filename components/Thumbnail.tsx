"use client";

import Image from "next/image";

type Props = {
  title: string;
};

export default function Thumbnail({ title }: Props) {
  return (
    <div
      className="max-w-sm bg-white dark:bg-gray-800 dark:border-gray-700"
      key={title}
    >
      <a href="#">
        <Image src={"/hqdefault.jpg"} width={480} height={360} alt=""></Image>
      </a>
      <p className="my-1 ml-2 font-normal text-gray-700 dark:text-gray-400">
        {title}
      </p>
    </div>
  );
}
