import SearchBar from "@/components/Navbar/SearchBar";
import Image from "next/image";
import { HiMenuAlt2 } from "react-icons/hi";
export default function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="p-3 lg:px-5 lg:pl-3">
        <div className="sm:flex">
          <div className="mb-2 flex items-center justify-start">
            <button
              data-drawer-target="logo-sidebar"
              data-drawer-toggle="logo-sidebar"
              aria-controls="logo-sidebar"
              type="button"
              className="inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            >
              <HiMenuAlt2 size={24} />
            </button>
            <a href="/" className="me-12 ms-2 flex md:me-24">
              <Image
                src={"/MAP.png"}
                width={150}
                height={60}
                alt="Logo"
                className="max-w-[150px]"
              ></Image>
            </a>
          </div>
          <div className="w-full md:w-128">
            <SearchBar />
          </div>
        </div>
      </div>
    </nav>
  );
}
