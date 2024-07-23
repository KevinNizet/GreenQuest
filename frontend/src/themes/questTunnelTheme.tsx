import { Height } from "@mui/icons-material";
import { createTheme, styled } from "@mui/material/styles";

const QuestTunnelTheme = createTheme({
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
          fontSize: "1.8vh",
          width: "60%",
          textAlign: "center",
          marginTop: "1vh",
          marginBottom: "1vh",
          [theme.breakpoints.up("sm")]: {
            fontSize: "1rem",
            width: "60%",
          },
          [theme.breakpoints.up("md")]: {
            fontSize: "1rem",
          },
          [theme.breakpoints.up("lg")]: {
            fontSize: "1rem",
            width: "40%",
          },
          [theme.breakpoints.up("xl")]: {
            fontSize: "2vh",
            width: "30%",
          },
        }),
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: ({ theme }) => ({
          width: "80%",
          fontSize: "2vh",
          margin: "0.5rem",
          [theme.breakpoints.up("md")]: {
            fontSize: "1rem",
          },
          [theme.breakpoints.up("lg")]: {
            fontSize: "1rem",
            width: "75%",
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
            fontSize: "1vh",
            padding: "1vh",
          },
          [theme.breakpoints.up("md")]: {
            fontSize: "80%",
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

const QuestTunnelGridTextField = styled("div")(({ theme }) => ({
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

export {
  QuestTunnelTheme,
  QuestTunnelGridTextField,
};
