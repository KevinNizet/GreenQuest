import { ThemeProvider, createTheme, styled } from "@mui/material/styles";

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
          height: "75px",
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
          justifyItems: "center",
          margin: "0",
          padding: "0",
        }),
      },
    },

    MuiTypography: {
      styleOverrides: {
        root: ({ theme }) => ({
          flexGrow: 1,
          margin: 1,
          paddingLeft: "0.5rem",
          fontSize: "1.3rem",
        }),
      },
    },
    MuiButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          margin: "0 5% 0 0",
          [theme.breakpoints.up("xs")]: {
            fontSize: "0.55rem",
            padding: "0.5rem",
          },
          [theme.breakpoints.up("sm")]: {
            fontSize: "0.75rem",
            padding: "0.75rem",
            margin: "0 1% 0 0",
          },
          [theme.breakpoints.up("md")]: {
            fontSize: "0.7rem",
            padding: "0.5rem",
          },
          [theme.breakpoints.up("xl")]: {
            fontSize: "0.7rem",
            padding: "0.5rem",
          },
        }),
      },
    },
  },
});

const HeaderLogo = styled("img")(({ theme }) => ({
  width: "6rem",
  filter: "drop-shadow(0 0 1px black)",
  [theme.breakpoints.up("xs")]: {
    width: "4rem",
  },
  [theme.breakpoints.up("sm")]: {
    width: "5rem",
  },
  [theme.breakpoints.up("md")]: {
    width: "4.5rem",
  },
  [theme.breakpoints.up("lg")]: {
    width: "4.8rem",
  },
  [theme.breakpoints.up("xl")]: {
    width: "5rem",
  },
}));

export { headerTheme, HeaderLogo };
