import { AppBar, Box, Button, Link, Toolbar } from "@mui/material";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import { Dispatch, SetStateAction, useRef, useEffect, useState, MutableRefObject } from "react";
import SearchBar from "./SearchBar";
import EntitySelector from "../EntitySelector";
import { EntityObj } from "../EntitySelector";

export const NavButton = styled(Button)({
  color: "primary",
  fontWeight: "bold",
}) as typeof Button;

type SearchBarProps = {
  setSearchQuery: Dispatch<SetStateAction<string>>;
  search: () => void;
  setEntityId: Dispatch<SetStateAction<Array<EntityObj>>>;
  entityIdString: MutableRefObject<string[]>;
  setNavbarHeight: Dispatch<SetStateAction<number>>;
};

export default function Navbar(props: SearchBarProps) {
  // NavbarのHTMLが保存される
  const NavbarRef = useRef<HTMLDivElement | null>(null);
  // BottomNavigationの高さの数値が入る。
  const [navHeight, setNavHeight] = useState<number>(0);

  // BottomNavigationの高さを調べる
  useEffect(() => {
    if (NavbarRef.current) {
      const height = NavbarRef.current.clientHeight;
      setNavHeight(height)
      props.setNavbarHeight(height)
    }
  }, []);
  return (
    <>
      <AppBar ref={NavbarRef} position="fixed" color="default">
        <Toolbar>
          <Link href="/" sx={{ marginTop: 1, marginBottom: 0.5 }}>
            <Image
              src="/MAP.png"
              alt="Music Archives Project Logo"
              width={160}
              height={40}
            />
          </Link>
          <Box sx={{ flexGrow: 1 }}></Box>
          <SearchBar setSearchQuery={props.setSearchQuery} search={props.search} />
          <Box sx={{ flexGrow: 1 }}></Box>
          <EntitySelector entityIdString={props.entityIdString} setEntityId={props.setEntityId}></EntitySelector>
          <Box sx={{ flexGrow: 1 }}></Box>
          {/* <NavButton color="primary" href="/#">
            {navHeight}
          </NavButton> */}
          <NavButton href="https://forms.gle/osqdRqh1MxWhA51A8" target="_blank">
            contact
          </NavButton>
        </Toolbar>
      </AppBar>

      {/* ↓ AppBar分の高さを確保 */}
      {/* <Toolbar /> */}
    </>
  );
}
