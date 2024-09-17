import { useState, useRef } from "react";
import Navbar from "./Navbar/Navbar";
import { Grid } from "@mui/material";
import Sidebar from "./Navbar/Sidebar";
import VideoView from "./VideoView";
import VideoTemporaryView from "./VideoTemporaryView";
import Tabbar from "./Tabbar";
import { EntityObj } from "./EntitySelector";
import PlayerView from "./PlayerView";
import { PlayerItem } from "./PlayerView";

export default function Main() {
  // Navbarの高さを定義
  const [navbarHeight, setNavbarHeight] = useState<number>(0);
  // Tabbarの高さを定義
  const [tabbarHeight, setTabbarHeight] = useState<number>(0);
  // 現在アクティブなタブ
  const [activeTab, setActiveTab] = useState<string>("temporaryYouTube");
  // アクティブになったタブのリスト ※ 一度アクティブなったタブは破棄しない。
  const activeTabList = useRef<Array<string>>(["temporaryYouTube"]);

  // Playerを拡大表示するかどうか
  const [isPlayerFullscreen, setIsPlayerFullscreen] = useState<boolean>(false);
  // Player
  const [playerItem, setPlayerItem] = useState<PlayerItem>({});
  const [playerPlaylist, setPlayerPlaylist] = useState<Array<PlayerItem>>([])
  const [playerSearchResult, setPlayerSearchResult] = useState<Array<PlayerItem>>([])

  // 選択されているEntity Id ※ EntitySelectorで使用。
  const [entityId, setEntityId] = useState<Array<EntityObj>>([]);

  const [playerSize, setPlayerSize] = useState(1);
  const [isLargePlayer, setIsLargePlayer] = useState(false);
  const [currentSearchQuery, setCurrentSearchQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <Navbar
        setEntityId={setEntityId}
        setSearchQuery={setCurrentSearchQuery}
        search={() => setSearchQuery(currentSearchQuery)}
        setNavbarHeight={setNavbarHeight}
      />

      {/* メインコンテンツ */}
      <div>
        {activeTabList.current.includes("linkCollection") && (
          <>
            <div
              style={{
                display: activeTab === "linkCollection" ? "block" : "none", // アクティブかどうかで表示/非表示を切り替え
              }}
            >
              {/* ↓ header(Navbar)に被らないように */}
              <div style={{ marginTop: navbarHeight }}></div>
              <div>それぞれのリンク集</div>
            </div>
            {/* ↓ Tabbarに被らないように底上げ */}
            <div style={{ marginTop: tabbarHeight }}></div>
          </>
        )}

        {activeTabList.current.includes("songs") && (
          <div
            style={{
              display: activeTab === "songs" ? "block" : "none", // アクティブかどうかで表示/非表示を切り替え
            }}
          >
            {/* ↓ header(Navbar)に被らないように */}
            <div style={{ paddingTop: navbarHeight }}></div>
            <div>楽曲集</div>
            {/* ↓ Tabbarに被らないように底上げ */}
            <div style={{ paddingTop: tabbarHeight }}></div>
          </div>
        )}

        {activeTabList.current.includes("temporaryYouTube") ? (
          <div
            style={{
              display: activeTab === "temporaryYouTube" ? "block" : "none", // アクティブかどうかで表示/非表示を切り替え

            }}
          >
            <div style={{
              // ↓ header(Navbar)に被らないように
              paddingTop: navbarHeight,
              // ↓ Tabbarに被らないように底上げ
              paddingBottom: tabbarHeight,
              // 拡大モードの時、縦スクロールを許可しない
              overflowY: isPlayerFullscreen ? "hidden" : "auto",
            }}>
              <VideoTemporaryView
                entityId={entityId}
                setPlayerItem={setPlayerItem}
                setPlayerPlaylist={setPlayerPlaylist}
                setPlayerSearchResult={setPlayerSearchResult}
              />
            </div>
          </div>
        ) : null}


        {activeTabList.current.includes("YouTube") && (
          <div
            style={{
              display: activeTab === "YouTube" ? "block" : "none", // アクティブかどうかで表示/非表示を切り替え
            }}
          >
            {/* ↓ header(Navbar)に被らないように */}
            <div style={{ paddingTop: navbarHeight }}></div>
            <Sidebar
              setPlayerSize={setPlayerSize}
              setIsLargePlayer={setIsLargePlayer}
            />
            <VideoView
              playerSize={playerSize}
              isLargePlayer={isLargePlayer}
              searchQuery={searchQuery}
            />
            {/* ↓ Tabbarに被らないように底上げ */}
            <div style={{ marginTop: tabbarHeight }}></div>
          </div>
        )}

        {activeTabList.current.includes("liveInformation") && (
          <div
            style={{
              display: activeTab === "liveInformation" ? "block" : "none", // アクティブかどうかで表示/非表示を切り替え
            }}
          >
            {/* ↓ header(Navbar)に被らないように */}
            <div style={{ marginTop: navbarHeight }}></div>
            <div>LIVE情報</div>
            {/* ↓ Tabbarに被らないように底上げ */}
            <div style={{ marginTop: tabbarHeight }}></div>
          </div>
        )}
      </div >

      {/* 画面下に固定されたタブバー */}
      < Grid
        container
        direction="column"
        sx={{
          position: "fixed",
          bottom: 0,
        }
        }
      >
        {/* 1段目 */}
        {/* Player */}
        {/* ↓ header(Navbar)に被らないように */}

        <Grid
          item
          sx={{
            maxHeight: "100vh",
            overflowY: "auto",
            position: "fixed",
            // bottom: tabbarHeight, // Tabbarの分浮かせる。
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <PlayerView
            PlayerItem={playerItem}
            Playlist={playerPlaylist}
            searchResult={playerSearchResult}
            isPlayerFullscreen={isPlayerFullscreen}
            setIsPlayerFullscreen={setIsPlayerFullscreen}
            style={{
              // header(Navbar)に被らないように
              paddingTop: isPlayerFullscreen ? navbarHeight : "",
              paddingBottom: tabbarHeight, // Tabbarに被らないように底上げ
              // marginTop: navbarHeight, // header(Navbar)に被らないように
              // marginBottom: tabbarHeight, // Tabbarに被らないように底上
            }}
          ></PlayerView>
        </Grid>

        {/* 2段目 */}
        <Grid
          item
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <Tabbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            activeTabList={activeTabList}
            setTabbarHeight={setTabbarHeight}
          />
        </Grid>
      </Grid >
    </>
  );
}
