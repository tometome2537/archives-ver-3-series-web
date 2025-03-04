import type { InputValue } from "@/components/Navbar/SearchBar/SearchBar";
import { useAppleMusic } from "@/contexts/AppleMusicContext";
import type { MediaItem, ResponseMusicApi } from "@/contexts/AppleMusicContext";
import { AppleMusicTypes } from "@/contexts/AppleMusicContext";
import { useBrowserInfoContext } from "@/contexts/BrowserInfoContext";
import { Box, CircularProgress, Typography } from "@mui/material";
import { createElement, useCallback, useEffect, useState } from "react";
import Album from "../Album";

type AppleMusicLibraryProps = {
    inputValue: InputValue[];
};

type MusicLibraryState = {
    title?: string;
    items: MediaItem[];
    loading: boolean;
    error: string | null;
};

export default function AppleMusicLibrary(props: AppleMusicLibraryProps) {
    const { isMobile } = useBrowserInfoContext();
    const musicKit = useAppleMusic();

    const [libraryState, setLibraryState] = useState<MusicLibraryState>({
        items: [],
        loading: false,
        error: null,
    });

    const fetchSearchResults = useCallback(
        async (searchTerm: string) => {
            if (!musicKit.instance) return null;
            try {
                const response: ResponseMusicApi =
                    await musicKit.instance.api.music("/v1/catalog/jp/search", {
                        term: searchTerm,
                        types: AppleMusicTypes.albums,
                        limit: 12,
                        sort: "-releaseDate",
                    });
                return {
                    title: "検索結果",
                    items: response.data.results.albums.data,
                };
            } catch (error) {
                console.error("検索結果の取得に失敗しました:", error);
                return {
                    title: "検索結果",
                    items: [],
                    error: "検索結果の取得に失敗しました",
                };
            }
        },
        [musicKit.instance],
    );

    const fetchRecentlyAdded = useCallback(async () => {
        if (!musicKit.instance) return null;
        try {
            const response: ResponseMusicApi =
                await musicKit.instance.api.music("v1/me/library/albums", {
                    limit: 100,
                    sort: "-dateAdded",
                });
            return {
                title: "最近追加した項目",
                items: response.data.data,
            };
        } catch (error) {
            console.error("ライブラリの取得に失敗しました:", error);
            return {
                title: "最近追加した項目",
                items: [],
                error: "ライブラリの取得に失敗しました",
            };
        }
    }, [musicKit.instance]);

    useEffect(() => {
        const fetchData = async () => {
            setLibraryState((prev) => ({
                ...prev,
                loading: true,
                error: null,
            }));

            try {
                let result: {
                    title: string;
                    items: MediaItem[];
                    error?: string;
                } | null;
                if (props.inputValue.length !== 0) {
                    result = await fetchSearchResults(
                        props.inputValue[0].value,
                    );
                } else {
                    result = await fetchRecentlyAdded();
                }

                if (result) {
                    setLibraryState({
                        title: result.title,
                        items: result.items,
                        loading: false,
                        error: result.error || null,
                    });
                }
            } catch (error) {
                setLibraryState((prev) => ({
                    ...prev,
                    loading: false,
                    error: "データの取得中にエラーが発生しました",
                }));
            }
        };

        fetchData();
    }, [props.inputValue, fetchSearchResults, fetchRecentlyAdded]);

    const handleAlbumClick = useCallback(
        (itemId: string) => {
            if (musicKit.instance) {
                musicKit.instance.setQueue({
                    album: itemId,
                    startPlaying: true,
                });
                musicKit.instance.play();
            }
        },
        [musicKit.instance],
    );

    const renderAlbum = (item: MediaItem) => {
        if (item.type === AppleMusicTypes["library-albums"]) {
            return (
                <Album
                    style={{
                        width: isMobile ? "30vw" : "15vw",
                    }}
                    title={item.attributes.name}
                    year={item.attributes.artistName}
                    imgSrc={
                        item.attributes.artwork?.url
                            .replace("{w}", "400")
                            .replace("{h}", "400") ?? ""
                    }
                    onClick={() => handleAlbumClick(item.id)}
                />
            );
        }

        return createElement("apple-music-artwork-lockup", {
            type: item.type,
            "content-id": item.id,
        });
    };

    if (libraryState.loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", padding: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            {libraryState.title && (
                <Typography variant="h5" component="h1" sx={{ mb: 2 }}>
                    {libraryState.title}
                </Typography>
            )}

            {libraryState.error && (
                <Typography color="error" sx={{ mb: 2 }}>
                    {libraryState.error}
                </Typography>
            )}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 2,
                }}
            >
                {libraryState.items.map((item: MediaItem) => (
                    <Box
                        key={item.id}
                        sx={{
                            width: isMobile ? "100%" : "30%",
                            maxWidth: isMobile ? "100%" : "30%",
                            margin: "0 auto",
                            mb: 2,
                        }}
                    >
                        <Box
                            sx={{
                                margin: "0 auto",
                                maxWidth: "100%",
                                maxHeight: "100%",
                            }}
                        >
                            {renderAlbum(item)}
                        </Box>
                    </Box>
                ))}
            </Box>

            {libraryState.items.length === 0 &&
                !libraryState.loading &&
                !libraryState.error && (
                    <Typography sx={{ textAlign: "center", mt: 4 }}>
                        表示するアイテムがありません
                    </Typography>
                )}
        </>
    );
}
