import { Box, Checkbox, Fade } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { queryMySelf } from "@/graphql/queryMySelf";
import { QuestType } from "./QuestsTab";
import { queryGetQuestByUser } from "@/graphql/queryGetQuestByUser";
import Pagination from "@mui/material/Pagination";
import { mutationValidateMission } from "@/graphql/mutationValidateMission";
import { userType } from "./Header";
import { queryGetUserMission } from "@/graphql/queryGetUserMission";

type MissionTabProps = {
  value: number;
};

export type userMissionType = {
  id: number;
  userId: number;
  mission: { id: number };
  nickName: string;
  isCompleted: boolean;
  points: number;
};

const MissionsTab = (props: MissionTabProps) => {
  const [page, setPage] = useState(1);
  const [completedMissions, setCompletedMissions] = useState<number[]>([]);

  const {
    loading: meLoading,
    data: medata,
    error: meErrors,
  } = useQuery<{ item: userType }>(queryMySelf);
  const me = medata && medata.item;

  const {
    data: questData,
    loading: questLoading,
    error: questError,
  } = useQuery<{ item: QuestType[] }>(queryGetQuestByUser, {
    variables: { userId: me?.id },
  });

  const quests = questData && questData.item;

  const {
    data: userMissionData,
    loading: userMissionLoading,
    error: userMissionError,
  } = useQuery(queryGetUserMission, {
    variables: { userId: me?.id },
  });

  const userMissions = userMissionData?.item || [];

  const [validateMission] = useMutation(mutationValidateMission);

  useEffect(() => {
    const completed = userMissions
      .filter((userMission: userMissionType) => userMission.isCompleted)
      .map((userMission: userMissionType) => userMission.mission.id);
    setCompletedMissions(completed);
  }, [userMissionData]);

  const uniqueMissionsMap = new Map();

  quests?.forEach((quest) => {
    quest.missions.forEach((mission) => {
      if (!uniqueMissionsMap.has(mission.id)) {
        uniqueMissionsMap.set(mission.id, {
          ...mission,
          questIds: quest.missions
            .filter((m) => m.id === mission.id)
            .map(() => quest.id),
        });
      } else {
        const existingMission = uniqueMissionsMap.get(mission.id);
        existingMission.questIds.push(quest.id);
      }
    });
  });

  const allMissions = Array.from(uniqueMissionsMap.values());

  const missionsPerPage = 4;
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
    setPage(1);
  }, [allMissions.length]);

  const handleCheckboxChange = async (
    missionId: number,
    questIds: number[],
    checked: boolean
  ) => {
    if (checked) {
      try {
        await Promise.all(
          questIds.map((questId) =>
            validateMission({
              variables: {
                missionId,
                userId: me?.id,
                questId,
              },
            })
          )
        );
        setCompletedMissions((prev) => [...prev, missionId]);
      } catch (error) {
        console.error("Erreur lors de la validation de la mission:", error);
      }
    }
  };

  const isMissionCompleted = (missionId: number) => {
    return completedMissions.includes(missionId);
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
            {displayedMissions.map((mission, index) => {
              const completed = isMissionCompleted(mission.id);

              return (
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
                      checked={completed}
                      disabled={completed}
                      sx={{
                        "& .MuiSvgIcon-root": { fontSize: 40 },
                        "&.Mui-disabled": {
                          color: "green",
                        },
                      }}
                      onChange={(e) =>
                        handleCheckboxChange(
                          mission.id,
                          mission.questIds,
                          e.target.checked
                        )
                      }
                    />
                  </Box>
                </Box>
              );
            })}
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
