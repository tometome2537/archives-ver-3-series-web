import Image from "next/image";

export default function Thumbnail() {
  return (
    <div className="max-w-sm bg-white dark:bg-gray-800 dark:border-gray-700">
      <a href="#">
        <Image src={"/hqdefault.jpg"} width={480} height={360} alt=""></Image>
      </a>
      <p className="my-1 ml-2 font-normal text-gray-700 dark:text-gray-400">
        タイトルですよー
      </p>
    </div>
  );
}
