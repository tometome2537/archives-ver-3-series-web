import useSWR from "swr";

import fetcher from "@/libs/fetcher";

interface Video {
    id: string;
    title: string;
}

const useVideos = (searchQuery: string, skip: number, take: number, sortOrder: string) => {
    const url = `/api/videos?search=${searchQuery}&skip=${skip}&take=${take}&sort=${sortOrder}`;
    const { data, error, isLoading, mutate } = useSWR(url, fetcher);

    return {
        data,
        error,
        isLoading,
        mutate,
    };
};

export default useVideos;