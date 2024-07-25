import { createTheme, styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";

const QuestTunnelTheme = createTheme({
  palette: {
    primary: {
      main: "#DBAD42",
    },
    secondary: {
      main: "#1d8a37",
    },
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        h1: ({ theme }) => ({
          color: "#393E41",
          fontWeight: "bold",
          textAlign: "center",
          [theme.breakpoints.up("xs")]: {
            fontSize: "1.5rem",
          },
          [theme.breakpoints.up("sm")]: {
            fontSize: "1.8rem",
          },
          [theme.breakpoints.up("md")]: {
            fontSize: "2rem",
          },
          [theme.breakpoints.up("lg")]: {
            fontSize: "2.2rem",
          },
          [theme.breakpoints.up("xl")]: {
            fontSize: "2.5rem",
          },
        }),
        h2: ({ theme }) => ({
          color: "#393E41",
          fontWeight: "normal",
          textAlign: "center",
          [theme.breakpoints.up("xs")]: {
            fontSize: "1.2rem",
          },
          [theme.breakpoints.up("sm")]: {
            fontSize: "1.4rem",
          },
          [theme.breakpoints.up("md")]: {
            fontSize: "1.6rem",
          },
          [theme.breakpoints.up("lg")]: {
            fontSize: "1.8rem",
          },
          [theme.breakpoints.up("xl")]: {
            fontSize: "2rem",
          },
        }),
        h3: ({ theme }) => ({
          color: "#393E41",
          fontWeight: "normal",
          textAlign: "center",
          [theme.breakpoints.up("xs")]: {
            fontSize: "1rem",
          },
          [theme.breakpoints.up("sm")]: {
            fontSize: "1.2rem",
          },
          [theme.breakpoints.up("md")]: {
            fontSize: "1.4rem",
          },
          [theme.breakpoints.up("lg")]: {
            fontSize: "1.6rem",
          },
          [theme.breakpoints.up("xl")]: {
            fontSize: "1.8rem",
          },
        }),
        h4: ({ theme }) => ({
          color: "#393E41",
          fontWeight: "bold",
          textAlign: "left",
          marginBottom: theme.spacing(1),
          [theme.breakpoints.up("xs")]: {
            fontSize: "1rem",
          },
          [theme.breakpoints.up("sm")]: {
            fontSize: "1.2rem",
          },
          [theme.breakpoints.up("md")]: {
            fontSize: "1.4rem",
          },
          [theme.breakpoints.up("lg")]: {
            fontSize: "1.6rem",
          },
          [theme.breakpoints.up("xl")]: {
            fontSize: "1.8rem",
          },
        }),
        body1: ({ theme }) => ({
          color: "#393E41",
          fontWeight: "normal",
          textAlign: "center",
          [theme.breakpoints.up("xs")]: {
            fontSize: "1rem",
          },
          [theme.breakpoints.up("sm")]: {
            fontSize: "1.2rem",
          },
          [theme.breakpoints.up("md")]: {
            fontSize: "1.4rem",
          },
          [theme.breakpoints.up("lg")]: {
            fontSize: "1.6rem",
          },
          [theme.breakpoints.up("xl")]: {
            fontSize: "1.8rem",
          },
        }),
        body2: ({ theme }) => ({
          color: "#393E41",
          fontWeight: "normal",
          fontStyle: "italic",
          textAlign: "left",
          [theme.breakpoints.up("xs")]: {
            fontSize: "1rem",
          },
          [theme.breakpoints.up("sm")]: {
            fontSize: "1.2rem",
          },
          [theme.breakpoints.up("md")]: {
            fontSize: "1.4rem",
          },
          [theme.breakpoints.up("lg")]: {
            fontSize: "1.6rem",
          },
          [theme.breakpoints.up("xl")]: {
            fontSize: "1.8rem",
          },
        }),
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: ({ theme }) => ({
          width: "100%",
          margin: theme.spacing(1),
          [theme.breakpoints.up("xs")]: {
            fontSize: "0.9rem",
          },
          [theme.breakpoints.up("sm")]: {
            fontSize: "1rem",
          },
          [theme.breakpoints.up("md")]: {
            fontSize: "1.1rem",
          },
          [theme.breakpoints.up("lg")]: {
            fontSize: "1.2rem",
          },
          [theme.breakpoints.up("xl")]: {
            fontSize: "1.3rem",
          },
        }),
      },
    },
    MuiButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          margin: theme.spacing(1),
          borderRadius: theme.shape.borderRadius,
          boxShadow: theme.shadows[2],
          [theme.breakpoints.up("xs")]: {
            fontSize: "0.9rem",
            padding: theme.spacing(1),
          },
          [theme.breakpoints.up("sm")]: {
            fontSize: "1rem",
            padding: theme.spacing(1.5),
          },
          [theme.breakpoints.up("md")]: {
            fontSize: "1.1rem",
            padding: theme.spacing(2),
          },
          [theme.breakpoints.up("lg")]: {
            fontSize: "1.2rem",
            padding: theme.spacing(2.5),
          },
          [theme.breakpoints.up("xl")]: {
            fontSize: "1.3rem",
            padding: theme.spacing(3),
          },
        }),
      },
    },
  },
});

// TypeScript type declaration for styled component
const QuestTunnelGridTextField = styled(Paper)(({ theme }) => ({
  backgroundColor: "transparent",
  boxShadow: "none",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  gap: "2rem",
  alignItems: "center",
  padding: theme.spacing(2),
  [theme.breakpoints.up("xs")]: {
    width: "90%",
    padding: theme.spacing(2),
  },
  [theme.breakpoints.up("sm")]: {
    width: "80%",
    padding: theme.spacing(2.5),
  },
  [theme.breakpoints.up("md")]: {
    width: "70%",
    padding: theme.spacing(3),
  },
  [theme.breakpoints.up("lg")]: {
    width: "60%",
    padding: theme.spacing(4),
  },
  [theme.breakpoints.up("xl")]: {
    width: "50%",
    padding: theme.spacing(5),
  },
}));

export { QuestTunnelTheme, QuestTunnelGridTextField };
