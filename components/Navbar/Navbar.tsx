import SearchIcon from "@mui/icons-material/Search";
import { AppBar, Box, Button, Link, Toolbar } from "@mui/material";
import InputBase from "@mui/material/InputBase";
import { alpha, styled } from "@mui/material/styles";
import Image from "next/image";
import SearchBar from "./SearchBar";
import { Dispatch, Ref, SetStateAction } from "react";

export const NavButton = styled(Button)({
  color: "primary",
  fontWeight: "bold",
}) as typeof Button;

type SearchBarProps = {
  setSearchQuery: Dispatch<SetStateAction<string>>;
  search: () => void;
};

export default function Navbar(props: SearchBarProps) {
  return (
    <AppBar position="static" color="default">
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

        <NavButton color="primary" href="/#">
          トップ
        </NavButton>
        <NavButton color="primary" href="/#">
          サービス
        </NavButton>
        <NavButton href="https://forms.gle/osqdRqh1MxWhA51A8" target="_blank">
          お問い合わせ
        </NavButton>
      </Toolbar>
    </AppBar>
  );
}
