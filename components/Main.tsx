import { useState } from "react";
import Navbar from "./Navbar/Navbar";
import Sidebar from "./Navbar/Sidebar";
import VideoView from "./VideoView";

export default function Main() {
  const [playerSize, setPlayerSize] = useState(1);
  const [isLargePlayer, setIsLargePlayer] = useState(false);
  const [currentSearchQuery, setCurrentSearchQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <Navbar setSearchQuery={setCurrentSearchQuery} search={() => setSearchQuery(currentSearchQuery)} />
      <Sidebar
        setPlayerSize={setPlayerSize}
        setIsLargePlayer={setIsLargePlayer}
      />
      <VideoView playerSize={playerSize} isLargePlayer={isLargePlayer} searchQuery={searchQuery} />
    </>
  );
}
