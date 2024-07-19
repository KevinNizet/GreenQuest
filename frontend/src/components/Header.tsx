import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { queryMySelf } from "@/graphql/queryMySelf";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Link from "next/link";
import HeaderModal from "./modals/HeaderModal";
import { userMissionType } from "./MissionsTab";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { ThemeProvider } from "@mui/material/styles";
import { headerTheme } from "@/themes/headerTheme";

export type userType = {
  id: number;
  email: string;
  nickname: string;
  userMissions: userMissionType[];
  image?: {
    uri: string;
  };
};

const Header = () => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const backUrl = process.env.NEXT_PUBLIC_BACK_URL;

  const { loading, data, error } = useQuery<{ item: userType }>(queryMySelf);

  const me = data && data?.item;

  useEffect(() => {
    if (data) {
      console.log("connecté");
    } else {
      console.log("non connecté");
    }
  }, [data]);

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleChange = () => {
    setModalOpen(true);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (loading)
    return (
      <div
        style={{
          textAlign: "center",
          height: "75px",
        }}
      >
        Loading...
      </div>
    );

  return (
    <ThemeProvider theme={headerTheme}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            {!me && (
              <>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexGrow: 1,
                  }}
                >
                  <a href="/">
                    <img
                      srcSet={`/images/greenquest_logo.png`}
                      src={`/images/greenquest_logo.png`}
                      alt="Greenquest_logo"
                      loading="lazy"
                      style={{ width: "6rem", margin: 0, padding: 0 }}
                    />
                  </a>
                </Box>
                <Typography
                  variant="h4"
                  sx={{
                    flexGrow: 1,
                    textAlign: "center",
                    color: "#fff",
                  }}
                >
                  Greenquest
                </Typography>
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  {router.pathname === "/signin" ? (
                    <Button
                      color={"success"}
                      variant="contained"
                      href="/signup"
                    >
                      Inscription
                    </Button>
                  ) : (
                    <Button
                      color={"success"}
                      variant="contained"
                      href="/signin"
                    >
                      Connexion
                    </Button>
                  )}
                </Stack>
              </>
            )}
            {me && (
              <>
                <div>
                  <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    color="inherit"
                    onClick={handleMenu}
                  >
                    {me.image ? (
                      <img
                        src={`${backUrl}${me.image.uri}`}
                        alt="Profile"
                        style={{
                          width: "4rem",
                          height: "4rem",
                          borderRadius: "50%",
                        }}
                      />
                    ) : (
                      <AccountCircle
                        sx={{
                          fontSize: {
                            xs: "3.5rem", // taille de la police pour les écrans extra-petits
                            sm: "5rem", // taille de la police pour les petits écrans
                            md: "6rem", // taille de la police pour les écrans moyens
                            lg: "5rem", // taille de la police pour les grands écran
                          },
                        }}
                      />
                    )}
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "center",
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    sx={{ marginTop: "1.3rem" }}
                  >
                    <MenuItem onClick={handleClose}>
                      <Link
                        href="/userprofile"
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        Profile
                      </Link>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                      <Link
                        href="/questtunnel"
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        Ajouter une quête
                      </Link>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                      {" "}
                      <Link
                        href="/dashboard"
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        Tableau de bord
                      </Link>
                    </MenuItem>
                  </Menu>
                </div>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ flexGrow: 1, margin: 1, fontSize: "1.5rem" }}
                >
                  {me.nickname}
                </Typography>
                <Button
                  onClick={handleChange}
                  color={"success"}
                  variant="contained"
                  // sx={{
                  //   fontSize: {
                  //     xs: "0.75rem", // font size for extra-small screens
                  //     sm: "1rem", // font size for small screens
                  //     md: "1.25rem", // font size for medium screens
                  //     lg: "1.5rem", // font size for large screens
                  //     xl: "1rem", // font size for extra-large screens
                  //   },
                  //   padding: {
                  //     xs: "0.5rem", // padding for extra-small screens
                  //     sm: "0.75rem", // padding for small screens
                  //     md: "1rem", // padding for medium screens
                  //     lg: "1.25rem", // padding for large screens
                  //     xl: "1.5rem",
                  //   },
                  //   margin: {
                  //     xs: "0.5rem",
                  //     sm: "0.75rem",
                  //     md: "1rem",
                  //     lg: "1.25rem",
                  //     xl: "1.5rem",
                  //   },
                  // }}
                >
                  {me ? "Déconnexion" : "Se connecter"}
                </Button>
                <HeaderModal
                  modalOpen={modalOpen}
                  handleClose={handleCloseModal}
                  me={me}
                />
              </>
            )}
          </Toolbar>
        </AppBar>
      </Box>
    </ThemeProvider>
  );
};

export default Header;
