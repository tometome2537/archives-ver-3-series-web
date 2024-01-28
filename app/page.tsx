import Main from "@/components/Main";
import Thumbnail from "@/components/Thumbnail";

export default function Home() {
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
          <div className="grid grid-cols-5 gap-4 mb-4">
            <Thumbnail></Thumbnail>
            <Thumbnail></Thumbnail>
            <Thumbnail></Thumbnail>
            <Thumbnail></Thumbnail>
            <Thumbnail></Thumbnail>
            <Thumbnail></Thumbnail>
            <Thumbnail></Thumbnail>
            <Thumbnail></Thumbnail>
            <Thumbnail></Thumbnail>
            <Thumbnail></Thumbnail>
            <Thumbnail></Thumbnail>
            <Thumbnail></Thumbnail>
            <Thumbnail></Thumbnail>
            <Thumbnail></Thumbnail>
            <Thumbnail></Thumbnail>
            <Thumbnail></Thumbnail>
            <Thumbnail></Thumbnail>
            <Thumbnail></Thumbnail>
            <Thumbnail></Thumbnail>
            <Thumbnail></Thumbnail>
            <Thumbnail></Thumbnail>
            <Thumbnail></Thumbnail>
            <Thumbnail></Thumbnail>
            <Thumbnail></Thumbnail>
            <Thumbnail></Thumbnail>
            <Thumbnail></Thumbnail>
            <Thumbnail></Thumbnail>
            <Thumbnail></Thumbnail>
            <Thumbnail></Thumbnail>
            <Thumbnail></Thumbnail>
            <Thumbnail></Thumbnail>
            <Thumbnail></Thumbnail>
            <Thumbnail></Thumbnail>
          </div>
        </div>
      </div>
    </>
  );
}
