import Layout from "@/components/Layout";
import {
  Grid,
  Typography,
  Button,
  Select,
  MenuItem,
  InputLabel,
  ThemeProvider,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material";
import { Difficulty, useQuestContext } from "@/contexts/QuestContext";
import { useRouter } from "next/router";
import { useState } from "react";
import {
  QuestTunnelTheme,
  QuestTunnelGridTextField,
} from "@/themes/questTunnelTheme";

export default function DifficultyLevel() {
  const router = useRouter();
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.EASY);
  const { setQuestInfo } = useQuestContext();

  const previousPage = () => {
    router.back();
  };

  const nextPage = () => {
    setQuestInfo((prevQuestInfo) => ({
      ...prevQuestInfo,
      difficulty: difficulty,
    }));

    router.push("/questtunnel/missions");
  };

  const difficultyChoice = (event: SelectChangeEvent<Difficulty>) => {
    setDifficulty(event.target.value as Difficulty);
  };

  return (
    <ThemeProvider theme={QuestTunnelTheme}>
      <Layout title="Niveau de difficulté">
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          gap={5}
          marginTop={3}
        >
          <Typography variant="h1">Crée ta quête 🚀</Typography>

          <QuestTunnelGridTextField>
            <Typography variant="h2">Étape 3 🔥</Typography>
            <InputLabel id="select-label">
              Choisis le niveau de difficulté
            </InputLabel>
            <Select
              value={difficulty}
              onChange={difficultyChoice}
              fullWidth
              variant="outlined"
              sx={{
                "&.Mui-focused fieldset": {
                  borderColor: "#7BD389 !important",
                },
              }}
            >
              <MenuItem value={"EASY"}>Débutant 🌱</MenuItem>
              <MenuItem value={"MEDIUM"}>Confirmé 🏆</MenuItem>
              <MenuItem value={"HARD"}>Expert 💎</MenuItem>
            </Select>
            <Grid
              container
              justifyContent="space-between"
              alignItems="center"
              width="100%"
            >
              <Button
                variant="contained"
                onClick={previousPage}
                color="secondary"
              >
                Retour
              </Button>
              <Button variant="contained" onClick={nextPage} color="secondary">
                Suivant
              </Button>
            </Grid>
          </QuestTunnelGridTextField>
        </Grid>
      </Layout>
    </ThemeProvider>
  );
}
