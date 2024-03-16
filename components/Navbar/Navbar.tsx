// import SearchIcon from "@mui/icons-material/Search";
import { AppBar, Button, Link, Toolbar, styled } from "@mui/material";
// import InputBase from "@mui/material/InputBase";
// import { alpha, styled } from "@mui/material/styles";
import Image from "next/image";

export const NavButton = styled(Button)({
  color: "primary",
  fontWeight: "bold",
}) as typeof Button;

// const Search = styled("div")(({ theme }) => ({
//   position: "relative",
//   borderRadius: theme.shape.borderRadius,
//   backgroundColor: alpha(theme.palette.common.white, 0.15),
//   "&:hover": {
//     backgroundColor: alpha(theme.palette.common.white, 0.25),
//   },
//   marginLeft: 0,
//   width: "100%",
//   [theme.breakpoints.up("sm")]: {
//     marginLeft: theme.spacing(1),
//     width: "auto",
//   },
// }));

// const SearchIconWrapper = styled("div")(({ theme }) => ({
//   padding: theme.spacing(0, 2),
//   height: "100%",
//   position: "absolute",
//   pointerEvents: "none",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
// }));

// const StyledInputBase = styled(InputBase)(({ theme }) => ({
//   color: "inherit",
//   width: "100%",
//   "& .MuiInputBase-input": {
//     padding: theme.spacing(1, 1, 1, 0),
//     // vertical padding + font size from searchIcon
//     paddingLeft: `calc(1em + ${theme.spacing(4)})`,
//     transition: theme.transitions.create("width"),
//     [theme.breakpoints.up("sm")]: {
//       width: "12ch",
//       "&:focus": {
//         width: "20ch",
//       },
//     },
//   },
// }));

export default function Navbar() {
  return (
    <AppBar position="static" color="default">
      <Toolbar>
        <Link href="/" sx={{ flexGrow: 1, marginTop: 1, marginBottom: 0.5 }}>
          <Image
            src="/MAP.png"
            alt="Music Archives Project Logo"
            width={240}
            height={60}
          />
        </Link>
        {/* <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search> */}
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
    // <nav className="fixed top-0 z-50 min-h-18 w-full border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
    //   <div className="min-h-18 justify-between p-3 md:flex">
    //     <div className="mb-2 flex items-center justify-start md:mb-0">
    //       <button
    //         data-drawer-target="logo-sidebar"
    //         data-drawer-toggle="logo-sidebar"
    //         aria-controls="logo-sidebar"
    //         type="button"
    //         className="inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
    //       >
    //         <HiMenuAlt2 size={24} />
    //       </button>
    //       <Button variant="solid">Hello world</Button>
    //       <a href="/" className="me-12 ms-2 flex">
    //         <Image
    //           src={"/MAP.png"}
    //           width={152}
    //           height={60}
    //           alt="Logo"
    //           className="max-w-62"
    //         ></Image>
    //       </a>
    //     </div>
    //     <div className="w-full md:w-128">
    //       <SearchBar />
    //     </div>
    //     <div className="hidden w-62 xl:block"></div>
    //   </div>
    // </nav>
  );
}
