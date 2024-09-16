import { useState, useRef } from "react";
import Navbar from "./Navbar/Navbar";
import { Grid } from "@mui/material";
import Sidebar from "./Navbar/Sidebar";
import VideoView from "./VideoView";
import VideoViewTemporary from "./VideoViewTemporary";
import Tabbar from "./Tabbar";
import { EntityObj } from "./EntitySelector";
import Player from "./Player";
import { PlayerItem } from "./Player";

export default function Main() {
  // Navbarの高さを定義
  const [navbarHeight, setNavbarHeight] = useState<number>(0);
  // Tabbarの高さを定義
  const [tabbarHeight, setTabbarHeight] = useState<number>(0);
  // 現在アクティブなタブ
  const [activeTab, setActiveTab] = useState<string>("liveInformation");
  // アクティブになったタブのリスト ※ 一度アクティブなったタブは破棄しない。
  const activeTabList = useRef<Array<string>>(["liveInformation"]);

  // Playerを拡大表示するかどうか
  const [isPlayerFullscreen, setIsPlayerFullscreen] = useState<boolean>(false);
  // Player
  const [playerItem, setPlayerItem] = useState<PlayerItem>({
    videoId: "HIYXEh893JM",
    title: "オールドファッション",
  });

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
            <div style={{ marginTop: navbarHeight }}></div>
            {JSON.stringify(activeTabList)}
            <div>楽曲集</div>
            {/* ↓ Tabbarに被らないように底上げ */}
            <div style={{ marginTop: tabbarHeight }}></div>
          </div>
        )}

        {activeTabList.current.includes("temporaryYouTube") && (
          <>
            <div
              style={{
                display: activeTab === "temporaryYouTube" ? "block" : "none", // アクティブかどうかで表示/非表示を切り替え
              }}
            >
              {/* ↓ header(Navbar)に被らないように */}
              <div style={{ marginTop: navbarHeight }}></div>
              <VideoViewTemporary entityId={entityId} setPlayerItem={setPlayerItem} />
              {/* ↓ Tabbarに被らないように底上げ */}
              <div style={{ marginTop: tabbarHeight }}></div>
            </div>
          </>
        )}

        {activeTabList.current.includes("YouTube") && (
          <div
            style={{
              display: activeTab === "YouTube" ? "block" : "none", // アクティブかどうかで表示/非表示を切り替え
            }}
          >
            {/* ↓ header(Navbar)に被らないように */}
            <div style={{ marginTop: navbarHeight }}></div>
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
      </div>

      {/* 画面下に固定されたタブバー */}
      <Grid
        container
        direction="column"
        sx={{
          position: "fixed",
          bottom: 0,
        }}
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
          <Player
            PlayerItem={playerItem}
            isPlayerFullscreen={isPlayerFullscreen}
            setIsPlayerFullscreen={setIsPlayerFullscreen}
            style={{
              paddingTop: navbarHeight, // header(Navbar)に被らないように
              paddingBottom: tabbarHeight, // Tabbarに被らないように底上げ
            }}
          ></Player>
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
      </Grid>
    </>
  );
}
