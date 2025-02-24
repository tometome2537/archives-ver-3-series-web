import type { InputValue } from "@/components/Navbar/SearchBar/SearchBar";
import { useAppleMusic } from "@/contexts/AppleMusicContext";
import type { MediaItem, ResponseMusicApi } from "@/contexts/AppleMusicContext";
import { AppleMusicTypes } from "@/contexts/AppleMusicContext";
import { useBrowserInfoContext } from "@/contexts/BrowserInfoContext";
import { Box } from "@mui/material";
import { createElement, useEffect, useState } from "react";
import Album from "../Album";

type AppleMusicLibraryProps = {
    inputValue: InputValue[];
};

export default function AppleMusicLibrary(props: AppleMusicLibraryProps) {
    const { isMobile } = useBrowserInfoContext();
    const musicKit = useAppleMusic();

    const [recentlyAdded, setRecentlyAdded] = useState<{
        title?: string;
        items: MediaItem[];
    }>({ items: [] });

    useEffect(() => {
        if (props.inputValue.length !== 0) {
            const fetchLibrary = async () => {
                if (!musicKit.instance) return;
                const r: ResponseMusicApi = await musicKit.instance.api.music(
                    "/v1/catalog/jp/search",
                    {
                        term: props.inputValue[0].value,
                        types: AppleMusicTypes.albums,
                        limit: 12,
                        sort: "-releaseDate",
                    },
                );
                // setTest(r.data.results.albums.data);
                setRecentlyAdded({
                    title: "検索結果",
                    items: r.data.results.albums.data,
                });
            };
            fetchLibrary();
        } else {
            const fetchLibrary = async () => {
                if (!musicKit.instance) return;
                const r: ResponseMusicApi = await musicKit.instance.api.music(
                    "v1/me/library/albums",
                    { limit: 100, sort: "-dateAdded" },
                );
                setRecentlyAdded({
                    title: "最近追加した項目",
                    items: r.data.data,
                });
            };
            fetchLibrary();
        }
    }, [props.inputValue, musicKit.instance]);

    return (
        <>
            {/* <div>{JSON.stringify(test, null, "\n")}</div> */}
            {recentlyAdded.title && <h1>{recentlyAdded.title}</h1>}
            <Box
                sx={{
                    display: "flex",

                    justifyContent: "center", // 中央に配置
                    alignItems: "center", // 縦方向にも中央に配置
                    flexWrap: "wrap", // ラップさせて複数行に
                }}
            >
                {recentlyAdded.items.map((item: MediaItem) => (
                    <Box
                        key={item.id}
                        sx={{
                            width: isMobile ? "100%" : "30%",
                            maxWidth: isMobile ? "100%" : "30%",
                            margin: "0 auto",
                        }}
                    >
                        <Box
                            style={{
                                // padding: "0", // プレイヤーの上下にスペースを追加
                                margin: "0 auto",
                                maxWidth: "100%",
                                // パソコンのモニター等で無制限に大きくならないようにする。
                                maxHeight: "100%",
                            }}
                        >
                            {item.type === AppleMusicTypes["library-albums"] ? (
                                // alt={item.attributes.name}
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
                                    onClick={() => {
                                        musicKit.instance?.setQueue({
                                            album: item.id,
                                            startPlaying: true,
                                        });
                                        musicKit.instance?.play();
                                    }}
                                />
                            ) : (
                                createElement("apple-music-artwork-lockup", {
                                    type: item.type,
                                    "content-id": item.id,
                                })
                            )}
                        </Box>
                    </Box>
                ))}
            </Box>
        </>
    );
}
