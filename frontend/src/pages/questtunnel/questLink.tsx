import Layout from "@/components/Layout";
import { Grid, Typography, Button, Paper, Box } from "@mui/material";
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

  useEffect(() => {
    setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
  }, []);

  if (error) {
    return <p>Erreur: {error.message}</p>;
  }

  if (!data) {
    return <div>Chargement...</div>;
  }

  const code = data.item.code;

  const shareUrl = "https://0923-rouge-3.wns.wilders.dev/";
  const shareMessage = `Rejoignez ma quête avec ce code: ${code}`;

  const navigateToDashboard = () => {
    router.replace("/dashboard");
  };

  return (
    <Layout title="Lien de la quête">
      {showConfetti && <Confetti />}
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        gap={5}
        marginTop={4}
      >
        <Typography variant="h1" sx={{ fontSize: "2rem", fontWeight: "bold" }}>
          Félicitations ta quête a été créée !
        </Typography>

        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          component={Paper}
          elevation={3}
          sx={{
            maxWidth: "90%",
            padding: 4,
            borderRadius: 5,
          }}
          gap={3}
        >
          <Typography variant="h2" sx={{ fontSize: "1.5rem" }}>
            Pour inviter tes amis, partage le code ci-dessous :
          </Typography>
          <Typography
            variant="h3"
            sx={{ fontSize: "1.5rem", fontWeight: "bold" }}
          >
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
            }}
          >
            <Lottie options={defaultOptions} height={400} width={600} />
          </Box>

          <Button
            variant="contained"
            onClick={navigateToDashboard}
            sx={{ bgcolor: "#7BD389", color: "#000000" }}
          >
            Aller sur la quête
          </Button>
        </Grid>
      </Grid>
    </Layout>
  );
}
