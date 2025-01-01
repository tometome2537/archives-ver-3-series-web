import type { InputValue } from "@/components/Navbar/SearchBar/SearchBar";
import rgbToHex from "@/libs/colorConverter";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { Box, Chip } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { YouTubePlayer } from "react-youtube";
import Thumbnail from "./Thumbnail";
import YouTubePlayerView from "./YouTubePlayerView";
import type { YouTubePlayerState } from "./YouTubePlayerView";
import "linkify-plugin-hashtag";
import { useBrowserInfoContext } from "@/contexts/BrowserInfoContext";
import { KeyboardArrowDown } from "@mui/icons-material";
import { Repeat } from "@mui/icons-material";
import YouTubeIcon from "@mui/icons-material/YouTube";
import IconButton from "@mui/material/IconButton";
import { blue } from "@mui/material/colors";
import Image from "next/image";
import Description from "./Description";
import Link from "./Link";
import type { MultiSearchBarSearchSuggestion } from "./Navbar/SearchBar/MultiSearchBar";
import type { YouTubeIframe } from "./YouTubePlayerView";

export type PlayerItem = {
    // 優先度 高
    videoId?: string;
    title?: string;
    channelTitle?: string;
    // 優先度 中
    short?: boolean;
    description?: string;
    viewCount?: number;
    channelId?: string;
    publishedAt?: Date;
    duration?: number;

    actorId?: Array<string>;
    organizationId?: Array<string>;
    // 動画のヨコの比率 (デフォルトは16)
    arWidth?: number;
    // 動画のタテの比率 (デフォルトは9)
    arHeight?: number;
};

export type PlayerPlaylist = {
    title?: string;
    videos: PlayerItem[];
};

type PlayerProps = {
    // マルチサーチバー
    inputValue: InputValue[];
    setInputValue: Dispatch<SetStateAction<InputValue[]>>;
    searchSuggestion: MultiSearchBarSearchSuggestion[];

    // フルスクリーンで表示するかどうか
    isPlayerFullscreen: boolean;
    setIsPlayerFullscreen: Dispatch<SetStateAction<boolean>>;

    playerItem: PlayerItem | undefined;
    setPlayerItem: Dispatch<SetStateAction<PlayerItem | undefined>>;
    playerPlaylist?: PlayerPlaylist; // プレイリスト
    setPlayerPlaylist?: Dispatch<SetStateAction<PlayerPlaylist | undefined>>;

    style?: React.CSSProperties; // 外部からスタイルを受け取る（オプション）
};

