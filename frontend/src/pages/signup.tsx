import React, { useState, FormEvent } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { Button, Grid, IconButton, TextField, Typography } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { signup } from "@/graphql/mutationSignup";
import { useMutation } from "@apollo/client";
import Image from "next/image";
import Snackbar from "@mui/material/Snackbar";

const Signup = () => {
  // Form states
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [errorConfirmPassword, setErrorConfirmPassword] = useState(false);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  const [toastOpen, setToastOpen] = React.useState({
    open: false,
    vertical: "top",
    horizontal: "right",
  });
  const { vertical, horizontal, open } = toastOpen;

  const [toastMessage, setToastMessage] = React.useState("");

  const [doSignup] = useMutation(signup);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { data } = await doSignup({
        variables: {
          data: {
            firstname,
            lastname,
            nickname,
            email,
            password,
          },
        },
      });
      if (data.item) {
        setToastMessage(
          "Inscription réussie ! Vérifie ton adresse mail pour valider ton compte 👍🏻"
        );
        setToastOpen({ ...toastOpen, open: true });
        setTimeout(() => {
          router.replace("/signin");
        }, 5000);
      }
    } catch (error: any) {
      if (error.message.includes("Existing user")) {
        setEmailError(true);
      }

      if (error.message.includes("Password length")) {
        setPasswordError(true);
      }
      if (password !== confirmPassword) {
        setErrorConfirmPassword(true);
      }
    }
  };

  return (
    <Layout title="signup">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <form
          onSubmit={onSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minWidth: "50%",
            maxWidth: "80%",
          }}
        >
          <Grid container direction="column" spacing={2} alignItems="center">
            <Grid item container justifyContent="center">
              <Image
                src="https://images.pexels.com/photos/259280/pexels-photo-259280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                width={1000}
                height={400}
                fill={false}
                alt="Picture of the author"
                style={{
                  margin: "30px",
                  borderRadius: "5px",
                  maxWidth: "60%",
                  maxHeight: "50vh",
                  minWidth: "200px",
                  minHeight: "100px",
                }}
              />
            </Grid>
            <Grid item container justifyContent="center">
              <Typography variant="body1" gutterBottom>
                Inscrit toi ou connecte toi pour participer à une quête et
                valider tes missions quotidiennes !
              </Typography>
              <br />
              <br />
            </Grid>
            <Grid
              item
              container
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
                alignItems: "center",
                backgroundColor: "#ECEBF5",
                minWidth: "40%",
                maxWidth: "60%",
                borderRadius: "5px",
                padding: "20px",
              }}
            >
              <Grid item container justifyContent="center">
                <TextField
                  className="textfield-outline-shadow"
                  color="success"
                  value={firstname}
                  required
                  id="fisrtname"
                  label="Prénom"
                  variant="outlined"
                  sx={{ width: "70%", paddingBottom: "20px" }}
                  size="small"
                  onChange={(e) => setFirstname(e.target.value)}
                />
              </Grid>
              <Grid item container justifyContent="center">
                <TextField
                  className="textfield-outline-shadow"
                  color="success"
                  value={lastname}
                  required
                  id="lastname"
                  label="Nom"
                  variant="outlined"
                  sx={{ width: "70%", paddingBottom: "20px" }}
                  size="small"
                  onChange={(e) => setLastname(e.target.value)}
                />
              </Grid>
              <Grid item container justifyContent="center">
                <TextField
                  className="textfield-outline-shadow"
                  color="success"
                  value={nickname}
                  id="Nickname"
                  label="Pseudo"
                  variant="outlined"
                  sx={{ width: "70%", paddingBottom: "20px" }}
                  size="small"
                  onChange={(e) => setNickname(e.target.value)}
                />
              </Grid>
              <Grid item container justifyContent="center">
                <TextField
                  className="textfield-outline-shadow"
                  color="success"
                  error={emailError}
                  value={email}
                  required
                  id="email"
                  label="Email"
                  variant="outlined"
                  helperText={emailError === true ? "Email déjà utilisé!" : ""}
                  sx={{ width: "70%", paddingBottom: "20px" }}
                  size="small"
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError(false);
                  }}
                />
              </Grid>
              <Grid item container justifyContent="center">
                <TextField
                  className="textfield-outline-shadow"
                  color="success"
                  error={passwordError}
                  value={password}
                  required
                  id="password"
                  label="Mot de passe"
                  variant="outlined"
                  helperText={
                    passwordError === true
                      ? "Le mot de passe doit faire au moins 8 caractères"
                      : ""
                  }
                  type={showPassword ? "text" : "password"}
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    ),
                  }}
                  sx={{ width: "70%", paddingBottom: "20px" }}
                  size="small"
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError(false);
                  }}
                />
              </Grid>
              <Grid item container justifyContent="center">
                <TextField
                  className="textfield-outline-shadow"
                  color="success"
                  error={errorConfirmPassword}
                  value={confirmPassword}
                  required
                  id="confirmPassword"
                  label="Confirmer le mot de passe"
                  variant="outlined"
                  helperText={
                    errorConfirmPassword
                      ? "Les deux mots de passes doivent être similaires"
                      : ""
                  }
                  type={showPassword ? "text" : "password"}
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    ),
                  }}
                  sx={{ width: "70%", paddingBottom: "20px" }}
                  size="small"
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setErrorConfirmPassword(false);
                  }}
                />
              </Grid>
              <Grid item container justifyContent="center">
                <Button
                  variant="contained"
                  type="submit"
                  color="success"
                  sx={{ margin: "30px" }}
                >
                  Inscription
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </div>
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={() => setToastOpen({ ...toastOpen, open: false })}
        message={toastMessage}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        key={vertical + horizontal}
      />
    </Layout>
  );
};

export default Signup;
