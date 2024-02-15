import { FaSearch } from "react-icons/fa";
import CircleButton from "../CircleButton";

export default function SearchBar() {
  return (
    <form className="flex w-full items-center justify-end" action="./send">
      <div className="w-full">
        <input
          type="text"
          id="simple-search-bar"
          className="block w-full rounded-full border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500  dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-green-500 dark:focus:ring-green-500"
          placeholder="検索"
          required
        />
      </div>
      <CircleButton icon={FaSearch}></CircleButton>
    </form>
  );
}
