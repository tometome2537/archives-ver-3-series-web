"use client";

import Main from "@/components/Main";
import { ThemeProvider, createTheme } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#167c3b",
      light: "#78877d",
      dark: "#526057",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#6A8B9C",
      light: "#87A2AF",
      dark: "#4A616D",
      contrastText: "#FFFFFF",
    },
    // secondary: {
    //   main: "#8A938D",
    //   light: "#A1A8A3",
    //   dark: "#606662",
    // },
    // tertiary: {
    //   main: "#86929A",
    //   light: "#9EA7AE",
    //   dark: "#5D666B",
    // },
    error: {
      main: "#BA1A1A",
      light: "#C74747",
      dark: "#821212",
    },
    warning: {
      main: "#FF9800",
    },
  },
});
export default function Home() {
  return (
    <>
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <Main />
      </ThemeProvider>
    </>
  );
}
