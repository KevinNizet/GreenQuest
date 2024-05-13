import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { queryMySelf } from "@/graphql/queryMySelf";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import BasicModal from "./modals/headerModal";

type userType = {
  id: number;
  email: string;
  nickname: string;
};

const Header = () => {
  const router = useRouter();
  const [auth, setAuth] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { loading, data } = useQuery<{ item: userType }>(queryMySelf);

  const me = data?.item;

  useEffect(() => {
    if (me) {
      setAuth(true);
    } else {
      setAuth(false);
    }
  }, [me]);

  useEffect(() => {
    if (auth) {
      console.log("Utilisateur connecté !");
    } else {
      console.log("Utilisateur déconnecté !");
    }
  }, [auth]);

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

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setModalOpen(true);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSwitchPosition = (open: boolean) => {
    setAuth(open);
  };

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
                <img
                  srcSet={`/images/greenquest_logo.png`}
                  src={`/images/greenquest_logo.png`}
                  alt="Greenquest_logo"
                  loading="lazy"
                  style={{ width: "6rem", margin: 0, padding: 0 }}
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
                  <AccountCircle sx={{ fontSize: "4rem" }} />
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
                  <MenuItem onClick={handleClose}>Profile</MenuItem>
                  <MenuItem onClick={handleClose}>
                    <a
                      href={`/questtunnel`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      Ajouter une quête
                    </a>
                  </MenuItem>
                  <MenuItem onClick={handleClose}>My account</MenuItem>
                </Menu>
              </div>
              <Typography
                variant="h6"
                component="div"
                sx={{ flexGrow: 1, margin: 1, fontSize: "1.5rem" }}
              >
                {me.nickname}
              </Typography>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      sx={{
                        "& .MuiSwitch-sizeMedium": {
                          width: "10rem",
                        },
                      }}
                      checked={modalOpen}
                      onChange={handleChange}
                      aria-label="login switch"
                    />
                  }
                  label={auth ? "Logout" : "Login"}
                />
              </FormGroup>
              <BasicModal
                modalOpen={modalOpen}
                handleClose={handleCloseModal}
                auth={auth}
                setAuth={setAuth}
                handleSwitchPosition={handleSwitchPosition}
              />
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
