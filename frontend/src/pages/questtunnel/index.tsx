import Layout from "@/components/Layout";
import { Grid, Typography, TextField, Button, Paper } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import { useQuestContext } from "@/contexts/QuestContext";
import { useQuery } from "@apollo/client";
import { queryMySelf } from "@/graphql/queryMySelf";
import {
  QuestTunnelTheme,
  QuestTunnelGridTextField,
} from "@/themes/questTunnelTheme";
import { ThemeProvider } from "@mui/material/styles";

export default function QuestTunnel() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { setQuestInfo } = useQuestContext();
  const { data } = useQuery(queryMySelf);

  const MIN_TITLE_LENGTH = 5;

  const nextPage = () => {
    // Vérification du titre
    if (title.trim().length < MIN_TITLE_LENGTH) {
      return;
    }
    setQuestInfo({
      title: title,
      description: description,
      users: data?.item?.id,
    });

    router.push("/questtunnel/startDateAndDuration");
  };

  return (
    <ThemeProvider theme={QuestTunnelTheme}>
      <Layout title="Création de quête">
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          gap={5}
          marginTop={3}
        >
          <Typography variant="h1">Crée ta quête 🚀</Typography>
          <Typography variant="body1">
            Suis les différentes étapes pour créer ta propre quête !
          </Typography>

          <QuestTunnelGridTextField>
            <Typography variant="h2">Étape 1 📜</Typography>
            <TextField
              label="Titre de la quête"
              variant="outlined"
              fullWidth
              margin="normal"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              helperText={
                title.length > 0 && title.length < MIN_TITLE_LENGTH
                  ? `Minimum ${MIN_TITLE_LENGTH} caractères requis`
                  : ""
              }
              error={title.length > 0 && title.length < MIN_TITLE_LENGTH}
            />
            <TextField
              label="Description de la quête (facultative)"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              margin="normal"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={nextPage}
              disabled={title.trim().length < MIN_TITLE_LENGTH}
            >
              Suivant
            </Button>
          </QuestTunnelGridTextField>
        </Grid>
      </Layout>
    </ThemeProvider>
  );
}
