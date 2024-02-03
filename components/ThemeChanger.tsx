"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5";

type Props = {
  className?: string | undefined;
};

export const ThemeChanger = ({ className }: Props) => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (mounted == false) {
    return null;
  }

  return (
    <button
      onClick={() => setTheme(theme == "light" ? "dark" : "light")}
      className={`absolute right-0 top-0 p-2 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 ${className}`}
    >
      <IoSunnyOutline size={24} className="block dark:hidden" />
      <IoMoonOutline size={24} className="hidden dark:block" />
    </button>
  );
};
