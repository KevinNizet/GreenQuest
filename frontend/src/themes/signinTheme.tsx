import { Height } from "@mui/icons-material";
import { createTheme, styled } from "@mui/material/styles";

const SigninFormTheme = createTheme({
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

const SigninDiv = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-around",
  alignItems: "center",
  backgroundColor: "#F4F4F8",
  padding: "20px",
  borderRadius: "5px",
  width: "70%",

  [theme.breakpoints.up("sm")]: {
    width: "50%",
  },
  [theme.breakpoints.up("lg")]: {
    width: "35%",
  },
  [theme.breakpoints.up("xl")]: {
    width: "20%",
  },
}));

const SigninForm = styled("form")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
  width: "100%",
}));

const SigninFormImg = styled("img")(({ theme }) => ({
  width: "100%",
  height: "24vh",
  boxShadow: "17px 42px 31px -41px rgba(0, 0, 0, 0.19)",
  objectFit: "cover",
  [theme.breakpoints.up("sm")]: {
    height: "25vh",
  },
  [theme.breakpoints.up("md")]: {
    height: "38vh",
    borderBottomRightRadius: "8px",
    borderBottomLeftRadius: "8px",
  },
  [theme.breakpoints.up("lg")]: {
    // width: "40%",
  },
  [theme.breakpoints.up("xl")]: {
    height: "30vh",
    borderRadius: "8px",
  },
}));

export { SigninFormTheme, SigninDiv, SigninFormImg, SigninForm };
