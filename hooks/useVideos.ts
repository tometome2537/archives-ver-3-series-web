import fetcher from "@/libs/fetcher";
import useSWR from "swr";

interface SWRVideos {
  quests: Video[];
  isLast: boolean;
  error: Error;
  fetcher: (
    key: string,
    pageIndex: number,
    limit: number,
    lastQuestDateTime: number,
  ) => Promise<Video[]>;
  loadMoreQuests: () => void; //追加読み込み
}

interface Video {
  id: string;
  title: string;
}

const useVideos = (
  searchQuery: string,
  skip: number,
  take: number,
  sortOrder: string,
) => {
  const url =
    process.env.NEXT_PUBLIC_BASE_URL +
    `/videos?search=${searchQuery}&skip=${skip}&take=${take}&sort=${sortOrder}`;
  const { data, error, isLoading, mutate } = useSWR(url, fetcher);

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};

export default useVideos;
