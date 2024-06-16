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
import AccountCircle from "@mui/icons-material/AccountCircle";
import Image from "next/image";

export type userType = {
  id: number;
  email: string;
  nickname: string;
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
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          height: "15vh",
          display: "flex",
          justifyContent: "center",
          borderTopLeftRadius: "2.5rem",
          borderTopRightRadius: "2.5rem",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            margin: 0,
            padding: 0,
            width: "100%",
          }}
        >
          {!me && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8rem",
                justifyContent: "center",
              }}
            >
              <a href="/">
                <Image
                  src={`/images/greenquest_logo.png`}
                  alt="Logo de l'application"
                  loading="lazy"
                  width={96}
                  height={96}
                  style={{
                    borderRadius: "50%",
                  }}
                />
              </a>
              <h1 style={{ margin: "0.5rem 0 0 0" }}> Greenquest</h1>
              <Stack
                direction="row"
                spacing={2}
                sx={{ display: "flex", alignItems: "center" }}
              >
                {router.pathname === "/signin" ? (
                  <Button color={"success"} variant="contained" href="/signup">
                    Inscription
                  </Button>
                ) : (
                  <Button color={"success"} variant="contained" href="/signin">
                    Connexion
                  </Button>
                )}
              </Stack>
            </div>
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
                    <AccountCircle sx={{ fontSize: "4rem" }} />
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
              >
                {me ? "Logout" : "Login"}
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
  );
};

export default Header;
