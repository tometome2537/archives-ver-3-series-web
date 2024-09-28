import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import { alpha, styled } from "@mui/material/styles";
import type { Dispatch, SetStateAction } from "react";

const Search = styled("div")(({ theme }) => ({
	position: "relative",
	borderRadius: theme.shape.borderRadius,
	border: "1px solid",
	borderColor: theme.palette.secondary.light,
	backgroundColor: alpha(theme.palette.common.white, 0.15),
	"&:hover": {
		backgroundColor: alpha(theme.palette.common.white, 0.25),
	},
	marginLeft: 0,
	width: "100%",
	[theme.breakpoints.up("sm")]: {
		marginLeft: theme.spacing(1),
		width: "auto",
	},
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
	padding: theme.spacing(0, 2),
	height: "100%",
	position: "absolute",
	top: 0,
	right: 0,
	pointerEvents: "none",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
	color: "inherit",
	width: "100%",
	"& .MuiInputBase-input": {
		padding: theme.spacing(1, 0, 1, 1),
		// vertical padding + font size from searchIcon
		paddingRight: `calc(1em + ${theme.spacing(4)})`,
		transition: theme.transitions.create("width"),
		[theme.breakpoints.up("sm")]: {
			width: "50ch",
		},
	},
})) as typeof InputBase;

type SearchBarProps = {
	setSearchQuery: Dispatch<SetStateAction<string>>;
	search: () => void;
};

export default function SearchBar(props: SearchBarProps) {
	return (
		<Search>
			<StyledInputBase
				placeholder="Search…"
				inputProps={{ "aria-label": "search" }}
				onChange={(e) => props.setSearchQuery(e.target.value)}
				onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
					if (e.key === "Enter") {
						// エンターキー押下時の処理
						props.search();
					}
				}}
			/>
			<SearchIconWrapper>
				<SearchIcon />
			</SearchIconWrapper>
		</Search>
	);
}
