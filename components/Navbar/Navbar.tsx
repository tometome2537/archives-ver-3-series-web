import rgbToHex from "@/libs/colorConverter";
import { AppBar, Box, Button, Container, Link, Toolbar } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";
import type { Dispatch, SetStateAction } from "react";
import { Fragment } from "react";
import EntitySelector from "../EntitySelector";
import type { EntityObj } from "../EntitySelector";
import SearchBar from "./SearchBar";

export const NavButton = styled(Button)({
    color: "primary",
    fontWeight: "bold",
}) as typeof Button;

type SearchBarProps = {
    setSearchQuery: Dispatch<SetStateAction<string>>;
    search: () => void;
    setEntityId: Dispatch<SetStateAction<Array<EntityObj>>>;
    entityIdString: Array<string>;
};

export default function Navbar(props: SearchBarProps) {
    // テーマ設定を取得
    const theme = useTheme();

    return (
        <Fragment>
            <AppBar
                position="fixed"
                color="default"
                sx={{
                    // ↓ 背景色の指定と背景の透過
                    backgroundColor: `rgba(
                        ${rgbToHex(theme.palette.background.paper).r},
                        ${rgbToHex(theme.palette.background.paper).g},
                        ${rgbToHex(theme.palette.background.paper).b},
                        0.75)`,
                    // 背景をぼかす
                    backdropFilter: "blur(15px)",
                    // 背景をぼかす{Safari(WebKit)対応}
                    WebkitBackdropFilter: "blur(15px)",
                }}
            >
                <Container maxWidth="xl">
                    <Toolbar>
                        <Link href="/" sx={{ margin: "0.25 auto" }}>
                            <Image
                                src="/MAP.png"
                                alt="Music Archives Project Logo"
                                width={160}
                                height={40}
                            />
                        </Link>
                        <Box sx={{ flexGrow: 1 }} />
                        <SearchBar
                            setSearchQuery={props.setSearchQuery}
                            search={props.search}
                        />
                        {/* <SuperSearchBar /> */}
                        <Box sx={{ flexGrow: 1 }} />
                        <EntitySelector
                            entityIdString={props.entityIdString}
                            setEntityId={props.setEntityId}
                        />
                        <Box sx={{ flexGrow: 1 }} />
                        <NavButton
                            href="https://forms.gle/osqdRqh1MxWhA51A8"
                            target="_blank"
                        >
                            contact
                        </NavButton>
                    </Toolbar>
                </Container>
            </AppBar>
            <Toolbar />
        </Fragment>
    );
}
