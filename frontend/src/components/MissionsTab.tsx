import React, { useState, useEffect } from "react";
import {
  Box,
  Checkbox,
  Fade,
  Typography,
  Pagination,
  Snackbar,
} from "@mui/material";
import { useQuery, useMutation } from "@apollo/client";
import { queryMySelf } from "@/graphql/queryMySelf";
import { QuestType } from "./QuestsTab";
import { queryGetQuestByUser } from "@/graphql/queryGetQuestByUser";
import Lottie from "react-lottie";
import wizard from "@/images/lottie/wizard.json";
import { mutationValidateMission } from "@/graphql/mutationValidateMission";
import { userType } from "./Header";
import { queryGetUserMission } from "@/graphql/queryGetUserMission";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

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

const styles = {
  container: {
    width: "90%",
    height: "90%",
    backgroundColor: "#d4d4d4",
    borderRadius: "10px",
    boxShadow: 2,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 2,
  },
  content: {
    width: "100%",
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  missionList: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
  },
  missionBox: (isCompleted: boolean, isAnimating: boolean) => ({
    backgroundColor: "#66bb6a",
    opacity: isCompleted ? 0.5 : 1,
    width: "90%",
    display: "flex",
    padding: "1.5rem",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    margin: "1rem 0 0 0",
    animation: isAnimating ? "blinkAnimation 1s ease-in-out" : "none",
    "@keyframes blinkAnimation": {
      "0%": { backgroundColor: "#a5d6a7" },
      "50%": { backgroundColor: "#DBAD42" },
      "100%": { backgroundColor: "#a5d6a7" },
    },
  }),
  missionTitle: {
    width: "80%",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    fontSize: "20px",
    color: "#424242",
  },
  noMissionText: {
    fontSize: "1.3rem",
    paddingY: "1rem",
    paddingX: "1rem",
    textAlign: "center",
  },
};

const MissionsTab = (props: MissionTabProps) => {
  const [page, setPage] = useState(1);
  const [completedMissions, setCompletedMissions] = useState<number[]>([]);
  const [animationMission, setAnimationMission] = useState<number | null>(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const { loading: meLoading, data: medata } = useQuery<{ item: userType }>(
    queryMySelf
  );
  const me = medata && medata.item;

  const { data: questData } = useQuery<{ item: QuestType[] }>(
    queryGetQuestByUser,
    {
      variables: { userId: me?.id },
    }
  );

  const quests = questData && questData.item;

  const { data: userMissionData } = useQuery(queryGetUserMission, {
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
    if (completedMissions.includes(missionId)) {
      setToastMessage(
        "Tu dois attendre 24 heures avant de pouvoir valider cette mission à nouveau 😊."
      );
      setToastOpen(true);
      return;
    }

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
        setAnimationMission(missionId);
        setTimeout(() => setAnimationMission(null), 1000);
      } catch (error) {
        console.error("Erreur lors de la validation de la mission:", error);
      }
    }
  };

  const isMissionCompleted = (missionId: number) => {
    return completedMissions.includes(missionId);
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: wizard,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <Fade in={props.value === 0} timeout={450}>
      <Box sx={styles.container}>
        <Box sx={styles.content}>
          <Box sx={styles.missionList}>
            {displayedMissions.length > 0 ? (
              displayedMissions.map((mission, index) => {
                const completed = isMissionCompleted(mission.id);
                const isAnimating = animationMission === mission.id;

                return (
                  <Box
                    key={`mission-${mission.id}-${index}`}
                    sx={styles.missionBox(completed, isAnimating)}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography sx={styles.missionTitle}>
                        {mission.title}
                      </Typography>
                      <Checkbox
                        icon={
                          <CheckCircleIcon
                            sx={{ fontSize: 40, color: "white" }}
                          />
                        }
                        checkedIcon={
                          <CheckCircleIcon
                            sx={{ fontSize: 40, color: "green" }}
                          />
                        }
                        checked={completed}
                        onChange={(e) =>
                          handleCheckboxChange(
                            mission.id,
                            mission.questIds,
                            e.target.checked
                          )
                        }
                        sx={{ cursor: "pointer" }}
                      />
                    </Box>
                  </Box>
                );
              })
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography sx={styles.noMissionText}>
                  Oh non 😢 ! Tu n&apos;as pas encore de missions.
                </Typography>
                <Typography sx={styles.noMissionText}>
                  Crées ou rejoins une quête 🧳 pour débloquer de nouvelles
                  missions 🗝️!
                </Typography>
                <Box sx={{ paddingTop: "3rem", paddingLeft: "1rem" }}>
                  <Lottie options={defaultOptions} height={400} width={400} />
                </Box>
              </Box>
            )}
          </Box>
          {totalPages > 1 && (
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              sx={{ margin: "1rem 0" }}
              size="large"
              color="primary"
              shape="rounded"
            />
          )}
        </Box>
        <Snackbar
          open={toastOpen}
          autoHideDuration={5000}
          onClose={() => setToastOpen(false)}
          message={toastMessage}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        />
      </Box>
    </Fade>
  );
};

export default MissionsTab;
