import React, { useState, useEffect } from "react";
import { Box, Fade, Typography, Pagination } from "@mui/material";
import { useQuery, useMutation } from "@apollo/client";
import { queryMySelf } from "@/graphql/queryMySelf";
import { QuestType } from "./QuestsTab";
import { queryGetQuestByUser } from "@/graphql/queryGetQuestByUser";
import Lottie from "react-lottie";
import wizard from "@/images/lottie/wizard.json";
import { mutationValidateMission } from "@/graphql/mutationValidateMission";
import { userType } from "./Header";
import { queryGetUserMission } from "@/graphql/queryGetUserMission";
import stylesCustomCheckbox from "../styles/CustomCheckbox.module.css";
import { motion } from "framer-motion";

type MissionTabProps = {
  value: number;
};

export type userMissionType = {
  id: number;
  userId: number;
  mission: { id: number; XPValue: number };
  nickName: string;
  isCompleted: boolean;
  points: number;
};

const styles = {
  container: {
    width: "90%",
    height: "90%",
    backgroundColor: "#ECEBF5",
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
    backgroundColor: "#628395",
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
      "50%": { backgroundColor: "#66bb6a" },
      "100%": { backgroundColor: "#a5d6a7" },
    },
  }),
  missionTitle: {
    width: "80%",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    fontSize: "20px",
    color: "white",
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
  const [sortedMissions, setSortedMissions] = useState<any[]>([]);
  const [pointsToShow, setPointsToShow] = useState<number | null>(null);

  // Récupère les données de l'utilisateur actuel (meData), incluant ses informations personnelles.
  const { loading: meLoading, data: meData } = useQuery<{ item: userType }>(
    queryMySelf
  );
  const me = meData && meData.item;

  // Récupère les quêtes associées à l'utilisateur (questData).
  const { data: questData } = useQuery<{ item: QuestType[] }>(
    queryGetQuestByUser,
    {
      variables: { userId: me?.id },
      fetchPolicy: "network-only",
    }
  );

  const quests = questData && questData.item;

  // Récupère les missions de l'utilisateur (userMissionData).
  const { data: userMissionData } = useQuery(queryGetUserMission, {
    variables: { userId: me?.id },
    fetchPolicy: "network-only",
  });

  const userMissions = userMissionData?.item || [];

  // Prépare une mutation pour valider une mission (validateMission).
  const [validateMission] = useMutation(mutationValidateMission);

  // Met à jour la liste des missions complètes en fonction des missions de l'utilisateur (completedMissions).
  useEffect(() => {
    const completed = userMissions
      .filter((userMission: userMissionType) => userMission.isCompleted)
      .map((userMission: userMissionType) => userMission.mission.id);
    setCompletedMissions(completed);
  }, [userMissionData]);

  // Crée une liste triée de toutes les missions en fonction de leur statut de complétion et les quêtes auxquelles elles appartiennent (sortedMissions).
  useEffect(() => {
    if (!quests) return;

    const uniqueMissionsMap = new Map();

    quests.forEach((quest) => {
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

    const sorted = allMissions.sort((a, b) => {
      const isCompletedA = completedMissions.includes(a.id);
      const isCompletedB = completedMissions.includes(b.id);

      return isCompletedA === isCompletedB ? 0 : isCompletedA ? 1 : -1;
    });

    setSortedMissions(sorted);
  }, [quests, completedMissions]);

  // Définit les missions à afficher sur la page actuelle en fonction de la pagination.
  const missionsPerPage = 4;
  const displayedMissions = sortedMissions.slice(
    (page - 1) * missionsPerPage,
    page * missionsPerPage
  );

  const totalPages = Math.ceil(sortedMissions.length / missionsPerPage);

  // Gère le changement de page pour la pagination des missions.
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  // Réinitialise la page à 1 lorsque le nombre total de missions triées change.
  useEffect(() => {
    setPage(1);
  }, [sortedMissions.length]);

  // Retourne la valeur d'expérience d'une mission donnée par son ID.
  const getXPValueByMissionId = (missionId: number) => {
    const mission = userMissions.find(
      (userMission: { mission: { id: number } }) =>
        userMission.mission.id === missionId
    );
    return mission ? mission.mission.XPValue : null;
  };

  // Gère la validation d'une mission lorsqu'une case est cochée.
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

        const xpValue = getXPValueByMissionId(missionId);

        if (xpValue !== null) {
          setCompletedMissions((prev) => [...prev, missionId]);
          setAnimationMission(missionId);
          setPointsToShow(xpValue);
          setTimeout(() => setAnimationMission(null), 1000);
          setTimeout(() => setPointsToShow(null), 2000);
        }
      } catch (error) {
        console.error("Erreur lors de la validation de la mission:", error);
      }
    } else {
      setCompletedMissions((prev) => {
        const updated = prev.filter((id) => id !== missionId);
        return updated;
      });
    }
  };

  // Vérifie si une mission est marquée comme complétée.
  const isMissionCompleted = (missionId: number) => {
    return completedMissions.includes(missionId);
  };

  // Définit les options de configuration pour une animation Lottie (wizard).
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
                        alignItems: "center",
                      }}
                    >
                      <Typography sx={styles.missionTitle}>
                        {mission.title}
                      </Typography>
                      <div className={stylesCustomCheckbox.checkboxWrapper12}>
                        <div className={stylesCustomCheckbox.cbx}>
                          <input
                            type="checkbox"
                            id={`cbx-${mission.id}`}
                            checked={completed}
                            onChange={(e) =>
                              handleCheckboxChange(
                                mission.id,
                                mission.questIds,
                                e.target.checked
                              )
                            }
                            disabled={completed}
                          />
                          <label htmlFor={`cbx-${mission.id}`} />
                          <svg
                            width="15"
                            height="14"
                            viewBox="0 0 15 14"
                            fill="none"
                          >
                            <path d="M2 8.36364L6.23077 12L13 2"></path>
                          </svg>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                          <defs>
                            <filter id={`goo-${mission.id}`}>
                              <feGaussianBlur
                                in="SourceGraphic"
                                stdDeviation="4"
                                result="blur"
                              ></feGaussianBlur>
                              <feColorMatrix
                                in="blur"
                                mode="matrix"
                                values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 22 -7"
                                result={`goo-${mission.id}`}
                              ></feColorMatrix>
                              <feBlend
                                in="SourceGraphic"
                                in2={`goo-${mission.id}`}
                              ></feBlend>
                            </filter>
                          </defs>
                        </svg>
                      </div>
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
        {pointsToShow !== null && (
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 0, y: -30 }}
            transition={{ duration: 2 }}
            style={{
              position: "fixed",
              top: "40%",
              left: "40%",
              transform: "translate(-50%, -50%)",
              color: "green",
              fontSize: "4rem",
              fontWeight: "bold",
              textAlign: "center",
              zIndex: 1000,
            }}
          >
            + {pointsToShow} pts !
          </motion.div>
        )}
      </Box>
    </Fade>
  );
};

export default MissionsTab;
