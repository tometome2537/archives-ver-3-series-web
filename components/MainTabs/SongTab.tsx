import type { InputValue } from "@/components/Navbar/SearchBar/SearchBar";
import { useApiDataContext } from "@/contexts/ApiDataContext";
import type { ArtistYTM } from "@/contexts/ApiDataContext";
import { useBrowserInfoContext } from "@/contexts/BrowserInfoContext";
import { Box } from "@mui/material";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import Album from "../Album";
import type { PlayerItem, PlayerPlaylist } from "../PlayerView";
import Thumbnail from "../Thumbnail";

type SongTabProps = {
    inputValue: InputValue[];

    playerItem: PlayerItem | undefined;
    setPlayerItem: Dispatch<SetStateAction<PlayerItem | undefined>>;
    setPlayerPlaylist: Dispatch<SetStateAction<PlayerPlaylist | undefined>>;
};

export default function SongTab(props: SongTabProps) {
    const apiData = useApiDataContext("YouTubeAccount");
    // ブラウザ情報を取得
    const { isMobile } = useBrowserInfoContext();

    const [artistYTM, setArtistYTM] = useState<ArtistYTM | null>(null);

    const fetchArtistYTM = useCallback(
        async (channelId: string) => {
            const d = await apiData.ArtistYTM.getDataWithParams({
                channelId: channelId,
            });
            setArtistYTM(d);
        },
        [apiData.ArtistYTM.getDataWithParams],
    );

    useEffect(() => {
        // 各inputValueに対してすべての条件を確認
        const channelId = apiData.YouTubeAccount.data.find((item) => {
            for (const inputValue of props.inputValue) {
                // トピックチャンネルの方が取得できる情報量が多い。
                if (
                    inputValue.categoryId === "actor" ||
                    inputValue.categoryId === "organization"
                ) {
                    if (!(item.topic || item.officialArtistChannel)) {
                        return false;
                    }
                    if (item.entityId) {
                        return item.entityId.match(inputValue.value);
                    }
                    return false;
                }
            }
        });
        if (channelId) {
            fetchArtistYTM(channelId.userId ?? "");
        } else {
            // ↓ 開発中の仮設定
            // YOASOBI - Topic
            // fetchArtistYTM("UCI6B8NkZKqlFWoiC_xE-hzA");
            // 幾田りら - Topic
            // fetchArtistYTM("UCISF03gz20_8vWnkSVYlOEw");
            // 小玉ひかり - Topic
            // fetchArtistYTM("UC6BP3fgj6dF0wOrwBO5_PKQ");
            // GReeeeN(GRe4N BOYZ) - Topic
            // fetchArtistYTM("UChGJnU2_JNprD1sAtQJpZkA");
        }
    }, [props.inputValue, apiData, fetchArtistYTM]);

    return (
        <>
            <div>楽曲集</div>
            <div
                style={{
                    width: "100%",
                    height: "auto",
                }}
            >
                {artistYTM?.thumbnails?.[0]?.url ? (
                    <div
                        style={{
                            width: "30vw",
                        }}
                    >
                        <Image
                            src={artistYTM.thumbnails[0].url}
                            alt={artistYTM.name || "アーティストの画像"}
                            width={320} // アスペクト比のための幅
                            height={180} // アスペクト比のための高さ
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                                borderRadius: "1.2em",
                            }}
                        />
                    </div>
                ) : (
                    <div>画像が見つかりません</div> // フォールバック対応
                )}
            </div>
            <div>概要</div>
            <div>{artistYTM?.description || "説明がありません"}</div>
            <div>ソング</div>
            <div
                style={{
                    // display: "flex",
                    // overflowX: "scroll",
                    maxWidth: "100vw",
                    textAlign: "center",
                }}
            >
                {artistYTM?.songs?.results?.map((single) => (
                    <div key={single.browseId}>
                        <Box
                            sx={{
                                width: isMobile ? "100%" : "auto",
                                maxWidth: isMobile ? "100%" : "30%",
                            }}
                        >
                            <Thumbnail
                                thumbnailType={"list"}
                                videoId={single.videoId}
                                title={single.title}
                                // viewCount={Number(single.)}
                                channelTitle={single.artists[0].name}
                                // publishedAt={new Date(single. || 0)}
                                onClick={() => {
                                    props.setPlayerItem({
                                        mediaId: single.videoId,
                                        title: single.title,
                                        author: single.artists[0].name,
                                    });
                                }}
                            />
                        </Box>
                    </div>
                ))}
            </div>
            <div>アルバム</div>
            <div
                style={{
                    display: "flex",
                    overflowX: "scroll",
                    maxWidth: "100vw",
                    textAlign: "center",
                }}
            >
                {artistYTM?.albums?.results?.map((album) => (
                    <Album
                        key={album.browseId}
                        title={album.title || "シングルの画像"}
                        imgSrc={album.thumbnails[0].url}
                        onClick={() => {
                            const fetch = async () => {
                                const albumData =
                                    await apiData.AlbumYTM.getDataWithParams({
                                        browseId: album.browseId,
                                    });
                                props.setPlayerItem({
                                    mediaId: albumData?.tracks[0].videoId,
                                });
                                if (
                                    albumData &&
                                    albumData.tracks.length !== 0
                                ) {
                                    props.setPlayerPlaylist({
                                        title: albumData?.title,
                                        videos: albumData?.tracks.map(
                                            (item) => {
                                                return {
                                                    videoId: item.videoId,
                                                    title: item.title,
                                                    channelTitle:
                                                        item.artists[0].name,
                                                };
                                            },
                                        ),
                                    });
                                }
                            };
                            fetch();
                        }}
                    />
                ))}
            </div>
            <div>シングル</div>
            <div
                style={{
                    display: "flex",
                    overflowX: "scroll",
                    maxWidth: "100vw",
                    textAlign: "center",
                }}
            >
                {artistYTM?.singles?.results?.map((single) => (
                    <Album
                        key={single.browseId}
                        title={single.title || "シングルの画像"}
                        imgSrc={single.thumbnails[0].url}
                        onClick={() => {
                            const fetch = async () => {
                                const albumData =
                                    await apiData.AlbumYTM.getDataWithParams({
                                        browseId: single.browseId,
                                    });
                                props.setPlayerItem({
                                    mediaId: albumData?.tracks[0].videoId,
                                    // arHeight: 1,
                                    // arWidth: 1
                                });
                            };
                            fetch();
                        }}
                    />
                ))}
            </div>
            <div>ビデオ</div>
            <div
                style={{
                    display: "flex",
                    overflowX: "scroll",
                    maxWidth: "100vw",
                    textAlign: "center",
                    gap: "10px", // アイテム間のスペースを追加
                }}
            >
                {artistYTM?.videos?.results?.map((video) => (
                    <div key={video.videoId}>
                        <Box
                            sx={{
                                width: isMobile ? "100%" : "35vw",
                                // maxWidth: isMobile ? "100%" : "30%",
                            }}
                        >
                            <Thumbnail
                                videoId={video.videoId}
                                title={video.title}
                                // viewCount={Number(single.)}
                                channelTitle={video.artists[0].name}
                                // publishedAt={new Date(single. || 0)}
                                onClick={() => {
                                    props.setPlayerItem({
                                        mediaId: video.videoId,
                                        title: video.title,
                                        author: video.artists[0].name,
                                    });
                                }}
                            />
                        </Box>
                    </div>
                ))}
            </div>
        </>
    );
}
