import Layout from "@/components/Layout";
import {
  Grid,
  Typography,
  Button,
  Paper,
  Card,
  CardContent,
  IconButton,
  Select,
  MenuItem,
  InputLabel,
  SelectChangeEvent,
  ThemeProvider,
} from "@mui/material";
import { useRouter } from "next/router";
import CloseIcon from "@mui/icons-material/Close";
import { queryAllMissions } from "@/graphql/queryAllMissions";
import { useQuery } from "@apollo/client";
import { useQuestContext } from "@/contexts/QuestContext";
import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { mutationCreateQuest } from "@/graphql/mutationCreateQuest";
import {
  QuestTunnelTheme,
  QuestTunnelGridTextField,
} from "@/themes/questTunnelTheme";

export type MissionType = {
  id: number;
  title: string;
  description?: string;
  XPValue: number;
  difficulty: string;
  byDefault: boolean;
};

export default function Missions() {
  const [missions, setMissions] = useState<MissionType[]>([]);
  const [selectedMissionTitle, setSelectedMissionTitle] = useState<string>("");
  const { questInfo, setQuestInfo } = useQuestContext();
  const { difficulty } = questInfo || {};
  const router = useRouter();

  // Récupérer les missions depuis le backend
  const { data: dataMissions } = useQuery<{ getMissions: MissionType[] }>(
    queryAllMissions,
    {
      variables: {
        sortBy: difficulty,
      },
    }
  );

  // Pour pouvoir ajuster sa sélection en supprimant ajoutant les missions
  const deleteMission = (id: number) => {
    setMissions((prevMissions) =>
      prevMissions.filter((mission) => mission.id !== id)
    );
  };

  const selectMission = (event: SelectChangeEvent<string>) => {
    setSelectedMissionTitle(event.target.value);
    const missionToAdd = dataMissions?.getMissions.find(
      (mission) => mission.title === event.target.value
    );
    if (
      missionToAdd &&
      !missions.some((mission) => mission.id === missionToAdd.id)
    ) {
      setMissions((prevMissions) => [...prevMissions, missionToAdd]);
    }
  };

  useEffect(() => {
    if (dataMissions) {
      setMissions(dataMissions.getMissions.slice(0, 3));
    }
  }, [dataMissions]);

  const previousPage = () => {
    router.back();
  };

  // Validation de la quête
  const [createQuest] = useMutation(mutationCreateQuest);

  const validateQuest = async () => {
    try {
      setQuestInfo((prevQuestInfo) => ({
        ...prevQuestInfo,
        missions: missions,
      }));

      const response = await createQuest({
        variables: {
          data: {
            ...questInfo,
            missions: missions.map((mission) => mission.id),
          },
        },
      });

      const newlyCreatedQuestId = response.data.createQuest.id;

      sessionStorage.clear();

      router.push(`/questtunnel/questLink?id=${newlyCreatedQuestId}`);
    } catch (err) {
      console.error("Error creating quest:", err);
    }
  };

  return (
    <ThemeProvider theme={QuestTunnelTheme}>
      <Layout title="Missions">
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          gap={5}
          marginTop={3}
        >
          <Typography
            variant="h1"
            sx={{ fontSize: "2rem", fontWeight: "bold" }}
          >
            Crée ta quête 🚀
          </Typography>

          <QuestTunnelGridTextField>
            <Typography variant="h2">Étape 4 🎯</Typography>
            <Typography variant="h3">Choisis tes missions</Typography>

            <Grid container direction="column" gap={2} sx={{ width: "100%" }}>
              {missions.map((mission) => (
                <Card
                  key={mission.id}
                  sx={{ position: "relative", backgroundColor: "#628395" }}
                >
                  <IconButton
                    sx={{ position: "absolute", top: 0, right: 0 }}
                    onClick={() => deleteMission(mission.id)}
                  >
                    <CloseIcon />
                  </IconButton>
                  <CardContent>
                    <Typography variant="h4" component="div">
                      {mission.title}
                    </Typography>
                    <Typography variant="body2">
                      {mission.description}
                    </Typography>
                    <Typography variant="body2">
                      Points: {mission.XPValue}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Grid>

            <InputLabel id="select-label">
              Sélectionner une autre mission ?
            </InputLabel>
            <Select
              fullWidth
              value={selectedMissionTitle}
              variant="outlined"
              onChange={selectMission}
              sx={{
                "&.Mui-focused fieldset": {
                  borderColor: QuestTunnelTheme.palette.primary.main,
                },
                marginBottom: 2, // Add some margin to space it from the other elements
              }}
            >
              {dataMissions?.getMissions.map((mission) => (
                <MenuItem key={mission.id} value={mission.title}>
                  {mission.title}
                </MenuItem>
              ))}
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
              <Button
                color="secondary"
                variant="contained"
                onClick={validateQuest}
                disabled={missions.length <= 0}
              >
                Valider
              </Button>
            </Grid>
          </QuestTunnelGridTextField>
        </Grid>
      </Layout>
    </ThemeProvider>
  );
}
