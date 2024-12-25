import type { InputValue } from "@/components/Navbar/SearchBar/SearchBar";
import { useApiDataContext } from "@/contexts/ApiDataContext";
import { useEffect, useState, useCallback } from "react";
import type { ArtistYTM, YouTubeAccount } from "@/contexts/ApiDataContext";
import Image from "next/image";

type SongTabProps = {
    inputValue: InputValue[];
};

export default function SongTab(props: SongTabProps) {
    const apiData = useApiDataContext("YouTubeAccount");

    const [artistYTM, setArtistYTM] = useState<ArtistYTM | null>(null);

    const fetchArtistYTM = useCallback(
        async (channelId: YouTubeAccount) => {
            const d = await apiData.ArtistYTM.getData({
                mode: "get_artist",
                channelId: channelId.userId,
            });
            setArtistYTM(d);
        },
        [apiData.ArtistYTM.getData],
    );

    useEffect(() => {
        // 各inputValueに対してすべての条件を確認
        const channelId = apiData.YouTubeAccount.data.find((item) => {
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
            for (const inputValue of props.inputValue) {
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
        });
        if (channelId) {
            fetchArtistYTM(channelId);
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
            <div>シングル</div>
            <div
                style={{
                    display: "flex",
                    overflowX: "scroll",
                    maxWidth: "100vw",
                    textAlign: "center",
                }}
            >
                {artistYTM?.singles.results?.map((single) => (
                    <div key={single.browseId}>
                        <div
                            style={{
                                width: "20vw",
                                margin: "20px",
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
                        </div>
                        <div>{single.title}</div>
                    </div>
                ))}
            </div>
        </>
    );
}
