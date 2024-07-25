import { Padding } from "@mui/icons-material";
import { createTheme, styled } from "@mui/material/styles";

const homeTheme = createTheme({
  palette: {
    primary: {
      main: "#DBAD42", // Couleur principale (jaune)
    },
    secondary: {
      main: "#1d8a37", // Couleur secondaire (vert)
    },
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: "#393E41",
          fontWeight: "bold",
          fontSize: "1rem",
          textAlign: "center",
          [theme.breakpoints.up("sm")]: {
            fontSize: "1.5rem",
            width: "75%",
          },
          [theme.breakpoints.up("md")]: {
            fontSize: "1.3rem",
            width: "75%",
          },
          [theme.breakpoints.up("xl")]: {
            fontSize: "1.2rem",
          },
          [theme.breakpoints.up("xl")]: {
            fontSize: "2vh",
          },
        }),
      },
    },

    MuiButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          margin: "1",
          boxShadow: "2",
          borderRadius: "8px",
          [theme.breakpoints.up("xs")]: {
            fontSize: "1.5vh",
            padding: "1vh",
          },
          [theme.breakpoints.up("sm")]: {
            fontSize: "1.7vh",
            padding: "1vh",
          },
          [theme.breakpoints.up("md")]: {
            fontSize: "1.8vh",
            padding: "1vh",
            borderRadius: "8px",
          },
          [theme.breakpoints.up("xl")]: {
            fontSize: "1.5vh",
            padding: "0.5rem",
          },
        }),
      },
    },
  },
});

const HomeSecondContainer = styled("div")(({ theme }) => ({
  position: "absolute",
  width: "80%",
  height: "80%",
  backgroundColor: "rgba(240, 240, 240, 0.7)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-around",
  alignItems: "center",
  borderRadius: "2.5rem",
  padding: "1rem",
  [theme.breakpoints.up("xs")]: {
    width: "80%",
  },
  [theme.breakpoints.up("sm")]: {
    width: "70%",
  },
  [theme.breakpoints.up("md")]: {
    width: "70%",
  },
  [theme.breakpoints.up("lg")]: {
    width: "60%",
  },
  [theme.breakpoints.up("xl")]: {
    width: "40%",
  },
}));

const HomeFirstContainer = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  height: "100vh",
  backgroundImage: `url('images/greenquest_background-accueil.jpg')`,
  backgroundPosition: "center",
  position: "relative",
}));

const HomeLogo = styled("img")(({ theme }) => ({
  width: "45%",
  filter: "drop-shadow(0 0 2px black)",
  [theme.breakpoints.up("md")]: {
    width: "28%",
  },
}));

export { homeTheme, HomeSecondContainer, HomeFirstContainer, HomeLogo };
