import {
  Box,
  Checkbox,
  Fade,
  CircularProgress,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { userType } from "./Header";
import { useQuery } from "@apollo/client";
import { queryMySelf } from "@/graphql/queryMySelf";
import { queryGetQuestByUser } from "@/graphql/queryGetQuestByUser";
import Pagination from "@mui/material/Pagination";
import QuestDetailsModal from "./modals/QuestDetailsModal";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { UserType } from "@/pages/userprofile";

type QuestTabProps = {
  value: number;
};

export type QuestType = {
  id: number;
  XPValue: number;
  users: [{ id: number; nickname: string }];
  code: number;
  createdAt: Date;
  description: string;
  difficulty: string;
  duration: number;
  missions: [{ id: number; title: string }];
  title: string;
  createdBy: UserType;
};

const QuestsTab = (props: QuestTabProps) => {
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
    error: meErrors,
  } = useQuery<{ item: userType }>(queryMySelf);

  const me = medata && medata.item;

  const { data, loading, error } = useQuery<{ item: QuestType[] }>(
    queryGetQuestByUser,
    {
      variables: {
        userId: me?.id,
      },
      skip: !me?.id, // Skip the query if me.id is not available
    }
  );

  const quests = data && data.item;

  const [page, setPage] = useState(1);
  const questsPerPage = 4;

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

  if (meErrors || error) {
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
    <Fade in={props.value === 1} timeout={450}>
      <Box
        sx={{
          width: "90%",
          height: "90%",
          backgroundColor: "#f1d6b8",
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
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
            }}
          >
            {displayedQuests &&
              displayedQuests.map((quest, index) => (
                <Box
                  key={`quest-${index}-${quest.id}`}
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
                      alignItems: "center",
                      display: "flex",
                      justifyContent: "space-between",
                      height: "60px",
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
                      onClick={() => handleOpen(quest)}
                    >
                      {quest.title}
                    </p>
                    <HelpOutlineIcon
                      sx={{
                        color: "grey",
                        fontSize: "35px",
                        margin: "0 1rem 0 0",
                        cursor: "pointer",
                      }}
                      onClick={() => handleOpen(quest)}
                    />
                    <Checkbox
                      color="secondary"
                      sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                    />
                  </Box>
                </Box>
              ))
            ) : (
              <Typography>Aucune quête à afficher.</Typography>
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
