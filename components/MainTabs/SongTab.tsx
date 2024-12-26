import type { InputValue } from "@/components/Navbar/SearchBar/SearchBar";
import { useApiDataContext } from "@/contexts/ApiDataContext";
import { useEffect, useState, useCallback } from "react";
import type { ArtistYTM, YouTubeAccount } from "@/contexts/ApiDataContext";
import Image from "next/image";
import type { PlayerItem,PlayerPlaylist } from "../PlayerView";
import type { Dispatch, SetStateAction } from "react";
import Thumbnail from "../Thumbnail";
import { Box, Container } from "@mui/material";
import { useBrowserInfoContext } from "@/contexts/BrowserInfoContext";

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
                mode: "get_artist",
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
                    if (!item.topic) {
                        return false;
                    }
                    if (item.entityId) {
                        return item.entityId.match(inputValue.value);
                    }
                    return false;
                }
            }
            for (const inputValue of props.inputValue) {
                if (
                    inputValue.categoryId === "actor" ||
                    inputValue.categoryId === "organization"
                ) {
                    if (item.entityId) {
                        return item.entityId.match(inputValue.value);
                    }
                    return false;
                }
            }
        });
        if (channelId) {
            fetchArtistYTM(channelId.userId);
        } else {
            // ↓ 開発中の仮設定
            // YOASOBI - Topic
            // fetchArtistYTM("UCI6B8NkZKqlFWoiC_xE-hzA");
            // 幾田りら - Topic
            // fetchArtistYTM("UCISF03gz20_8vWnkSVYlOEw");
            // 小玉ひかり - Topic
            fetchArtistYTM("UC6BP3fgj6dF0wOrwBO5_PKQ");
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
                                        videoId: single.videoId,
                                        title: single.title,
                                        channelTitle: single.artists[0].name,
                                        arHeight: 1,
                                        arWidth: 1,
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
                    <div key={album.browseId}>
                        <Box
                            style={{
                                width: "20vw",
                                margin: "20px",
                            }}
                            onClick={()=>{
                                const fetch = async ()=>{
                                    const albumData = await apiData.AlbumYTM.getDataWithParams({mode:"get_album",browseId:album.browseId})
                                    props.setPlayerItem({
                                        videoId: albumData?.tracks[0].videoId,
                                        arHeight: 1,
                                        arWidth: 1
                                    })
                                    if(albumData && albumData.tracks.length !== 0){
                                        props.setPlayerPlaylist({
                                            title: albumData?.title,
                                            videos: albumData?.tracks.map((item=>{
                                                return {
                                                    videoId: item.videoId,
                                                    title: item.title,
                                                    channelTitle: item.artists[0].name
                                                }
                                            }))
                                        })
                                    }
                                }
                                fetch()
                            }

                            }
                        >
                            <Image
                                key={album.thumbnails[0].url}
                                src={album.thumbnails[0].url}
                                alt={album.title || "シングルの画像"}
                                width={160} // アスペクト比のための幅
                                height={90} // アスペクト比のための高さ
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "contain",
                                    borderRadius: "1.2em",
                                }}
                            />
                        </Box>
                        <div>{album.title}</div>
                    </div>
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
                    <div key={single.browseId}>
                        <Box
                            style={{
                                width: "20vw",
                                margin: "20px",
                            }}
                            onClick={()=>{
                                const fetch = async ()=>{
                                    const albumData = await apiData.AlbumYTM.getDataWithParams({mode:"get_album",browseId:single.browseId})
                                    props.setPlayerItem({
                                        videoId: albumData?.tracks[0].videoId,
                                        // arHeight: 1,
                                        // arWidth: 1
                                    })
                                }
                                fetch()
                            }}
                        >
                            <Image
                                key={single.thumbnails[0].url}
                                src={single.thumbnails[0].url}
                                alt={single.title || "シングルの画像"}
                                width={160} // アスペクト比のための幅
                                height={90} // アスペクト比のための高さ
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "contain",
                                    borderRadius: "1.2em",
                                }}
                            />
                        </Box>
                        <div>{single.title}</div>
                    </div>
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
                                        videoId: video.videoId,
                                        title: video.title,
                                        channelTitle: video.artists[0].name,
                                        arHeight: 9,
                                        arWidth: 16,
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
