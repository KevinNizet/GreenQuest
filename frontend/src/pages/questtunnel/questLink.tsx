import Layout from "@/components/Layout";
import {
  Grid,
  Typography,
  Button,
  Paper,
  Box,
  ThemeProvider,
  CircularProgress,
} from "@mui/material";
import { useQuery } from "@apollo/client";
import { queryGetQuestById } from "@/graphql/queryGetQuestById";
import { useRouter } from "next/router";
import {
  EmailShareButton,
  WhatsappShareButton,
  EmailIcon,
  WhatsappIcon,
  FacebookMessengerShareButton,
  FacebookMessengerIcon,
} from "react-share";
import Confetti from "react-confetti";
import { useEffect, useState } from "react";
import Lottie from "react-lottie";
import adventure from "@/images/lottie/adventure.json";
import {
  QuestTunnelTheme,
  QuestTunnelGridTextField,
} from "@/themes/questTunnelTheme";

export default function QuestLink() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: adventure,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const router = useRouter();
  const id = router.query.id as string;

  const { data, error } = useQuery(queryGetQuestById, {
    variables: { getQuestByIdId: id },
    skip: id === undefined,
  });

  const [showConfetti, setShowConfetti] = useState(true);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  useEffect(() => {
    setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
  }, []);

  if (error) {
    return <p>Erreur: {error.message}</p>;
  }

  if (!data) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const code = data.item.code;

  const shareUrl = "https://0923-rouge-3.wns.wilders.dev/";
  const shareMessage = `Rejoignez ma quête avec ce code: ${code}`;

  const navigateToDashboard = () => {
    router.replace("/dashboard");
  };

  return (
    <ThemeProvider theme={QuestTunnelTheme}>
      <Layout title="Lien de la quête">
        {showConfetti && (
          <Confetti width={windowSize.width} height={windowSize.height} />
        )}
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          gap={1}
          marginTop={4}
        >
          <Typography variant="h1">
            Félicitations ta quête est créée 🎊 !
          </Typography>
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            component={Paper}
            elevation={3}
            sx={{
              width: {
                xs: "80%",
                sm: "70%",
                md: "60%",
                lg: "50%",
                xl: "40%",
              },
              padding: 2,
              backgroundColor: "transparent",
              boxShadow: "none",
            }}
            gap={3}
          >
            <Typography variant="h2">
              Pour inviter tes amis, partage le code ci-dessous :
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: "bold" }}>
              {code}
            </Typography>

            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              gap={2}
            >
              <EmailShareButton
                url={shareUrl}
                subject="Rejoignez ma quête"
                body={shareMessage}
              >
                <EmailIcon size={32} round />
              </EmailShareButton>
              <WhatsappShareButton url={shareUrl} title={shareMessage}>
                <WhatsappIcon size={32} round />
              </WhatsappShareButton>
              <FacebookMessengerShareButton
                url={shareUrl}
                appId="YOUR_FACEBOOK_APP_ID"
              >
                <FacebookMessengerIcon size={32} round />
              </FacebookMessengerShareButton>
            </Grid>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                paddingTop: "3rem",
                width: "100%",
                height: {
                  xs: 200,
                  sm: 300,
                  md: 400,
                  lg: 500,
                  xl: 600,
                },
              }}
            >
              <Lottie options={defaultOptions} height="100%" width="100%" />
            </Box>

            <Button
              variant="contained"
              onClick={navigateToDashboard}
              sx={{ bgcolor: "primary.main", color: "#000000" }}
            >
              Aller sur la quête
            </Button>
          </Grid>
        </Grid>
      </Layout>
    </ThemeProvider>
  );
}
