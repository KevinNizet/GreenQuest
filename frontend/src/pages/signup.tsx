import React, { useState, FormEvent } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import {
  Button,
  CardMedia,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { signup } from "@/graphql/mutationSignup";
import { useMutation } from "@apollo/client";
import Image from "next/image";

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
        router.replace("/signin");
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
      <form
        onSubmit={onSubmit}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Grid container direction="column" spacing={2} sx={{ width: "70%" }}>
          <Grid item container justifyContent="center">
            <CardMedia
              component="img"
              sx={{ width: "25.7vw", marginBottom: "4rem" }}
              image="https://images.pexels.com/photos/259280/pexels-photo-259280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="Paella dish"
            />
          </Grid>
          <Grid item container justifyContent="center">
            <Typography
              variant="body1"
              gutterBottom
              sx={{ width: "70%", textAlign: "center", marginBottom: "3rem" }}
            >
              Inscrit toi ou connecte toi pour participer à une quête et valider
              tes missions quotidiennes !
            </Typography>
          </Grid>
          <Grid
            container
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              height: "60vh",
              justifyContent: "space-around",
              alignItems: "center",
              backgroundColor: "#ECEBF5",
              padding: "10px",
              borderRadius: "5px",
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
                sx={{ width: "70%" }}
                size="small"
                onChange={(e) => setFirstname(e.target.value)}
              />
            </Grid>{" "}
            <Grid item container justifyContent="center">
              <TextField
                className="textfield-outline-shadow"
                color="success"
                value={lastname}
                required
                id="lastname"
                label="Nom"
                variant="outlined"
                sx={{ width: "70%" }}
                size="small"
                onChange={(e) => setLastname(e.target.value)}
              />
            </Grid>{" "}
            <Grid item container justifyContent="center">
              <TextField
                className="textfield-outline-shadow"
                color="success"
                value={nickname}
                id="Nickname"
                label="Pseudo"
                variant="outlined"
                sx={{ width: "70%" }}
                size="small"
                onChange={(e) => setNickname(e.target.value)}
              />
            </Grid>{" "}
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
                sx={{ width: "70%" }}
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
                sx={{ width: "70%" }}
                size="small"
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError(false);
                }}
              />
            </Grid>{" "}
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
                sx={{ width: "70%" }}
                size="small"
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setErrorConfirmPassword(false);
                }}
              />
            </Grid>
            <Grid item container justifyContent="center">
              <Button variant="contained" type="submit" color="success">
                Inscription
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Layout>
  );
};

export default Signup;
