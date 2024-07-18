import { Button, Typography, Box } from "@mui/material";
import Image from "next/image";
import router from "next/router";

export default function Home() {
  return (
    <Box
      sx={{
        backgroundImage: `url('images/greenquest_background-accueil.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        height: "1280px",
        margin: "2rem auto",
        width: "720px",
        borderRadius: "2.5rem",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "85%",
          height: "85%",
          backgroundColor: "rgba(240, 240, 240, 0.7)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "5rem",
          borderRadius: "2.5rem",
          padding: "1rem",
        }}
      >
        <Image
          src="/images/greenquest_logo.png"
          alt="Logo de l'application"
          width={200}
          height={200}
        />
        <Typography variant="body1" sx={{ textAlign: "center" }}>
          GreenQuest est une plateforme te permettant de lancer des challenges
          écologiques entre ami.e.s
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ m: 1 }}
          onClick={() => router.push("/signin")}
        >
          Connexion
        </Button>
        <Button
          variant="contained"
          color="primary"
          sx={{ m: 1 }}
          onClick={() => router.push("/signup")}
        >
          Inscription
        </Button>
        <Button variant="contained" color="primary" sx={{ m: 1 }}>
          Découvrir la plateforme
        </Button>
      </Box>
    </Box>
  );
}
