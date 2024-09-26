import { AppBar, Box, Button, Link, Toolbar } from "@mui/material";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import {
  Dispatch,
  SetStateAction,
  useRef,
  useEffect,
  useState,
  MutableRefObject,
} from "react";
import SearchBar from "./SearchBar";
import EntitySelector from "../EntitySelector";
import { EntityObj } from "../EntitySelector";
import { useTheme } from "@mui/material/styles";
import rgbToHex from "@/libs/colorConverter";

export const NavButton = styled(Button)({
  color: "primary",
  fontWeight: "bold",
}) as typeof Button;

type SearchBarProps = {
  screenHeight: number;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  search: () => void;
  setEntityId: Dispatch<SetStateAction<Array<EntityObj>>>;
  entityIdString: MutableRefObject<string[]>;
  setNavbarHeight: Dispatch<SetStateAction<number>>;
};

export default function Navbar(props: SearchBarProps) {
  // テーマ設定を取得
  const theme = useTheme();

  // NavbarのHTMLが保存される
  const NavbarRef = useRef<HTMLDivElement | null>(null);

  // BottomNavigationの高さを調べる
  useEffect(() => {
    if (typeof window !== "undefined") {
      // タブバーの高さを再計算する関数
      const updateNavHeight = () => {
        if (NavbarRef.current) {
          const height = NavbarRef.current.clientHeight;
          props.setNavbarHeight(height);
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
  }, [NavbarRef, props.screenHeight]);


  return (
    <>
      <AppBar
        ref={NavbarRef}
        position="fixed"
        color="default"
        sx={{
          // 画面の高さに応じてNavbarの高さを調整
          height: `${props.screenHeight * 0.09}px`,
          // ↓ 背景色の指定と背景の透過
          backgroundColor: `rgba(
                        ${rgbToHex(theme.palette.background.paper).r},
                        ${rgbToHex(theme.palette.background.paper).g},
                        ${rgbToHex(theme.palette.background.paper).b},
                        0.75
                        )`,
          // 背景をぼかす
          backdropFilter: "blur(15px)",
          // 背景をぼかす{Safari(WebKit)対応}
          WebkitBackdropFilter: "blur(15px)",
        }}
      >
        <Toolbar>
          <Link href="/" sx={{ margin: "0.25 auto" }}>
            <Image
              src="/MAP.png"
              alt="Music Archives Project Logo"
              width={160}
              height={40}
            />
          </Link>
          <Box sx={{ flexGrow: 1 }}></Box>
          <SearchBar
            setSearchQuery={props.setSearchQuery}
            search={props.search}
          />
          <Box sx={{ flexGrow: 1 }}></Box>
          <EntitySelector
            entityIdString={props.entityIdString}
            setEntityId={props.setEntityId}
          />
          <Box sx={{ flexGrow: 1 }}></Box>
          <NavButton href="https://forms.gle/osqdRqh1MxWhA51A8" target="_blank">
            contact
          </NavButton>
        </Toolbar>
      </AppBar>
    </>
  );
}