export default function PlayerView(props: PlayerProps) {
    // テーマ設定を取得
    const theme = useTheme();
    // ブラウザ情報を取得
    const { screenWidth, screenHeight, isMobile } = useBrowserInfoContext();

    // プレイヤーの状態(例、再生中、停止中、etc...)
    const [youTubePlayerState, setYouTubePlayerState] =
        useState<YouTubePlayerState>();
    // YouTubeプレイヤーの実行関数集(再生を実行したり、再生を停止させたり etc...)
    const [youTubePlayer, setYouTubePlayer] = useState<
        YouTubePlayer | undefined
    >(undefined);
    const [youTubeIframe, setYouTubeIframe] = useState<YouTubeIframe>({
        width: 320,
        height: 180,
    });

    // 動画ヨコの比率 (デフォルトは16、トピックチャンネルの場合は１)
    const arWidth: number =
        props.playerItem?.arWidth ||
        (youTubePlayerState?.getVideoData.author.endsWith(" - Topic") && 1) ||
        16;
    // 動画タテの比率 (デフォルトは9、トピックチャンネルの場合は１)
    const arHeight: number =
        props.playerItem?.arHeight ||
        (youTubePlayerState?.getVideoData.author.endsWith(" - Topic") && 1) ||
        9;

    // youtubePlayerの横幅(px)
    const playerWidth: number =
        isMobile && props.isPlayerFullscreen
            ? arWidth === arHeight // 正方形(比率が1:1)の場合
                ? screenWidth * 0.8 // 小さめに表示する。
                : screenWidth
            : props.isPlayerFullscreen
              ? ((screenHeight * 0.55) / arHeight) * arWidth
              : ((screenHeight * 0.1) / arHeight) * arWidth;
    // youtubePlayerの縦幅(px)
    const playerHeight: number =
        youTubeIframe.width < playerWidth
            ? (youTubeIframe.width / arWidth) * arHeight
            : (playerWidth / arWidth) * arHeight;

    // ループ再生の設定
    const [repeat, setRepeat] = useState<boolean>(false);

    // playNowVideoIdが更新されたらplayNowDetailを更新
    useEffect(() => {
        // プレイリストにないvideoIdが外部から設定された場合は、Playlistを破棄する。
        const r = props.playerPlaylist?.videos.find((video) => {
            return video.videoId === props.playerItem?.videoId;
        });
        if (!r && props.setPlayerPlaylist) {
            props.setPlayerPlaylist(undefined);
            setRepeat(false);
        }

        // 再生中のvideoIdが変更された時にPlaylistから動画詳細を取得する。
        // (動画再生時にvideoIdだけ指定すればいいようにするための処理)
        const result: PlayerItem | undefined =
            props.playerPlaylist?.videos?.find((item: PlayerItem) => {
                if (item.videoId === props.playerItem?.videoId) {
                    return item;
                }
            });
        if (result) {
            props.setPlayerItem(result);
            setRepeat(false);
        }
    }, [
        props.playerItem,
        props.setPlayerItem,
        props.playerPlaylist?.videos,
        props.setPlayerPlaylist,
    ]);

    // 楽曲の再生が終わったら...(次の曲を再生 or ループ再生)
    useEffect(() => {
        if (youTubePlayerState?.state === "ended") {
            // 再生が終わったら。
            const playListIndex = props.playerPlaylist?.videos.findIndex(
                (item) =>
                    item.videoId === youTubePlayerState?.getVideoData.video_id,
            );
            // ループする場合
            if (repeat) {
                // 再生を実行
                youTubePlayer.playVideo();

                // 次の曲を順に再生する場合。
            } else if (playListIndex !== undefined) {
                props.setPlayerItem(
                    props.playerPlaylist?.videos[playListIndex + 1],
                );
            }
        }
    }, [
        props.setPlayerItem,
        youTubePlayer,
        youTubePlayerState?.state,
        props.playerPlaylist,
        youTubePlayerState?.getVideoData.video_id,
        repeat,
    ]);

    return (
        <Box
            sx={{
                // videoIdがセットされていない時はPlayerを非表示
                display: props.playerItem?.videoId ? "block" : "none",
                // 拡大モードの時、Playerを画面上下いっぱいまで広げる。
                // height: props.isPlayerFullscreen ? "100vh" : "100%",
                // 拡大モードの時、縦スクロールを許可しない。(YouTubePlayerが固定される。)
                overflowY: props.isPlayerFullscreen ? "hidden" : "auto",
            }}
        >
            <Box
                sx={{
                    // ここから拡大表示の時にPlayerを固定する(スマホのブラウザ対策)
                    position: props.isPlayerFullscreen ? "fixed" : "relative",
                    top: "0",
                    // ここまで拡大表示の時にPlayerを固定する
                    // ↓ PCの時は右カラムを左カラムの下に。
                    display: isMobile ? "block" : "flex",
                    width: "100%",
                    height: "100%",
                    maxWidth: "100vw",
                    maxHeight: "100%",
                    // ↓ 背景色の指定と背景の透過
                    backgroundColor: props.isPlayerFullscreen
                        ? // : `${theme.palette.background.default}`,
                          `rgba(
                        ${rgbToHex(theme.palette.background.paper).r},
                        ${rgbToHex(theme.palette.background.paper).g},
                        ${rgbToHex(theme.palette.background.paper).b},
                        0.90
                        )`
                        : `rgba(
                        ${rgbToHex(theme.palette.background.paper).r},
                        ${rgbToHex(theme.palette.background.paper).g},
                        ${rgbToHex(theme.palette.background.paper).b},
                        0.75
                        )`,

                    // 背景をぼかす
                    backdropFilter: props.isPlayerFullscreen
                        ? "blur(15px)"
                        : "blur(20px)",
                    // 背景をぼかす{Safari(WebKit)対応}
                    WebkitBackdropFilter: props.isPlayerFullscreen
                        ? "blur(15px)"
                        : "blur(20px)",
                    overflow: "hidden", // クリッピングを防ぐ
                    padding: "0", // paddingの初期化
                    margin: "0", // margin の初期化
                    // ↓ 両サイドに余白を開ける To Do
                    // marginLeft: props.isMobile && !props.isPlayerFullscreen ? `${props.screenWidth * 0.01}px` : "0",
                    // marginRight: props.isMobile && !props.isPlayerFullscreen ? `${props.screenWidth * 0.01}px` : "0",
                    // 角を丸く
                    borderTopLeftRadius: props.isPlayerFullscreen ? "0" : "1em",

                    borderTopRightRadius: props.isPlayerFullscreen
                        ? "0"
                        : "1em",
                    textAlign: "center",
                    ...props.style,
                }}
            >
                {/* 左カラム(拡大表示falseの時はミニプレイヤー) */}
                <Box
                    sx={{
                        // position: "relative",
                        display: props.isPlayerFullscreen ? "block" : "flex",
                        width:
                            props.isPlayerFullscreen &&
                            !isMobile &&
                            props.playerPlaylist &&
                            props.playerPlaylist.videos.length !== 0
                                ? "70%"
                                : "100%",
                        margin: props.isPlayerFullscreen ? "" : "0 auto",
                        justifyContent: "center", // 中央に配置
                    }}
                >
                    {props.isPlayerFullscreen && (
                        <Box
                            sx={{
                                display: "flex",
                                alignContent: "left",
                                width: `${youTubeIframe.width}px`,
                                margin: "0 auto",
                            }}
                        >
                            <Box sx={{ flexGrow: 0.02 }} />
                            <IconButton
                                sx={{
                                    marginY: 1,
                                }}
                                onClick={() =>
                                    props.setIsPlayerFullscreen(false)
                                }
                            >
                                <KeyboardArrowDown
                                    sx={{
                                        fontSize: "2rem",
                                    }}
                                />
                            </IconButton>
                            <Box sx={{ flexGrow: 0.01 }} />
                            <IconButton
                                sx={{
                                    marginY: 1,
                                }}
                                component="a"
                                href={`https://m.youtube.com/watch?v=${props.playerItem?.videoId}`}
                                target="_blank"
                            >
                                <YouTubeIcon
                                    sx={{
                                        fontSize: "1.5rem",
                                        color: "rgb(236,44,46)",
                                    }}
                                />
                            </IconButton>
                            <Box sx={{ flexGrow: 0.015 }} />
                            <IconButton
                                sx={{
                                    marginY: 1,
                                }}
                                component="a"
                                href={`https://music.youtube.com/watch?v=${props.playerItem?.videoId}`}
                                target="_blank"
                            >
                                <Image
                                    src="/ytm.png"
                                    alt="YouTube Music ロゴ"
                                    width={20}
                                    height={20}
                                    style={{
                                        fontSize: "1.5rem",
                                    }}
                                />
                            </IconButton>
                            <Box sx={{ flexGrow: 1 }} />
                            <IconButton
                                onClick={() => {
                                    setRepeat(!repeat);
                                }}
                            >
                                <Repeat
                                    sx={{
                                        color: repeat
                                            ? theme.palette.primary.main
                                            : "",
                                        fontSize: "1.5rem",
                                    }}
                                />
                            </IconButton>
                            <Box sx={{ flexGrow: 0.02 }} />
                        </Box>
                    )}
                    {/* YouTubeプレイヤー */}
                    <YouTubePlayerView
                        videoId={
                            props.playerItem?.videoId
                                ? props.playerItem?.videoId
                                : ""
                        }
                        style={{
                            // padding: "0", // プレイヤーの上下にスペースを追加
                            margin: "0 auto",
                            maxWidth: "100%",
                            maxHeight: "100%",
                            // maxHeight: "100%", // 高さに制限をつけることでパソコンのモニター等で無制限に大きくならないようにする。
                        }}
                        width={`${playerWidth}px`}
                        height={`${playerHeight}px`}
                        playerRadius={
                            !(
                                isMobile &&
                                props.isPlayerFullscreen &&
                                arHeight !== arWidth
                            )
                        }
                        setPlayer={setYouTubePlayer}
                        setPlayerState={setYouTubePlayerState}
                        setYouTubeIframe={setYouTubeIframe}
                    />

                    {/* PlayerView縮小表示の時のHTML */}
                    <Box
                        onClick={() => {
                            if (props.isPlayerFullscreen) {
                                props.setIsPlayerFullscreen(false);
                            } else {
                                props.setIsPlayerFullscreen(true);
                            }
                        }}
                        onKeyPress={(e) => {
                            // onClickを実行する。
                            if (e.key === "Enter" || e.key === " ") {
                                // Enterキーまたはスペースキーの場合にonClickをトリガー
                                e.preventDefault(); // スペースキーでスクロールが発生しないようにする
                                e.currentTarget.click(); // onClickを参照
                            }
                        }}
                        sx={{
                            cursor: "pointer", // クリック可能かどうかでカーソルを変更
                            display: props.isPlayerFullscreen
                                ? "none"
                                : "block",
                            maxWidth: props.isPlayerFullscreen ? "100%" : "40%",
                            height: "auto",
                            margin: "auto 0 ",
                        }}
                    >
                        <Box
                            sx={{
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
                            {props.playerItem?.title
                                ? props.playerItem?.title
                                : youTubePlayerState?.getVideoData.title}
                        </Box>
                        <Box
                            sx={{
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
                            {props.playerItem?.channelTitle
                                ? props.playerItem?.channelTitle.replace(
                                      " - Topic",
                                      "",
                                  )
                                : youTubePlayerState?.getVideoData.author.replace(
                                      " - Topic",
                                      "",
                                  )}
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            display: props.isPlayerFullscreen
                                ? "none"
                                : "block",
                            maxWidth: props.isPlayerFullscreen ? "100%" : "20%",
                            margin: "auto",
                        }}
                    >
                        {youTubePlayerState?.state === "playing" ? (
                            <PauseIcon
                                sx={{
                                    height: "100%",
                                    margin: "auto",
                                }}
                                onClick={(e: React.MouseEvent) => {
                                    if (youTubePlayer) {
                                        // ↓ 親要素のonClickを発火させたくない場合に追記
                                        e.stopPropagation();
                                        youTubePlayer.pauseVideo();
                                    }
                                }}
                            />
                        ) : (
                            <PlayArrowIcon
                                sx={{
                                    height: "100%",
                                    margin: "auto",
                                }}
                                onClick={(e: React.MouseEvent) => {
                                    // ↓ 親要素のonClickを発火させたくない場合に追記
                                    e.stopPropagation();
                                    if (youTubePlayer) {
                                        youTubePlayer.playVideo();
                                    }
                                }}
                            />
                        )}
                    </Box>
                    {/* PlayerView拡大表示の時のHTML */}
                    <Box
                        sx={{
                            width: `${youTubeIframe.width}px`,
                            margin: "0 auto",
                            display: props.isPlayerFullscreen
                                ? "block"
                                : "none",
                            overflowY: "auto",
                            maxHeight: "50vh",
                            paddingBottom: "40vh",
                        }}
                    >
                        {/* 動画タイトル */}
                        <h3
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
                            {props.playerItem?.title
                                ? props.playerItem?.title
                                : youTubePlayerState?.getVideoData.title}
                        </h3>
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
                            {props.playerItem?.channelTitle
                                ? props.playerItem?.channelTitle.replace(
                                      " - Topic",
                                      "",
                                  )
                                : youTubePlayerState?.getVideoData.author.replace(
                                      " - Topic",
                                      "",
                                  )}
                        </p>
                        {/* 出演者・組織名一覧 */}
                        <Box
                            style={{
                                display: "flex",
                                padding: "8 auto",
                                justifyContent: "center", // 中央に配置
                                alignItems: "center", // 縦方向にも中央に配置
                                flexWrap: "wrap", // ラップさせて複数行に
                                gap: "10px", // アイテム間のスペースを追加
                            }}
                        >
                            {props.isPlayerFullscreen &&
                            props.playerItem &&
                            (props.playerItem.actorId ||
                                props.playerItem.organizationId) &&
                            (props.playerItem.actorId?.length !== 0 ||
                                props.playerItem.organizationId?.length !== 0)
                                ? // 出演者一覧と組織名一覧を1つにまとめる処理
                                  [
                                      ...(props.playerItem.actorId || []),
                                      ...(props.playerItem.organizationId ||
                                          []),
                                  ].map((id, index) => {
                                      //   const isActor =
                                      //       playNowDetail.actorId &&
                                      //       playNowDetail.actorId.includes(id);
                                      const r = props.searchSuggestion.find(
                                          (item) => item.value === id,
                                      );
                                      const label = r?.label ?? "?";
                                      const imgSrc = r?.imgSrc;
                                      return (
                                          <Chip
                                              key={id}
                                              variant="outlined"
                                              sx={{
                                                  "& .MuiChip-label": {
                                                      maxWidth: "100%",
                                                      whiteSpace: "nowrap", // 改行させない
                                                      textOverflow: "ellipsis", // 長いテキストを省略して表示
                                                  },
                                              }}
                                              avatar={
                                                  imgSrc ? (
                                                      <Avatar
                                                          alt={label}
                                                          src={imgSrc}
                                                      />
                                                  ) : (
                                                      <Avatar>
                                                          {label[0]}
                                                      </Avatar>
                                                  )
                                              }
                                              label={label}
                                              color="success"
                                              onClick={() => {
                                                  const actorSearchSuggestion =
                                                      props.searchSuggestion.find(
                                                          (item) =>
                                                              item.value ===
                                                                  id ||
                                                              item.label === id,
                                                      );

                                                  const result: InputValue[] =
                                                      [];
                                                  // = props.inputValue.filter(
                                                  //     (item) => item.categoryId !== "actor",
                                                  // );

                                                  if (actorSearchSuggestion) {
                                                      const value: InputValue =
                                                          Object.assign(
                                                              {
                                                                  createdAt:
                                                                      new Date(),
                                                                  sort:
                                                                      actorSearchSuggestion.sort ||
                                                                      99,
                                                              },
                                                              actorSearchSuggestion,
                                                          );

                                                      result.push(value);
                                                  }

                                                  props.setInputValue(result);
                                                  props.setIsPlayerFullscreen(
                                                      false,
                                                  );
                                              }}
                                              onKeyPress={(e) => {
                                                  // onClickを実行する。
                                                  if (
                                                      e.key === "Enter" ||
                                                      e.key === " "
                                                  ) {
                                                      // Enterキーまたはスペースキーの場合にonClickをトリガー
                                                      e.preventDefault(); // スペースキーでスクロールが発生しないようにする
                                                      e.currentTarget.click(); // onClickを参照
                                                  }
                                              }}
                                          />
                                      );
                                  })
                                : null}
                        </Box>

                        {/* 概要欄 */}
                        <Box
                            style={{
                                margin: "0.5em",
                            }}
                        >
                            {props.isPlayerFullscreen &&
                                props.playerItem?.description && (
                                    <Description
                                        text={props.playerItem.description}
                                        date={
                                            props.playerItem?.publishedAt
                                                ? props.playerItem?.publishedAt
                                                : undefined
                                        }
                                        maxLine={2}
                                    />
                                )}
                        </Box>
                        {/* プレイリストの表示 */}
                        <h3>{isMobile && props.playerPlaylist?.title}</h3>
                        {isMobile && props.playerPlaylist
                            ? props.playerPlaylist.videos.map(
                                  (item: PlayerItem) => (
                                      <>
                                          <Box
                                              key={item.videoId}
                                              sx={{
                                                  maxWidth: "80vw",
                                                  margin: "0 auto",
                                              }}
                                          >
                                              <Thumbnail
                                                  videoId={
                                                      item.videoId
                                                          ? item.videoId
                                                          : ""
                                                  }
                                                  thumbnailType="list"
                                                  title={item.title}
                                                  viewCount={item.viewCount}
                                                  channelTitle={
                                                      item.channelTitle
                                                  }
                                                  duration={item.duration}
                                                  publishedAt={item.publishedAt}
                                                  onClick={(e) => {
                                                      // ↓ 親要素のonClickを発火させたくない場合に追記
                                                      e.stopPropagation();
                                                      props.setPlayerItem(item);
                                                  }}
                                              />
                                          </Box>
                                      </>
                                  ),
                              )
                            : null}
                    </Box>
                </Box>
                {/* 右カラム */}
                <Box
                    style={{
                        // 拡大モードかつPCの横幅で右カラムを表示
                        display:
                            props.isPlayerFullscreen &&
                            !isMobile && // ← ここをコメントアウトでスマホでも閲覧可能になる。
                            props.playerPlaylist &&
                            props.playerPlaylist.videos.length !== 0
                                ? "block"
                                : "none",
                        // position: "relative",
                        width:
                            props.isPlayerFullscreen && !isMobile
                                ? "30%"
                                : "100%",
                    }}
                >
                    <Box
                        style={{
                            // 上幅を定義してスクロールバーを表示
                            overflowY: "auto",
                            maxHeight: "100vh",
                            paddingBottom: "25vh",
                        }}
                    >
                        <h3>{props.playerPlaylist?.title}</h3>
                        {props.playerPlaylist
                            ? props.playerPlaylist.videos.map(
                                  (item: PlayerItem) => (
                                      <>
                                          <Box
                                              key={item.videoId}
                                              sx={{
                                                  maxWidth: "25vw",
                                                  margin: "0 auto",
                                              }}
                                          >
                                              <Thumbnail
                                                  videoId={
                                                      item.videoId
                                                          ? item.videoId
                                                          : ""
                                                  }
                                                  title={item.title}
                                                  viewCount={item.viewCount}
                                                  channelTitle={
                                                      item.channelTitle
                                                  }
                                                  publishedAt={item.publishedAt}
                                                  onClick={(e) => {
                                                      // ↓ 親要素のonClickを発火させたくない場合に追記
                                                      e.stopPropagation();
                                                      props.setPlayerItem(item);
                                                  }}
                                              />
                                          </Box>
                                      </>
                                  ),
                              )
                            : null}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
