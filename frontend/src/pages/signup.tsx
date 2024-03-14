import React, { useState, FormEvent } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { Button, Grid, IconButton, TextField, Typography } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { signup } from "@/graphql/signup";
import { useMutation } from "@apollo/client";

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

  // Password visibility
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  // Form submission with connection button
  const handleSignIn = () => {
    if (!validateEmail()) {
      setEmailError(true);
    } else {
      setEmailError(false);
    }

    if (!validatePassword() || password.length < 3) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }

    if (!validateConfirmPassword()) {
      setErrorConfirmPassword(true);
    } else {
      setErrorConfirmPassword(true);
    }
  };

  const validateEmail = () => {
    //TODO: ajouter la validation de l'email avec le back
    return true;
  };

  const validatePassword = () => {
    //TODO: ajouter la validation du mdp avec le back
    return true;
  };

  const validateConfirmPassword = () => {
    //TODO: ajouter la validation du mdp avec le back
    return true;
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorConfirmPassword(true);
    } else {
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
        console.log("data part", data.item);
        router.replace("/signin");
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
            <Typography
              variant="body1"
              gutterBottom
              sx={{ width: "70%", textAlign: "center" }}
            >
              Inscrit toi ou connecte toi pour participer à une quête et valider
              tes missions quotidiennes !
            </Typography>
            <br />
            <br />
          </Grid>
          <Grid
            container
            sx={{
              backgroundColor: "lightgray",
              display: "flex",
              flexDirection: "column",
              width: "100%",
              height: "60vh",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <Grid item container justifyContent="center">
              <TextField
                error={emailError}
                value={firstname}
                required
                id="fisrtname"
                label="Prénom"
                variant="outlined"
                helperText={emailError ? "Email incorrect" : ""}
                sx={{ width: "55%", fontWeight: "small" }}
                size="small"
                onChange={(e) => setFirstname(e.target.value)}
              />
            </Grid>{" "}
            <Grid item container justifyContent="center">
              <TextField
                error={emailError}
                value={lastname}
                required
                id="lastname"
                label="Nom"
                variant="outlined"
                helperText={emailError ? "Email incorrect" : ""}
                sx={{ width: "55%" }}
                size="small"
                onChange={(e) => setLastname(e.target.value)}
              />
            </Grid>{" "}
            <Grid item container justifyContent="center">
              <TextField
                error={emailError}
                value={nickname}
                id="Nickname"
                label="Pseudo"
                variant="outlined"
                helperText={emailError ? "Email incorrect" : ""}
                sx={{ width: "55%" }}
                size="small"
                onChange={(e) => setNickname(e.target.value)}
              />
            </Grid>{" "}
            <Grid item container justifyContent="center">
              <TextField
                error={emailError}
                value={email}
                required
                id="email"
                label="Email"
                variant="outlined"
                helperText={emailError ? "Email incorrect" : ""}
                sx={{ width: "55%" }}
                size="small"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item container justifyContent="center">
              <TextField
                error={passwordError}
                value={password}
                required
                id="password"
                label="Mot de passe"
                variant="outlined"
                helperText={
                  passwordError
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
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                }}
                sx={{ width: "55%" }}
                size="small"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>{" "}
            <Grid item container justifyContent="center">
              <TextField
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
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                }}
                sx={{ width: "55%" }}
                size="small"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Grid>
            <Grid item container justifyContent="center">
              <Button variant="contained" onClick={handleSignIn} type="submit">
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
