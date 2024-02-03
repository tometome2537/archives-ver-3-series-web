import { useState } from "react";
import { Navbar } from "./Navbar";
import VideoView from "./VideoView";

export default function Main() {
  const [playerSize, setPlayerSize] = useState(1);
  const [isLargePlayer, setIsLargePlayer] = useState(false);

  return (
    <>
      <Navbar
        setPlayerSize={setPlayerSize}
        setIsLargePlayer={setIsLargePlayer}
      ></Navbar>
      <VideoView playerSize={playerSize} isLargePlayer={isLargePlayer} />
    </>
  );
}
