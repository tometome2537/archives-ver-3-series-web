import type { InputValue } from "@/components/Navbar/SearchBar/SearchBar";
import rgbToHex from "@/libs/colorConverter";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { Box, Chip } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { useTheme } from "@mui/material/styles";
import Linkify from "linkify-react";
import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { YouTubePlayer } from "react-youtube";
import Thumbnail from "./Thumbnail";
import YouTubePlayerView from "./YouTubePlayerView";
import type { YouTubePlayerState } from "./YouTubePlayerView";
import "linkify-plugin-hashtag";
import { useBrowserInfoContext } from "@/contexts/BrowserInfoContext";
import { KeyboardArrowDown } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import { blue } from "@mui/material/colors";
import Link from "./Link";
import type { MultiSearchBarSearchSuggestion } from "./Navbar/SearchBar/MultiSearchBar";

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

    actorId?: Array<string>;
    organizationId?: Array<string>;
    // 動画のタテの比率 (デフォルトは9)
    arHeight?: number;
    // 動画のヨコの比率 (デフォルトは16)
    arWidth?: number;
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

    // 現在再生されている動画の詳細情報
    const [playNowDetail, setPlayNowDetail] = useState<
        PlayerItem | undefined
    >();
    // 動画タテの比率 (デフォルトは9、トピックチャンネルの場合は１)
    const arHeight: number =
        playNowDetail?.arHeight ||
        (youTubePlayerState?.getVideoData.author.endsWith(" - Topic") && 1) ||
        9;
    // 動画ヨコの比率 (デフォルトは16、トピックチャンネルの場合は１)
    const arWidth: number =
        playNowDetail?.arHeight ||
        (youTubePlayerState?.getVideoData.author.endsWith(" - Topic") && 1) ||
        16;

    // playNowVideoIdが更新されたらplayNowDetailを更新
    useEffect(() => {
        // プレイリストにないvideoIdが外部から設定された場合は、Playlistを破棄する。
        const r = props.playerPlaylist?.videos.find((video) => {
            return video.videoId === props.playerItem?.videoId;
        });
        if (!r && props.setPlayerPlaylist) {
            props.setPlayerPlaylist(undefined);
        }

        // 再生中のvideoIdが変更された時にPlaylistから動画詳細を取得する。
        // (動画再生時にvideoIdだけ指定すればいいようにするための処理)
        const result: PlayerItem | undefined =
            props.playerPlaylist?.videos?.find((item: PlayerItem) => {
                if (item.videoId === props.playerItem?.videoId) {
                    return item;
                }
            });
        setPlayNowDetail(result || props.playerItem);
    }, [
        props.playerItem,
        props.playerPlaylist?.videos,
        props.setPlayerPlaylist,
    ]);

    // 楽曲の再生が終わったら次の曲を再生する。
    useEffect(() => {
        if (youTubePlayerState?.state === "ended") {
            // 再生が終わったら。
            // 次の曲を順に再生する場合。
            const playListIndex = props.playerPlaylist?.videos.findIndex(
                (item) =>
                    item.videoId === youTubePlayerState?.getVideoData.video_id,
            );
            if (playListIndex) {
                console.log(props.playerPlaylist?.videos[playListIndex + 1]);
                props.setPlayerItem(
                    props.playerPlaylist?.videos[playListIndex + 1],
                );
            }
        }
    }, [
        props.setPlayerItem,
        youTubePlayerState?.state,
        props.playerPlaylist,
        youTubePlayerState?.getVideoData.video_id,
    ]);

    const linkifyOptions = {
        render: {
            url: ({
                attributes,
                content,
            }: {
                attributes: { [attr: string]: React.ReactNode };
                content: string;
            }) => {
                try {
                    const url = new URL(content);
                    const pathSegments = url.pathname
                        .split("/")
                        .filter((segment) => segment);
                    const userId = pathSegments[0]
                        ? pathSegments[0].replace("@", "")
                        : content;

                    if (
                        url.hostname === "twitter.com" ||
                        url.hostname === "x.com"
                    ) {
                        return (
                            <Link {...attributes}>
                                <Chip
                                    size="small"
                                    avatar={<Avatar src="/x_logo.png" />}
                                    label={userId}
                                />
                            </Link>
                        );
                    }

                    if (
                        url.hostname === "instagram.com" ||
                        url.hostname === "www.instagram.com"
                    ) {
                        return (
                            <Link {...attributes}>
                                <Chip
                                    size="small"
                                    avatar={<Avatar src="/ig_logo.png" />}
                                    label={userId}
                                />
                            </Link>
                        );
                    }

                    if (
                        url.hostname === "tiktok.com" ||
                        url.hostname === "www.tiktok.com"
                    ) {
                        return (
                            <Link {...attributes}>
                                <Chip
                                    size="small"
                                    avatar={<Avatar src="/tiktok_logo.png" />}
                                    label={userId}
                                />
                            </Link>
                        );
                    }

                    if (
                        url.hostname === "youtube.com" ||
                        url.hostname === "www.youtube.com"
                    ) {
                        return (
                            <Link {...attributes}>
                                <Chip
                                    size="small"
                                    avatar={<Avatar src="/yt_logo.png" />}
                                    label={userId}
                                />
                            </Link>
                        );
                    }
                } catch (error) {
                    return <Link {...attributes}>{content}</Link>;
                }
            },
            hashtag: ({
                attributes,
                content,
            }: {
                attributes: { [attr: string]: React.ReactNode };
                content: string;
            }) => {
                return (
                    <Link
                        style={{ color: blue[400] }}
                        underline="none"
                        {...attributes}
                    >
                        {content}
                    </Link>
                );
            },
        },
        formatHref: {
            hashtag: (href: string) =>
                `https://www.youtube.com/hashtag/${href.substring(1)}`,
        },
    };

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
                                width:
                                    isMobile && props.isPlayerFullscreen
                                        ? `${screenWidth}px`
                                        : props.isPlayerFullscreen
                                          ? `${((screenHeight * 0.55) / arHeight) * arWidth}px`
                                          : `${((screenHeight * 0.1) / arHeight) * arWidth}px`,
                                margin: "0 auto",
                            }}
                        >
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
                        width={
                            isMobile && props.isPlayerFullscreen
                                ? `${screenWidth}px`
                                : props.isPlayerFullscreen
                                  ? `${((screenHeight * 0.55) / arHeight) * arWidth}px`
                                  : `${((screenHeight * 0.1) / arHeight) * arWidth}px`
                        }
                        height={
                            isMobile && props.isPlayerFullscreen
                                ? `${(screenWidth / arWidth) * arHeight}px`
                                : props.isPlayerFullscreen
                                  ? `${screenHeight * 0.55}px`
                                  : `${screenHeight * 0.1}px`
                            //   props.screenHeight / 9 < props.screenWidth / 16,
                        }
                        playerRadius={!(isMobile && props.isPlayerFullscreen)}
                        setPlayer={setYouTubePlayer}
                        setPlayerState={setYouTubePlayerState}
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
                            {youTubePlayerState
                                ? youTubePlayerState?.getVideoData.title
                                : playNowDetail?.title}
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
                            {youTubePlayerState
                                ? youTubePlayerState.getVideoData.author
                                    ? youTubePlayerState.getVideoData.author
                                    : ""
                                : ""}
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
                    {/* YouTube Playerの下の概要欄 */}
                    <Box
                        sx={{
                            display: props.isPlayerFullscreen
                                ? "block"
                                : "none",
                            overflowY: "auto",
                            maxHeight: "50vh",
                            paddingBottom: "40vh",
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
                            {youTubePlayerState
                                ? youTubePlayerState.getVideoData.title
                                    ? youTubePlayerState.getVideoData.title
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
                            {youTubePlayerState
                                ? youTubePlayerState.getVideoData.author
                                    ? youTubePlayerState.getVideoData.author
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
                                    // hour: "2-digit", // 時（2桁形式）
                                    // minute: "2-digit", // 分（2桁形式）
                                    // second: "2-digit", // 秒（2桁形式）
                                    hour12: false, // 24時間形式
                                })}
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
                            playNowDetail &&
                            (playNowDetail.actorId ||
                                playNowDetail.organizationId) &&
                            (playNowDetail.actorId?.length !== 0 ||
                                playNowDetail.organizationId?.length !== 0)
                                ? // 出演者一覧と組織名一覧を1つにまとめる処理
                                  [
                                      ...(playNowDetail.actorId || []),
                                      ...(playNowDetail.organizationId || []),
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
                                // 文字列内の\nを適切に反映させる。
                                whiteSpace: "pre-line",
                            }}
                        >
                            {props.isPlayerFullscreen &&
                                playNowDetail?.description && (
                                    <Linkify
                                        as="p"
                                        options={{
                                            ...linkifyOptions,
                                            target: "_blank",
                                        }}
                                    >
                                        {playNowDetail.description}
                                    </Linkify>
                                )}
                        </Box>
                        {/* プレイリストの表示 */}
                        <p>{isMobile && props.playerPlaylist?.title}</p>
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
                        <p>{props.playerPlaylist?.title}</p>
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
