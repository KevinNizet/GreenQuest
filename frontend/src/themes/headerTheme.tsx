import * as React from "react";
import { red } from "@mui/material/colors";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const headerTheme = createTheme({
  palette: {
    primary: {
      main: "#DBAD42", // Couleur principale (jaune)
    },
    secondary: {
      main: "#1d8a37", // Couleur secondaire (vert)
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: ({ theme }) => ({
          height: "10vh",
          display: "flex",
          justifyContent: "center",
          width: "100%",
        }),
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: ({ theme }) => ({
          display: "flex",
          alignItems: "center",
          margin: 0,
          padding: 0,
        }),
      },
    },
    MuiIcon: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontSize: "10rem",
        }),
      },
    },
    MuiButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontSize: "1rem",
          padding: "0.75rem",
          margin: "0.75rem",
          [theme.breakpoints.up("xs")]: {
            fontSize: "0.75rem",
            padding: "0.5rem",
            margin: "0.5rem",
          },
          [theme.breakpoints.up("sm")]: {
            fontSize: "1rem",
            padding: "0.75rem",
            margin: "0.3rem",
          },
          [theme.breakpoints.up("md")]: {
            fontSize: "1.25rem",
            padding: "1rem",
            margin: "1rem",
          },
          [theme.breakpoints.up("lg")]: {
            fontSize: "1rem",
            padding: "1.25rem",
            margin: "1.25rem",
          },
          [theme.breakpoints.up("xl")]: {
            fontSize: "1rem",
            padding: "1.5rem",
            margin: "1.5rem",
          },
        }),
      },
    },
  },
});

export { headerTheme };
