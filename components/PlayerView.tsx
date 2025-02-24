import type { InputValue } from "@/components/Navbar/SearchBar/SearchBar";
import type { MediaItem } from "@/contexts/AppleMusicContext";
import { useAppleMusic } from "@/contexts/AppleMusicContext";
import { useBrowserInfoContext } from "@/contexts/BrowserInfoContext";
import rgbToHex from "@/libs/colorConverter";
import { KeyboardArrowDown } from "@mui/icons-material";
import { Repeat } from "@mui/icons-material";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { Box, Chip } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { YouTubePlayer } from "react-youtube";
import Description from "./Description";
import type { MultiSearchBarSearchSuggestion } from "./Navbar/SearchBar/MultiSearchBar";
import Thumbnail from "./Thumbnail";
import YouTubePlayerView from "./YouTubePlayerView";
import type { YouTubePlayerState } from "./YouTubePlayerView";

export enum PlayerType {
    YouTube = "YouTube",
    AppleMusic = "AppleMusic",
}

export type PlayerItem = {
    type?: PlayerType;

    mediaId?: string; // YouTubeの場合はvideoId。AppleMusicの場合はID
    title?: string;
    author?: string;

    short?: boolean;
    description?: string;
    viewCount?: number;
    channelId?: string;
    publishedAt?: Date;
    duration?: number;

    actorId?: Array<string>;
    organizationId?: Array<string>;
    arWidth?: number; // 画面比率の幅
    arHeight?: number; // 画面比率の高さ
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

    const musicKit = useAppleMusic();

    // プレイヤーの状態(例、再生中、停止中、etc...)
    const [youTubePlayerState, setYouTubePlayerState] =
        useState<YouTubePlayerState>();
    // YouTubeプレイヤーの実行関数集(再生を実行したり、再生を停止させたり etc...)
    const [youTubePlayer, setYouTubePlayer] = useState<
        YouTubePlayer | undefined
    >(undefined);

    // ループ再生の設定
    const [repeat, setRepeat] = useState<boolean>(false);

    const aspectRatio = youTubePlayerState?.getVideoData.author.endsWith(
        " - Topic",
    )
        ? 1
        : props.playerItem?.arWidth && props.playerItem.arHeight
          ? props.playerItem.arWidth / props.playerItem.arHeight
          : 16 / 9;

    const width = props.isPlayerFullscreen
        ? isMobile
            ? youTubePlayerState?.getVideoData.author.endsWith(" - Topic")
                ? screenWidth * 0.8
                : screenWidth
            : screenHeight * 0.55 * aspectRatio
        : screenHeight * 0.1 * aspectRatio;

    // Apple Musicを監視
    // インスタンスが更新されたら。
    if (musicKit.instance) {
        musicKit.instance.addEventListener(
            "nowPlayingItemWillChange",
            (event: { item: MediaItem | null }) => {
                const item = event.item;
                if (!item || !item.attributes) return; // 安全チェック
                props.setPlayerItem({
                    type: PlayerType.AppleMusic,
                    mediaId: item.id,
                    title: item.attributes.name,
                    author: item.attributes.artistName ?? "Unknown Artist",
                    arWidth: item.attributes.artwork?.width ?? 300,
                    arHeight: item.attributes.artwork?.height ?? 300,
                });

                if (props.setPlayerPlaylist) {
                    props.setPlayerPlaylist(undefined);
                }
            },
        );
    }

    // playNowVideoIdが更新されたらplayNowDetailを更新
    useEffect(() => {
        // Apple Music停止
        if (
            props.playerItem?.type !== PlayerType.AppleMusic &&
            musicKit.instance?.isPlaying
        ) {
            musicKit.instance?.stop();
        }

        // プレイリストにないvideoIdが外部から設定された場合は、Playlistを破棄する。
        const r = props.playerPlaylist?.videos.find((video) => {
            return video.mediaId === props.playerItem?.mediaId;
        });
        if (!r && props.setPlayerPlaylist) {
            props.setPlayerPlaylist(undefined);
            setRepeat(false);
        }

        // 再生中のvideoIdが変更された時にPlaylistから動画詳細を取得する。
        // (動画再生時にvideoIdだけ指定すればいいようにするための処理)
        const result: PlayerItem | undefined =
            props.playerPlaylist?.videos?.find((item: PlayerItem) => {
                if (item.mediaId === props.playerItem?.mediaId) {
                    return item;
                }
            });
        if (result) {
            props.setPlayerItem(result);
            setRepeat(false);
        }
    }, [
        musicKit,
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
                    item.mediaId === youTubePlayerState?.getVideoData.video_id,
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

    if (props.playerItem?.type) {
        return (
            <>
                <Box
                    sx={{
                        // 拡大モードの時、Playerを画面上下いっぱいまで広げる。
                        // height: props.isPlayerFullscreen ? "100vh" : "100%",
                        // 拡大モードの時、縦スクロールを許可しない。(YouTubePlayerが固定される。)
                        overflowY: props.isPlayerFullscreen ? "hidden" : "auto",
                    }}
                >
                    <Box
                        sx={{
                            // ここから拡大表示の時にPlayerを固定する(スマホのブラウザ対策)
                            position: props.isPlayerFullscreen
                                ? "fixed"
                                : "relative",
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
                            borderTopLeftRadius: props.isPlayerFullscreen
                                ? "0"
                                : "1em",

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
                                display: props.isPlayerFullscreen
                                    ? "block"
                                    : "flex",
                                width:
                                    props.isPlayerFullscreen &&
                                    !isMobile &&
                                    props.playerPlaylist &&
                                    props.playerPlaylist.videos.length !== 0
                                        ? "70%"
                                        : "100%",
                                margin: props.isPlayerFullscreen
                                    ? ""
                                    : "0 auto",
                                justifyContent: "center", // 中央に配置
                            }}
                        >
                            {props.isPlayerFullscreen && (
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignContent: "left",
                                        width: width,
                                        maxWidth: "100%",
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
                                    {props.playerItem?.type ===
                                    PlayerType.YouTube ? (
                                        <IconButton
                                            sx={{
                                                marginY: 1,
                                            }}
                                            component="a"
                                            href={`https://m.youtube.com/watch?v=${props.playerItem?.mediaId}`}
                                            target="_blank"
                                        >
                                            <YouTubeIcon
                                                sx={{
                                                    fontSize: "1.5rem",
                                                    color: "rgb(236,44,46)",
                                                }}
                                            />
                                        </IconButton>
                                    ) : null}
                                    <Box sx={{ flexGrow: 0.015 }} />
                                    {props.playerItem?.type ===
                                    PlayerType.YouTube ? (
                                        <IconButton
                                            sx={{
                                                marginY: 1,
                                            }}
                                            component="a"
                                            href={`https://music.youtube.com/watch?v=${props.playerItem?.mediaId}`}
                                            target="_blank"
                                        >
                                            <Image
                                                src="/ytm.png"
                                                alt="YouTube Music リンク"
                                                width={20}
                                                height={20}
                                                style={{
                                                    fontSize: "1.5rem",
                                                }}
                                            />
                                        </IconButton>
                                    ) : (
                                        <IconButton
                                            sx={{
                                                marginY: 1,
                                            }}
                                            component="a"
                                            // To DO
                                            href={`https://music.apple.com/${"jp"}/${"album"}/${props.playerItem.title?.replace(" |　", "-")}/${props.playerItem?.mediaId}?i=${props.playerItem?.mediaId}`}
                                            target="_blank"
                                        >
                                            <Image
                                                src="/apple_music_logo.png"
                                                alt="Apple Music リンク"
                                                width={20}
                                                height={20}
                                                style={{
                                                    fontSize: "1.5rem",
                                                }}
                                            />
                                        </IconButton>
                                    )}
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
                            {props.playerItem?.type === PlayerType.YouTube ? (
                                <YouTubePlayerView
                                    videoId={
                                        props.playerItem?.mediaId
                                            ? props.playerItem?.mediaId
                                            : ""
                                    }
                                    aspectRatio={aspectRatio}
                                    width={width}
                                    style={{
                                        // padding: "0", // プレイヤーの上下にスペースを追加
                                        margin: "0 auto",
                                        maxWidth: "100%",
                                        // パソコンのモニター等で無制限に大きくならないようにする。
                                        maxHeight: "100%",
                                    }}
                                    playerRadius={
                                        !(
                                            isMobile &&
                                            props.isPlayerFullscreen &&
                                            aspectRatio !== 1
                                        )
                                    }
                                    setPlayer={setYouTubePlayer}
                                    setPlayerState={setYouTubePlayerState}
                                />
                            ) : (
                                <Box
                                    style={{
                                        height: width / aspectRatio,
                                        // padding: "0", // プレイヤーの上下にスペースを追加
                                        margin: "0 auto",
                                        maxWidth: "100%",
                                        // パソコンのモニター等で無制限に大きくならないようにする。
                                        maxHeight: "100%",
                                    }}
                                >
                                    <Image
                                        width={width}
                                        height={width / aspectRatio}
                                        src={
                                            musicKit.instance?.nowPlayingItem?.attributes.artwork?.url
                                                .replace("{w}", "400")
                                                .replace("{h}", "400") ?? ""
                                        }
                                        alt={
                                            musicKit.instance?.nowPlayingItem
                                                ?.attributes.name ?? ""
                                        }
                                        style={{
                                            // width: "100%",
                                            // height: "auto",
                                            // objectFit: "contain",
                                            borderRadius: "0.6em",
                                        }}
                                    />
                                </Box>
                            )}

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
                                    maxWidth: props.isPlayerFullscreen
                                        ? "100%"
                                        : "40%",
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
                                        : youTubePlayerState?.getVideoData
                                              .title}
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
                                    {props.playerItem?.author
                                        ? props.playerItem?.author.replace(
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
                                    maxWidth: props.isPlayerFullscreen
                                        ? "100%"
                                        : "20%",
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
                                    width: width,
                                    maxWidth: "100%",
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
                                        : youTubePlayerState?.getVideoData
                                              .title}
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
                                    {props.playerItem?.author
                                        ? props.playerItem?.author.replace(
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
                                        props.playerItem.organizationId
                                            ?.length !== 0)
                                        ? // 出演者一覧と組織名一覧を1つにまとめる処理
                                          [
                                              ...(props.playerItem.actorId ||
                                                  []),
                                              ...(props.playerItem
                                                  .organizationId || []),
                                          ].map((id) => {
                                              //   const isActor =
                                              //       playNowDetail.actorId &&
                                              //       playNowDetail.actorId.includes(id);
                                              const r =
                                                  props.searchSuggestion.find(
                                                      (item) =>
                                                          item.value === id,
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
                                                              whiteSpace:
                                                                  "nowrap", // 改行させない
                                                              textOverflow:
                                                                  "ellipsis", // 長いテキストを省略して表示
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
                                                                      item.label ===
                                                                          id,
                                                              );

                                                          const result: InputValue[] =
                                                              [];
                                                          // = props.inputValue.filter(
                                                          //     (item) => item.categoryId !== "actor",
                                                          // );

                                                          if (
                                                              actorSearchSuggestion
                                                          ) {
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

                                                              result.push(
                                                                  value,
                                                              );
                                                          }

                                                          props.setInputValue(
                                                              result,
                                                          );
                                                          props.setIsPlayerFullscreen(
                                                              false,
                                                          );
                                                      }}
                                                      onKeyPress={(e) => {
                                                          // onClickを実行する。
                                                          if (
                                                              e.key ===
                                                                  "Enter" ||
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
                                                text={
                                                    props.playerItem.description
                                                }
                                                date={
                                                    props.playerItem
                                                        ?.publishedAt
                                                        ? props.playerItem
                                                              ?.publishedAt
                                                        : undefined
                                                }
                                                maxLine={2}
                                            />
                                        )}
                                </Box>
                                {/* プレイリストの表示 */}
                                <h3>
                                    {isMobile && props.playerPlaylist?.title}
                                </h3>
                                {isMobile && props.playerPlaylist
                                    ? props.playerPlaylist.videos.map(
                                          (item: PlayerItem) => (
                                              <>
                                                  <Box
                                                      key={item.mediaId}
                                                      sx={{
                                                          maxWidth: "80vw",
                                                          margin: "0 auto",
                                                      }}
                                                  >
                                                      <Thumbnail
                                                          videoId={
                                                              item.mediaId
                                                                  ? item.mediaId
                                                                  : ""
                                                          }
                                                          thumbnailType="list"
                                                          title={item.title}
                                                          viewCount={
                                                              item.viewCount
                                                          }
                                                          channelTitle={
                                                              item.author
                                                          }
                                                          duration={
                                                              item.duration
                                                          }
                                                          publishedAt={
                                                              item.publishedAt
                                                          }
                                                          onClick={(e) => {
                                                              // ↓ 親要素のonClickを発火させたくない場合に追記
                                                              e.stopPropagation();
                                                              props.setPlayerItem(
                                                                  item,
                                                              );
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
                                              <Box
                                                  key={item.mediaId}
                                                  sx={{
                                                      maxWidth: "25vw",
                                                      margin: "0 auto",
                                                  }}
                                              >
                                                  <Thumbnail
                                                      videoId={
                                                          item.mediaId
                                                              ? item.mediaId
                                                              : ""
                                                      }
                                                      title={item.title}
                                                      viewCount={item.viewCount}
                                                      channelTitle={item.author}
                                                      publishedAt={
                                                          item.publishedAt
                                                      }
                                                      onClick={(e) => {
                                                          // ↓ 親要素のonClickを発火させたくない場合に追記
                                                          e.stopPropagation();
                                                          props.setPlayerItem(
                                                              item,
                                                          );
                                                      }}
                                                  />
                                              </Box>
                                          ),
                                      )
                                    : null}
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </>
        );
    }
}
