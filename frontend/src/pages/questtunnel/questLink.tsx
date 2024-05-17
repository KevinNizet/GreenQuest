import Layout from "@/components/Layout";
import { Grid, Typography, Button, Paper } from "@mui/material";
import { useQuery } from "@apollo/client";
import { queryGetQuestById } from "@/graphql/queryGetQuestById";
import { useRouter } from "next/router";

export default function QuestLink(): React.ReactNode {
  const router = useRouter();
  const id = router.query.id as string;

  const { data, error } = useQuery(queryGetQuestById, {
    variables: { getQuestByIdId: id },
    skip: id === undefined,
  });

  if (error) {
    return <p>Erreur: {error.message}</p>;
  }

  if (!data) {
    return <div>Chargement...</div>;
  }

  const code = data.getQuestById.code;

  const nothing = () => {
    router.push("/dashboard");
  };

  return (
    <Layout title="Lien de la quête">
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        gap={5}
        marginTop={3}
      >
        <Typography variant="h1" sx={{ fontSize: "2rem", fontWeight: "bold" }}>
          Votre quête a été créée
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
            Pour inviter vos amis, partager le code ci-dessous
          </Typography>
          <Typography variant="h3" sx={{ fontSize: "1rem" }}>
            {code}
          </Typography>

          <Button
            variant="contained"
            onClick={nothing}
            sx={{ bgcolor: "#7BD389", color: "#000000" }}
          >
            Aller sur la quête
          </Button>
        </Grid>
      </Grid>
    </Layout>
  );
}
