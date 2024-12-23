import type { InputValue } from "@/components/Navbar/SuperSearchBar";
import type { ultraSuperSearchBarSearchSuggestion } from "@/components/Navbar/UltraSuperSearchBar";
import rgbToHex from "@/libs/colorConverter";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { Box, Chip } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { useTheme } from "@mui/material/styles";
import Linkify from "linkify-react";
import { useEffect, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { YouTubePlayer } from "react-youtube";
import Thumbnail from "./Thumbnail";
import YouTubePlayerView from "./YouTubePlayerView";
import "linkify-plugin-hashtag";
import { blue } from "@mui/material/colors";
import Link from "./Link";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

export type PlayerItem = {
    videoId?: string;
    short?: boolean;
    title?: string;
    description?: string;
    viewCount?: number;
    channelId?: string;
    channelTitle?: string;
    publishedAt?: Date;
    actorId?: Array<string>;
    organization?: Array<string>;
};

type PlayerProps = {
    // ウルトラスーパーサーチバー
    inputValue: InputValue[];
    setInputValue: Dispatch<SetStateAction<InputValue[]>>;
    searchSuggestion: ultraSuperSearchBarSearchSuggestion[];

    screenWidth: number;
    screenHeight: number;
    isMobile: boolean;
    // フルスクリーンで表示するかどうか
    isPlayerFullscreen: boolean;
    setIsPlayerFullscreen: Dispatch<SetStateAction<boolean>>;

    PlayerItem: PlayerItem | undefined;
    setPlayerItem: Dispatch<SetStateAction<PlayerItem | undefined>>;
    Playlist?: Array<PlayerItem>; // プレイリスト
    searchResult?: Array<PlayerItem>; // 検索結果のリスト
    style?: React.CSSProperties; // 外部からスタイルを受け取る（オプション）
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
    // プレイヤーの状態(例、再生中、停止中、etc...)
    const [playerState, setPlayerState] = useState<string | undefined>(
        undefined,
    );
    // YouTubeプレイヤーの実行関数集(再生を実行したり、再生を停止させたり etc...)
    const [player, setPlayer] = useState<YouTubePlayer | undefined>(undefined);

    // propsのvideoIdが変更されたらplayNowVideoIdを更新。
    useEffect(() => {
        setPlayNowVideoId(
            props.PlayerItem !== undefined ? props.PlayerItem.videoId : "",
        );
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

    // サムネイルがクリックされた時
    const handleVideoClick = (event: React.MouseEvent<HTMLElement>) => {
        const videoId = event.currentTarget.getAttribute("data-videoId");
        setPlayNowVideoId(videoId ? videoId : undefined);
        props.setPlayerItem({ videoId: videoId ? videoId : "" });
    };

    // actorId、entityIdがクリックされた時
    const handleActor = (
        event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
    ) => {
        const actorId = event.currentTarget.getAttribute("data-actorId");

        const actorSearchSuggestion = props.searchSuggestion.find(
            (item) => item.value === actorId || item.label === actorId,
        );

        const result: InputValue[] = [];
        // = props.inputValue.filter(
        //     (item) => item.categoryId !== "actor",
        // );

        if (actorSearchSuggestion) {
            const value: InputValue = Object.assign(
                {
                    createdAt: new Date(),
                    sort: actorSearchSuggestion.sort || 99,
                },
                actorSearchSuggestion,
            );

            result.push(value);
        }

        props.setInputValue(result);
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
    // idから検索候補を返す
    const getSearchSuggestionFromId = (
        id: string,
    ): ultraSuperSearchBarSearchSuggestion => {
        const r = props.searchSuggestion.find((item) => item.value === id);
        if (r) {
            return r;
        }
        return {
            label: id,
            value: id,
            categoryId: id,
            categoryLabel: id,
        };
    };

    const linkifyOptions = {
        render: {
            url: ({
                attributes,
                content,
            }: { attributes: { [attr: string]: any }; content: string }) => {
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
            hashtag: ({
                attributes,
                content,
            }: { attributes: { [attr: string]: any }; content: string }) => {
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
            ref={playerViewRef}
            sx={{
                // videoIdがセットされていない時はPlayerを非表示
                display: playNowVideoId ? "block" : "none",
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
                    display: props.isMobile ? "" : "flex",
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
                            props.isPlayerFullscreen && !props.isMobile
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
                                <CloseIcon
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
                            props.PlayerItem?.videoId
                                ? props.PlayerItem?.videoId
                                : ""
                        }
                        style={{
                            // padding: "0", // プレイヤーの上下にスペースを追加
                            margin: "0 auto",
                            maxWidth: "100%",
                            maxHeight: "100%",
                            // maxHeight: "100%", // 高さに制限をつけることでパソコンのモニター等で無制限に大きくならないようにする。
                        }}
                        // 動画の比率は、横：縦 = １６：９で
                        width={
                            props.isMobile && props.isPlayerFullscreen
                                ? `${props.screenWidth}px`
                                : props.isPlayerFullscreen
                                  ? `${((props.screenHeight * 0.55) / 9) * 16}px`
                                  : `${((props.screenHeight * 0.1) / 9) * 16}px`
                        }
                        height={
                            props.isMobile && props.isPlayerFullscreen
                                ? `${(props.screenWidth / 16) * 9}px`
                                : props.isPlayerFullscreen
                                  ? `${props.screenHeight * 0.55}px`
                                  : `${props.screenHeight * 0.1}px`
                            //   props.screenHeight / 9 < props.screenWidth / 16,
                        }
                        playerRadius={
                            !(props.isMobile && props.isPlayerFullscreen)
                        }
                        setPlayer={setPlayer}
                        setPlayerState={setPlayerState}
                    />

                    {/* PlayerView縮小表示の時のHTML */}
                    <Box
                        onClick={mouseClickTogglePlayerFullscreen}
                        onKeyDown={keyDownTogglePlayerFullscreen}
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
                            {playNowDetail
                                ? playNowDetail.title
                                    ? playNowDetail.title
                                    : "タイトル不明"
                                : "タイトル不明"}
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
                            {playNowDetail
                                ? playNowDetail.channelTitle
                                    ? playNowDetail.channelTitle
                                    : ""
                                : ""}
                        </Box>
                    </Box>
                    <Box
                        onClick={mouseClickTogglePlayerFullscreen}
                        onKeyDown={keyDownTogglePlayerFullscreen}
                        sx={{
                            display: props.isPlayerFullscreen
                                ? "none"
                                : "block",
                            maxWidth: props.isPlayerFullscreen ? "100%" : "20%",
                            margin: "auto",
                        }}
                    >
                        {playerState &&
                            (playerState === "再生中" ? (
                                <PauseIcon
                                    sx={{
                                        height: "100%",
                                        margin: "auto",
                                    }}
                                    onClick={(e: React.MouseEvent) => {
                                        if (player) {
                                            // ↓ 親要素のonClickを発火させたくない場合に追記
                                            e.stopPropagation();
                                            player.pauseVideo();
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
                                        if (player) {
                                            player.playVideo();
                                        }
                                    }}
                                />
                            ))}
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
                        <p>出演者</p>
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
                            playNowDetail.actorId &&
                            playNowDetail.actorId.length !== 0
                                ? playNowDetail.actorId.map((actorId) => (
                                      <Chip
                                          key={actorId}
                                          variant="outlined"
                                          sx={{
                                              "& .MuiChip-label": {
                                                  maxWidth: "100%",
                                                  whiteSpace: "nowrap", // 改行させない
                                                  textOverflow: "ellipsis", // 長いテキストを省略して表示
                                              },
                                          }}
                                          avatar={
                                              getSearchSuggestionFromId(actorId)
                                                  .imgSrc ? (
                                                  <Avatar
                                                      alt={
                                                          getSearchSuggestionFromId(
                                                              actorId,
                                                          ).label
                                                      }
                                                      src={
                                                          getSearchSuggestionFromId(
                                                              actorId,
                                                          ).imgSrc
                                                      }
                                                  />
                                              ) : (
                                                  <Avatar>
                                                      {
                                                          getSearchSuggestionFromId(
                                                              actorId,
                                                          ).label[0]
                                                      }
                                                  </Avatar>
                                              )
                                          }
                                          label={
                                              getSearchSuggestionFromId(actorId)
                                                  .label
                                          }
                                          color="success"
                                          onClick={ClickHandleActor}
                                          onKeyPress={KeyDownHandleActor}
                                          data-actorId={actorId}
                                      />
                                  ))
                                : null}
                        </Box>
                        {/* 組織名一覧 */}
                        <p>出演組織</p>
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
                            playNowDetail.organization &&
                            playNowDetail.organization.length !== 0
                                ? playNowDetail.organization.map(
                                      (organizationId, index) => (
                                          <Chip
                                              key={organizationId}
                                              variant="outlined"
                                              sx={{
                                                  "& .MuiChip-label": {
                                                      maxWidth: "100%",
                                                      whiteSpace: "nowrap", // 改行させない
                                                      textOverflow: "ellipsis", // 長いテキストを省略して表示
                                                  },
                                              }}
                                              avatar={
                                                  getSearchSuggestionFromId(
                                                      organizationId,
                                                  ).imgSrc ? (
                                                      <Avatar
                                                          alt={
                                                              getSearchSuggestionFromId(
                                                                  organizationId,
                                                              ).label
                                                          }
                                                          src={
                                                              getSearchSuggestionFromId(
                                                                  organizationId,
                                                              ).imgSrc
                                                          }
                                                      />
                                                  ) : (
                                                      <Avatar>
                                                          {
                                                              getSearchSuggestionFromId(
                                                                  organizationId,
                                                              ).label[0]
                                                          }
                                                      </Avatar>
                                                  )
                                              }
                                              label={
                                                  getSearchSuggestionFromId(
                                                      organizationId,
                                                  ).label
                                              }
                                              color="success"
                                              onClick={ClickHandleActor}
                                              onKeyPress={KeyDownHandleActor}
                                              data-actorId={organizationId}
                                          />
                                      ),
                                  )
                                : null}
                        </Box>
                        {/* 概要欄 */}
                        <p>概要欄</p>
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
                    </Box>
                </Box>
                {/* 右カラム */}
                <Box
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
                    <Box
                        style={{
                            overflowY: "auto",
                            maxHeight: "100vh",
                            paddingBottom: "25vh",
                            margin: "0 auto",
                        }}
                    >
                        {props.searchResult
                            ? props.searchResult.map((item: PlayerItem) => (
                                  <Thumbnail
                                      key={item.videoId}
                                      videoId={item.videoId ? item.videoId : ""}
                                      title={item.title}
                                      viewCount={item.viewCount}
                                      channelTitle={item.channelTitle}
                                      publishedAt={item.publishedAt}
                                      onClick={handleVideoClick}
                                  />
                              ))
                            : null}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
