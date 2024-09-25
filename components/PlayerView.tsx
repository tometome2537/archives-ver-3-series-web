import React, {
    Dispatch,
    SetStateAction,
    useEffect,
    useState,
    MutableRefObject,
    // useRef
} from "react";
import Thumbnail from "./Thumbnail";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from '@mui/icons-material/Pause';
import YouTubePlayer from "./YouTubePlayer";

export type PlayerItem = {
    videoId?: string; // 動画IDをプロパティとして受け取る
    title?: string;
    channelId?: string;
    channelTitle?: string;
    publishedAt?: Date;
    actorId?: Array<string>;
    organization?: Array<string>;
};

type PlayerProps = {
    screenWidth: number;
    screenHeight: number;
    isMobile: boolean;
    // フルスクリーンで表示するかどうか
    isPlayerFullscreen: boolean;
    setIsPlayerFullscreen: Dispatch<SetStateAction<boolean>>;
    PlayerItem: PlayerItem;
    Playlist?: Array<PlayerItem>; // プレイリスト
    searchResult?: Array<PlayerItem>; // 検索結果のリスト
    style?: React.CSSProperties; // 外部からスタイルを受け取る（オプション）
    entityIdString: MutableRefObject<string[]>;
};

export default function PlayerView(props: PlayerProps) {
    // 現在再生されているvideoId
    const [playNowVideoId, setPlayNowVideoId] = useState<string>();
    // 現在再生されている動画の詳細情報
    const [playNowDetail, setPlayNowDetail] = useState<PlayerItem | undefined>();

    // propsのvideoIdが変更されたらplayNowVideoIdを更新。
    useEffect(() => {
        setPlayNowVideoId(props.PlayerItem.videoId);
        setPlayNowDetail(props.PlayerItem);
    }, [props.PlayerItem.videoId]);

    // playNowVideoIdが更新されたらplayNowDetailを更新
    useEffect(() => {
        let result: PlayerItem | undefined;

        // まず Playlist から探す
        result = props.Playlist?.find((item: PlayerItem) => {
            return item["videoId"] === playNowVideoId;
        });

        // Playlist に見つからない場合は searchResult から探す
        if (!result) {
            result = props.searchResult?.find((item: PlayerItem) => {
                return item["videoId"] === playNowVideoId;
            });
        }

        setPlayNowDetail(result);
    }, [playNowVideoId, props.Playlist, props.searchResult]);

    // サムネイルがクリックされた時
    const handleVideoClick = (event: React.MouseEvent<HTMLElement>) => {
        const videoId = event.currentTarget.getAttribute("data-videoId");
        setPlayNowVideoId(videoId ? videoId : undefined);
    };

    // actorId、entityIdがクリックされた時
    const handleActorClick = (event: React.MouseEvent<HTMLElement>) => {
        const actorId = event.currentTarget.getAttribute("data-actorId");
        props.entityIdString.current = actorId ? [actorId] : [""];
        props.setIsPlayerFullscreen(false);
    };

    // Playlist または searchResult が追加されたらHTML表示拡大モード
    useEffect(() => {
        if (
            (props.Playlist ? (props.Playlist.length == 0 ? false : true) : false) ||
            (props.searchResult
                ? props.searchResult.length == 0
                    ? false
                    : true
                : false)
        ) {
            props.setIsPlayerFullscreen(true);
        }
    }, [props.Playlist, props.searchResult]);


    // YouTube Playerの再生と停止を切り替える
    const togglePlayPlayer = (event: React.MouseEvent<HTMLElement>) => {
        console.log("a")
    };

    // 拡大モードの切り替えスイッチ
    const togglePlayerFullscreen = (event: React.MouseEvent<HTMLElement>) => {
        if (props.isPlayerFullscreen) {
            props.setIsPlayerFullscreen(false);
        } else {
            props.setIsPlayerFullscreen(true);
        }
    };

    return (
        <div
            style={{
                // videoIdがセットされていない時はPlayerを非表示
                display: playNowVideoId ? "block" : "none",
                // 拡大モードの時、Playerを画面上下いっぱいまで広げる。
                height: props.isPlayerFullscreen ? "100vh" : "100%",
                // 拡大モードの時、縦スクロールを許可しない。
                overflowY: props.isPlayerFullscreen ? "hidden" : "auto",
            }}
        >
            <div
                style={{
                    ...{
                        display: props.isMobile ? "" : "flex",
                        width: "100%",
                        height: "100%",
                        maxWidth: "100vw", // 確定
                        maxHeight: "100%", // 確定
                        // backgroundColor: "white",
                        backgroundColor: "yellow",
                        textAlign: "center",
                        padding: "0", // プレイヤーの上下にスペースを追加
                        margin: "0",
                    },
                    ...props.style,
                }}
            >
                {/* 左カラム */}
                <div
                    style={{
                        position: "relative",
                        display: props.isPlayerFullscreen ? "block" : "flex",
                        width: props.isPlayerFullscreen && !props.isMobile ? "70%" : "100%",
                        margin: props.isPlayerFullscreen ? "" : "0 auto",
                        justifyContent: "center", // 中央に配置
                    }}
                >
                    {/* YouTubeプレイヤー */}
                    <YouTubePlayer
                        videoId={playNowVideoId ? playNowVideoId : ""}
                        style={{
                            // padding: "0", // プレイヤーの上下にスペースを追加
                            margin: "0 auto",
                            // maxWidth: props.isPlayerFullscreen ? "100%" : "40%",
                            // maxHeight: "100%", // 高さに制限をつけることでパソコンのモニター等で無制限に大きくならないようにする。

                        }}
                        // 動画の比率は、横：縦 = １６：９で
                        width={props.isMobile && props.isPlayerFullscreen
                            ? "100%"
                            : props.isPlayerFullscreen
                                ? `${((props.screenHeight * 0.4) / 9) * 16}px`
                                : `${((props.screenHeight * 0.1) / 9) * 16}px`}
                        height={props.isMobile && props.isPlayerFullscreen
                            ? `${props.screenWidth / 16 * 9}px`
                            : props.isPlayerFullscreen
                                ? `${props.screenHeight * 0.4}px`
                                : `${props.screenHeight * 0.1}px`}
                    />






                    {/* PlayerView縮小表示の時のHTML */}
                    <div
                        onClick={togglePlayerFullscreen}
                        style={{
                            display: props.isPlayerFullscreen ? "none" : "block",
                            maxWidth: props.isPlayerFullscreen ? "100%" : "40%",
                            height: "auto",
                            margin: "auto 0 ",
                        }}
                    >
                        <div
                            style={{
                                /* 要素に幅を持たせるために必要 */
                                display: "block",
                                /* 29文字分確保 */
                                // width: "29ch",
                                width: "auto",

                                /* 改行を防ぐ */
                                whiteSpace: "nowrap",
                                /* 溢れた文字を隠す  */
                                overflow: "hidden",
                                /* 長すぎる場合に "..." を付ける  */
                                textOverflow: "ellipsis",
                            }}
                        >
                            {playNowDetail
                                ? playNowDetail.title
                                    ? playNowDetail.title
                                    : ""
                                : ""}
                        </div>
                        <div
                            style={{
                                /* 要素に幅を持たせるために必要 */
                                display: "block",
                                /* 29文字分確保 */
                                // width: "29ch",
                                // width: "60%",
                                width: "auto",
                                // maxWidth: "60vw",
                                /* 改行を防ぐ */
                                whiteSpace: "nowrap",
                                /* 溢れた文字を隠す  */
                                overflow: "hidden",
                                /* 長すぎる場合に "..." を付ける  */
                                textOverflow: "ellipsis",
                            }}
                        >
                            {playNowDetail
                                ? playNowDetail.channelTitle
                                    ? playNowDetail.channelTitle
                                    : ""
                                : ""}
                        </div>
                    </div>
                    <div
                        style={{
                            display: props.isPlayerFullscreen ? "none" : "block",
                            maxWidth: props.isPlayerFullscreen ? "100%" : "20%",
                            margin: "auto",
                        }}
                    >
                        <div
                            onClick={togglePlayPlayer}
                            style={{
                                display: "flex",
                                justifyContent: "center",  // 水平方向の中央配置
                                alignItems: "center",      // 垂直方向の中央配置
                                margin: "0 auto",
                                width: "fit-content",
                                height: "100%",            // 必要に応じて高さを指定
                            }}>
                            <PlayArrowIcon />
                            {/* <PauseIcon /> */}
                        </div>
                    </div>
                    {/* YouTube Playerの下の概要欄 */}
                    <div
                        style={{
                            display: props.isPlayerFullscreen ? "block" : "none",
                            overflowY: "auto",
                            maxHeight: "70vh",
                            paddingBottom: "25vh",
                            // width: props.isPlayerFullscreen ? "" : "60%",
                        }}
                    >
                        <p
                            style={{
                                /* 要素に幅を持たせるために必要 */
                                display: "block",
                                /* 29文字分確保 */
                                // width: "29ch",
                                // width: "60%",
                                /* 改行を防ぐ */
                                whiteSpace: "nowrap",
                                /* 溢れた文字を隠す  */
                                overflow: "hidden",
                                /* 長すぎる場合に "..." を付ける  */
                                textOverflow: "ellipsis",
                            }}
                        >
                            {playNowDetail
                                ? playNowDetail.title
                                    ? playNowDetail.title
                                    : ""
                                : ""}
                        </p>
                        <p>ぷらそにか</p>
                        {/* <p>{JSON.stringify(props.entityIdString)}</p> */}
                        <p
                            style={{
                                fontSize: "14px", // フォントサイズ
                                color: "#555", // 色
                                margin: "10px 0", // 上下のマージン
                                fontStyle: "italic", // イタリック体
                                textAlign: "center", // 中央揃え
                            }}
                        >
                            {props.isPlayerFullscreen &&
                                playNowDetail &&
                                playNowDetail.publishedAt &&
                                new Date(playNowDetail.publishedAt).toLocaleDateString(
                                    "ja-JP",
                                    {
                                        year: "numeric", // 年
                                        month: "long", // 月（長い形式）
                                        day: "numeric", // 日
                                        hour: "2-digit", // 時（2桁形式）
                                        minute: "2-digit", // 分（2桁形式）
                                        // second: "2-digit", // 秒（2桁形式）
                                        hour12: false, // 24時間形式
                                    }
                                )}
                        </p>

                        <div
                            style={{
                                display: "flex",
                                padding: "0 auto",
                                justifyContent: "center", // 中央に配置
                                alignItems: "center", // 縦方向にも中央に配置
                                flexWrap: "wrap", // ラップさせて複数行に
                                gap: "10px", // アイテム間のスペースを追加
                            }}
                        >
                            {props.isPlayerFullscreen &&
                                playNowDetail &&
                                playNowDetail.actorId &&
                                playNowDetail.actorId.length !== 0
                                ? playNowDetail.actorId.map((actorId, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            padding: "10px",
                                            border: "1px solid #ccc", // 境界線を追加
                                            borderRadius: "5px", // 角を丸める
                                            cursor: "pointer", // マウスカーソルをポインターに変更
                                            transition: "background-color 0.3s", // 背景色のトランジション
                                        }}
                                        onClick={handleActorClick}
                                        data-actorId={actorId}
                                        onMouseEnter={(e) =>
                                            (e.currentTarget.style.backgroundColor = "#f0f0f0")
                                        } // ホバー時の背景色
                                        onMouseLeave={(e) =>
                                            (e.currentTarget.style.backgroundColor = "transparent")
                                        } // ホバー外したとき
                                    >
                                        {actorId}
                                    </div>
                                ))
                                : null}
                        </div>

                        {props.isPlayerFullscreen &&
                            playNowDetail &&
                            playNowDetail.organization &&
                            playNowDetail.organization.length !== 0
                            ? playNowDetail.organization.map((organization, index) => (
                                <div key={index}>
                                    {/* ここに organization の詳細情報を表示する処理を記述 */}
                                    <p>{organization}</p>
                                </div>
                            ))
                            : null}
                        <div onClick={togglePlayerFullscreen}>
                            {props.isPlayerFullscreen && "ミニプレイヤー切り替えボタン(仮)"}
                        </div>
                    </div>
                </div>
                {/* 右カラム */}
                <div
                    style={{
                        // 拡大モードかつPCの横幅で右カラムを表示
                        display:
                            props.isPlayerFullscreen && !props.isMobile ? "block" : "none",
                        position: "relative",
                        width: "30%",
                    }}
                >
                    <div
                        style={{
                            overflowY: "auto",
                            maxHeight: "100vh",
                            paddingBottom: "25vh",
                        }}
                    >
                        {props.searchResult
                            ? props.searchResult.map((item: PlayerItem, index: number) => (
                                <Thumbnail
                                    key={index}
                                    videoId={item.videoId ? item.videoId : ""}
                                    title={item.title ? item.title : ""}
                                    onClick={handleVideoClick}
                                />
                            ))
                            : null}
                    </div>
                </div>
            </div>
        </div>
    );
}
