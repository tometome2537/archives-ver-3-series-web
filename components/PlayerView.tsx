import { useEffect, useState, useRef } from "react";

import type { Dispatch, SetStateAction, MutableRefObject } from "react";

import Thumbnail from "./Thumbnail";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import YouTubePlayer from "./YouTubePlayer";
import { useTheme } from "@mui/material/styles";
import rgbToHex from "@/libs/colorConverter";

export type PlayerItem = {
    videoId?: string; // 動画IDをプロパティとして受け取る
    title?: string;
    viewCount?: number;
    channelId?: string;
    channelTitle?: string;
    publishedAt?: Date;
    actorId?: Array<string>;
    organization?: Array<string>;
};

type PlayerProps = {
    screenWidth: number;
    screenHeight: number;
    setPlayerViewHeight: Dispatch<SetStateAction<number>>;
    isMobile: boolean;
    // フルスクリーンで表示するかどうか
    isPlayerFullscreen: boolean;
    setIsPlayerFullscreen: Dispatch<SetStateAction<boolean>>;
    PlayerItem: PlayerItem;
    Playlist?: Array<PlayerItem>; // プレイリスト
    searchResult?: Array<PlayerItem>; // 検索結果のリスト
    style?: React.CSSProperties; // 外部からスタイルを受け取る（オプション）
    setEntityIdString: Dispatch<SetStateAction<string[]>>;
};

