import { Box, Checkbox, Fade } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { queryMySelf } from "@/graphql/queryMySelf";
import { QuestType } from "./QuestsTab";
import { queryGetQuestByUser } from "@/graphql/queryGetQuestByUser";
import Pagination from "@mui/material/Pagination";
import { mutationValidateMission } from "@/graphql/mutationValidateMission";
import { userType } from "./Header";

type MissionTabProps = {
  value: number;
};

const MissionsTab = (props: MissionTabProps) => {
  const {
    loading: meLoading,
    data: medata,
    error: meErrors,
  } = useQuery<{ item: userType }>(queryMySelf);
  const me = medata && medata.item;

  const { data, loading, error } = useQuery<{ item: QuestType[] }>(
    queryGetQuestByUser,
    {
      variables: { userId: me?.id },
    }
  );

  const [validateMission] = useMutation(mutationValidateMission);

  const quests = data && data.item;

  const [page, setPage] = useState(1);
  const missionsPerPage = 4;

  // Récupération de toutes les missions
  const uniqueMissionsMap = new Map();

  quests?.forEach((quest) => {
    quest.missions.forEach((mission) => {
      if (!uniqueMissionsMap.has(mission.id)) {
        uniqueMissionsMap.set(mission.id, { ...mission, questId: quest.id });
      }
    });
  });

  const allMissions = Array.from(uniqueMissionsMap.values());

  // Calcul des missions à afficher pour la page courante
  const displayedMissions = allMissions.slice(
    (page - 1) * missionsPerPage,
    page * missionsPerPage
  );

  const totalPages = Math.ceil(allMissions.length / missionsPerPage);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  useEffect(() => {
    // Réinitialiser la page à 1 si la longueur des missions change
    setPage(1);
  }, [allMissions.length]);

  const handleCheckboxChange = async (missionId: number, checked: boolean) => {
    if (checked) {
      try {
        await validateMission({
          variables: {
            missionId,
            userId: me?.id,
          },
        });
        // Vous pouvez ajouter ici une logique pour mettre à jour l'interface utilisateur si nécessaire
        console.log(
          `Mission ${missionId} validée pour l'utilisateur ${me?.id}`
        );
      } catch (error) {
        console.error("Erreur lors de la validation de la mission:", error);
      }
    }
  };

  return (
    <Fade in={props.value === 0} timeout={450}>
      <Box
        sx={{
          width: "90%",
          height: "90%",
          backgroundColor: "#dac6b5",
          borderRadius: "30px",
          boxShadow: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 2,
        }}
      >
        <Box
          sx={{
            width: "100%",
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
            }}
          >
            {displayedMissions.map((mission, index) => (
              <Box
                key={`mission-${mission.id}-${index}`}
                sx={{
                  backgroundColor: "lightgrey",
                  width: "90%",
                  display: "flex",
                  padding: "1.5rem",
                  borderRadius: "10px",
                  boxShadow: 1,
                  margin: "1rem 0 0 0",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <p
                    style={{
                      width: "80%",
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                      fontSize: "20px",
                    }}
                  >
                    {mission.title}
                  </p>
                  <Checkbox
                    color="secondary"
                    sx={{
                      "& .MuiSvgIcon-root": { fontSize: 40 },
                    }}
                    onChange={(e) =>
                      handleCheckboxChange(mission.id, e.target.checked)
                    }
                  />
                </Box>
              </Box>
            ))}
          </Box>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            sx={{ margin: "1rem 0" }}
            size="large"
            color="primary"
            shape="rounded"
          />
        </Box>
      </Box>
    </Fade>
  );
};

export default MissionsTab;
