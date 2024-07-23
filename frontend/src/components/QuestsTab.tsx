import React, { useState } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  Fade,
  Pagination,
} from "@mui/material";
import { useQuery } from "@apollo/client";
import { queryMySelf } from "@/graphql/queryMySelf";
import { queryGetQuestByUser } from "@/graphql/queryGetQuestByUser";
import QuestDetailsModal from "./modals/QuestDetailsModal";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import Lottie from "react-lottie";
import wizard from "@/images/lottie/wizard.json";
import { userMissionType } from "./MissionsTab";
import { UserType } from "@/pages/userprofile";
import { userType } from "./Header";

type QuestTabProps = {
  value: number;
};

export type QuestType = {
  id: number;
  XPValue: number;
  users: [{ id: number; nickname: string; userMissions: userMissionType[] }];
  code: number;
  createdAt: Date;
  description: string;
  difficulty: string;
  duration: number;
  missions: [{ id: number; title: string }];
  title: string;
  createdBy: UserType;
  startDate: string;
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
  questList: {
    width: "100%",
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
  },
  questBox: {
    backgroundColor: "#f8d7e4",
    width: "90%",
    display: "flex",
    padding: "1.5rem",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    margin: "1rem 0 0 0",
  },
  questTitle: {
    width: "80%",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    fontSize: "20px",
  },
  questIcon: {
    color: "grey",
    fontSize: "45px",
    margin: "0 1rem 0 0",
    cursor: "pointer",
    filter: "drop-shadow(0px 1px 1.2px grey)",
  },
  noQuestText: {
    fontSize: "1.3rem",
    paddingY: "1rem",
    paddingX: "1rem",
    textAlign: "center",
  },
};

const QuestsTab = ({ value }: QuestTabProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState<QuestType | null>(null);
  const [page, setPage] = useState(1);
  const questsPerPage = 4;

  const handleOpen = (quest: QuestType) => {
    setSelectedQuest(quest);
    setModalOpen(true);
  };

  const handleClose = () => setModalOpen(false);

  const {
    loading: meLoading,
    data: medata,
    error: meError,
  } = useQuery<{ item: userType }>(queryMySelf);
  const me = medata?.item;

  const { data, loading, error } = useQuery<{ item: QuestType[] }>(
    queryGetQuestByUser,
    {
      variables: { userId: me?.id },
      fetchPolicy: "network-only",
      skip: !me?.id,
    }
  );

  const quests = data?.item;
  const totalPages = Math.ceil((quests?.length || 0) / questsPerPage);
  const displayedQuests = quests?.slice(
    (page - 1) * questsPerPage,
    page * questsPerPage
  );

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: wizard,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  if (meLoading || loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (meError) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Typography color="error">Une erreur est survenue.</Typography>
      </Box>
    );
  }

  return (
    <Fade in={value === 1} timeout={450}>
      <Box sx={styles.container}>
        <Box sx={styles.content}>
          <Box sx={styles.questList}>
            {displayedQuests && displayedQuests.length > 0 ? (
              displayedQuests.map((quest, index) => (
                <Box key={`quest-${index}-${quest.id}`} sx={styles.questBox}>
                  <Box
                    sx={{
                      width: "100%",
                      alignItems: "center",
                      display: "flex",
                      justifyContent: "space-between",
                      height: "60px",
                    }}
                  >
                    <p
                      style={styles.questTitle}
                      onClick={() => handleOpen(quest)}
                    >
                      {quest.title}
                    </p>
                    <MenuBookIcon
                      sx={styles.questIcon}
                      onClick={() => handleOpen(quest)}
                    />
                  </Box>
                </Box>
              ))
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography sx={styles.noQuestText}>
                  Oh non 😢 ! Tu n&apos;as pas encore de quête 🗺️.
                </Typography>
                <Typography sx={styles.noQuestText}>
                  Tu peux en créer une et inviter des aventuriers 🛡️ à partir
                  avec toi ou rejoindre une quête 🧳 grâce au code utilisateur
                  🗝️ fourni par un brave compagnon de voyage 🧑‍🤝‍🧑 !
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
          {selectedQuest && (
            <QuestDetailsModal
              handleClose={handleClose}
              modalOpen={modalOpen}
              quest={selectedQuest}
              me={me}
            />
          )}
        </Box>
      </Box>
    </Fade>
  );
};

export default QuestsTab;