export default function PlayerView(props: PlayerProps) {
    // テーマ設定を取得
    const theme = useTheme();

    // PlayerViewのHTMLが保存される
    const playerViewRef = useRef<HTMLDivElement | null>(null);

    // 現在再生されているvideoId
    const [playNowVideoId, setPlayNowVideoId] = useState<string>();
    // 現在再生されている動画の詳細情報
    const [playNowDetail, setPlayNowDetail] = useState<
        PlayerItem | undefined
    >();

    // propsのvideoIdが変更されたらplayNowVideoIdを更新。
    useEffect(() => {
        setPlayNowVideoId(props.PlayerItem.videoId);
    }, [props]);

    // playNowVideoIdが更新されたらplayNowDetailを更新
    useEffect(() => {
        let result: PlayerItem | undefined;

        // まず Playlist から探す
        result = props.Playlist?.find((item: PlayerItem) => {
            if (item.videoId === playNowVideoId) {
                return item;
            }
        });

        // Playlist に見つからない場合は searchResult から探す
        if (!result) {
            result = props.searchResult?.find((item: PlayerItem) => {
                if (item.videoId === playNowVideoId) {
                    return item;
                }
            });
        }

        setPlayNowDetail(result);
    }, [props, playNowVideoId, props.Playlist, props.searchResult]);

    // playerViewRefの高さを監視、調べる。
    useEffect(() => {
        if (typeof window !== "undefined") {
            // タブバーの高さを再計算する関数
            const updateNavHeight = () => {
                if (playerViewRef.current) {
                    const height = playerViewRef.current.clientHeight;
                    props.setPlayerViewHeight(height);
                }
            };

            // 初回の高さ計算
            updateNavHeight();

            // ウィンドウリサイズ時に高さを再計算
            window.addEventListener("resize", updateNavHeight);

            // クリーンアップ: コンポーネントがアンマウントされたときにイベントリスナーを削除
            return () => {
                window.removeEventListener("resize", updateNavHeight);
            };
        }
    }, [props]);

    // サムネイルがクリックされた時
    const handleVideoClick = (event: React.MouseEvent<HTMLElement>) => {
        const videoId = event.currentTarget.getAttribute("data-videoId");
        setPlayNowVideoId(videoId ? videoId : undefined);
    };

    // actorId、entityIdがクリックされた時
    const handleActor = (
        event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
    ) => {
        const actorId = event.currentTarget.getAttribute("data-actorId");
        props.setEntityIdString(actorId ? [actorId] : [""]);
        props.setIsPlayerFullscreen(false);
    };

    // マウスイベント用のハンドラ
    const ClickHandleActor = (event: React.MouseEvent<HTMLElement>) => {
        handleActor(event);
    };

    // キーボードイベント用のハンドラ
    const KeyDownHandleActor: React.KeyboardEventHandler<HTMLElement> = (
        event,
    ) => {
        // EnterキーまたはSpaceキーでアクターを選択
        if (event.key === "Enter" || event.key === " ") {
            handleActor(event);
        }
    };

    // Playlist または searchResult が追加されたらHTML表示拡大モード
    useEffect(() => {
        // PlaylistまたはsearchResultが空の場合にフルスクリーンを設定
        if (
            (props.Playlist && props.Playlist.length === 0) ||
            (props.searchResult && props.searchResult.length === 0)
        ) {
            props.setIsPlayerFullscreen(true);
        }
    }, [props.Playlist, props.searchResult, props.setIsPlayerFullscreen]);

    // YouTube Playerの再生と停止を切り替える
    const togglePlayPlayer = (event: React.MouseEvent<HTMLElement>) => {
        console.log("a");
    };

    // 拡大モードの切り替えスイッチ
    const togglePlayerFullscreen = () => {
        if (props.isPlayerFullscreen) {
            props.setIsPlayerFullscreen(false);
        } else {
            props.setIsPlayerFullscreen(true);
        }
    };
    // マウスイベント用のハンドラ
    const mouseClickTogglePlayerFullscreen = (
        event: React.MouseEvent<HTMLElement>,
    ) => {
        togglePlayerFullscreen();
    };

    // キーボードイベント用のハンドラ
    const keyDownTogglePlayerFullscreen: React.KeyboardEventHandler<
        HTMLDivElement
    > = (event) => {
        // 例えば、Enterキーで全画面切り替えをトリガーする
        if (event.key === "Enter") {
            togglePlayerFullscreen();
        }
    };

    return (
        <div
            ref={playerViewRef}
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
                        // ここから拡大表示の時にPlayerを固定する(スマホのブラウザ対策)
                        position: props.isPlayerFullscreen
                            ? "fixed"
                            : "relative",
                        top: "0",
                        // ここまで拡大表示の時にPlayerを固定する
                        // ↓ PCの時は横に並べる
                        display: props.isMobile ? "" : "flex",
                        width: "100%",
                        height: "100%",
                        maxWidth: "100vw",
                        maxHeight: "100%",
                        // ↓ 背景色の指定と背景の透過
                        backgroundColor: !props.isPlayerFullscreen
                            ? `rgba(
                        ${rgbToHex(theme.palette.background.paper).r},
                        ${rgbToHex(theme.palette.background.paper).g},
                        ${rgbToHex(theme.palette.background.paper).b},
                        0.75
                        )`
                            : // : `${theme.palette.background.default}`,
                              `rgba(
                        ${rgbToHex(theme.palette.background.paper).r},
                        ${rgbToHex(theme.palette.background.paper).g},
                        ${rgbToHex(theme.palette.background.paper).b},
                        0.90
                        )`,
                        // 背景をぼかす
                        backdropFilter: props.isPlayerFullscreen
                            ? "blur(20px)"
                            : "blur(15px)",
                        // 背景をぼかす{Safari(WebKit)対応}
                        WebkitBackdropFilter: props.isPlayerFullscreen
                            ? "blur(20px)"
                            : "blur(15px)",
                        overflow: "hidden", // クリッピングを防ぐ
                        padding: "0", // paddingの初期化
                        margin: "0", // margin の初期化
                        // ↓ 両サイドに余白を開ける To Do
                        // marginLeft: props.isMobile && !props.isPlayerFullscreen ? `${props.screenWidth * 0.01}px` : "0",
                        // marginRight: props.isMobile && !props.isPlayerFullscreen ? `${props.screenWidth * 0.01}px` : "0",
                        // 角を丸く
                        borderRadius:
                            props.isMobile && !props.isPlayerFullscreen
                                ? "1em"
                                : "",
                        textAlign: "center",
                    },
                    ...props.style,
                }}
            >
                {/* 左カラム(拡大表示falseの時はミニプレイヤー) */}
                <div
                    style={{
                        position: "relative",
                        display: props.isPlayerFullscreen ? "block" : "flex",
                        width:
                            props.isPlayerFullscreen && !props.isMobile
                                ? "70%"
                                : "100%",
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
                        width={
                            props.isMobile && props.isPlayerFullscreen
                                ? "100%"
                                : props.isPlayerFullscreen
                                  ? `${((props.screenHeight * 0.48) / 9) * 16}px`
                                  : `${((props.screenHeight * 0.1) / 9) * 16}px`
                        }
                        height={
                            props.isMobile && props.isPlayerFullscreen
                                ? `${(props.screenWidth / 16) * 9}px`
                                : props.isPlayerFullscreen
                                  ? `${props.screenHeight * 0.48}px`
                                  : `${props.screenHeight * 0.1}px`
                        }
                    />

                    {/* PlayerView縮小表示の時のHTML */}
                    <div
                        onClick={mouseClickTogglePlayerFullscreen}
                        onKeyDown={keyDownTogglePlayerFullscreen}
                        style={{
                            display: props.isPlayerFullscreen
                                ? "none"
                                : "block",
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
                                    : "タイトル不明"
                                : "タイトル不明"}
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
                        onClick={mouseClickTogglePlayerFullscreen}
                        onKeyDown={keyDownTogglePlayerFullscreen}
                        style={{
                            display: props.isPlayerFullscreen
                                ? "none"
                                : "block",
                            maxWidth: props.isPlayerFullscreen ? "100%" : "20%",
                            margin: "auto",
                        }}
                    >
                        <PlayArrowIcon
                            style={{
                                height: "100%",
                                margin: "auto",
                            }}
                        />
                        {/* <PauseIcon /> */}
                    </div>
                    {/* YouTube Playerの下の概要欄 */}
                    <div
                        style={{
                            display: props.isPlayerFullscreen
                                ? "block"
                                : "none",
                            overflowY: "auto",
                            maxHeight: "50vh",
                            paddingBottom: "25vh",
                            // width: props.isPlayerFullscreen ? "" : "60%",
                        }}
                    >
                        {/* 動画タイトル */}
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
                        {/* チャンネル名 */}
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
                                ? playNowDetail.channelTitle
                                    ? playNowDetail.channelTitle
                                    : ""
                                : ""}
                        </p>
                        {/* 動画投稿日 */}
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
                                new Date(
                                    playNowDetail.publishedAt,
                                ).toLocaleDateString("ja-JP", {
                                    year: "numeric", // 年
                                    month: "long", // 月（長い形式）
                                    day: "numeric", // 日
                                    hour: "2-digit", // 時（2桁形式）
                                    minute: "2-digit", // 分（2桁形式）
                                    // second: "2-digit", // 秒（2桁形式）
                                    hour12: false, // 24時間形式
                                })}
                        </p>
                        {/* 出演者一覧 */}
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
                                ? playNowDetail.actorId.map(
                                      (actorId, index) => (
                                          <div
                                              key={actorId}
                                              style={{
                                                  padding: "10px",
                                                  border: "1px solid #ccc", // 境界線を追加
                                                  borderRadius: "5px", // 角を丸める
                                                  cursor: "pointer", // マウスカーソルをポインターに変更
                                                  transition:
                                                      "background-color 0.3s", // 背景色のトランジション
                                              }}
                                              onClick={ClickHandleActor}
                                              onKeyPress={KeyDownHandleActor}
                                              data-actorId={actorId}
                                              /*
											onMouseEnter={(e) =>
												(e.currentTarget.style.backgroundColor = "#f0f0f0")
											} // ホバー時の背景色
											onMouseLeave={(e) =>
												(e.currentTarget.style.backgroundColor = "transparent")
											} // ホバー外したとき
											 */
                                          >
                                              {actorId}
                                          </div>
                                      ),
                                  )
                                : null}
                        </div>
                        {/* 組織名一覧 */}
                        {props.isPlayerFullscreen &&
                        playNowDetail &&
                        playNowDetail.organization &&
                        playNowDetail.organization.length !== 0
                            ? playNowDetail.organization.map(
                                  (organization, index) => (
                                      <div key={organization}>
                                          {/* ここに organization の詳細情報を表示する処理を記述 */}
                                          <p>{organization}</p>
                                      </div>
                                  ),
                              )
                            : null}
                        {/* ミニプレイヤー切り替えボタン */}
                        <div
                            onClick={togglePlayerFullscreen}
                            onKeyPress={togglePlayerFullscreen}
                        >
                            {props.isPlayerFullscreen &&
                                "ミニプレイヤー切り替えボタン(仮)"}
                        </div>
                    </div>
                </div>
                {/* 右カラム */}
                <div
                    style={{
                        // 拡大モードかつPCの横幅で右カラムを表示
                        display:
                            props.isPlayerFullscreen && !props.isMobile
                                ? "block"
                                : "none",
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
                            ? props.searchResult.map(
                                  (item: PlayerItem, index: number) => (
                                      <Thumbnail
                                          key={item.videoId}
                                          videoId={
                                              item.videoId ? item.videoId : ""
                                          }
                                          title={item.title}
                                          viewCount={item.viewCount}
                                          channelTitle={item.channelTitle}
                                          publishedAt={item.publishedAt}
                                          onClick={handleVideoClick}
                                      />
                                  ),
                              )
                            : null}
                    </div>
                </div>
            </div>
        </div>
    );
}
