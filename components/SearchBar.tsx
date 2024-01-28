import { FaSearch } from "react-icons/fa";

export default function SearchBar() {
  return (
    <form className="flex items-center w-112 mx-auto" action="./send">
      <label htmlFor="simple-search-bar" className="sr-only">
        Search
      </label>
      <div className="w-full">
        <input
          type="text"
          id="simple-search-bar"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-green-500 focus:border-green-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
          placeholder="検索"
          required
        />
      </div>
      <button
        type="submit"
        className="p-2.5 ms-2 text-sm font-medium text-white bg-green-700 rounded-full border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
      >
        <FaSearch />
        <span className="sr-only">Search</span>
      </button>
    </form>
  );
}
