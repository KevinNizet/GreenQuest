import { Box, Checkbox, Fade, Typography } from "@mui/material";
import React from "react";
import { useQuery } from "@apollo/client";
import { queryMySelf } from "@/graphql/queryMySelf";
import { queryGetQuestByUser } from "@/graphql/queryGetQuestByUser";
import QuestDetailsModal from "./modals/QuestDetailsModal";
import { userType } from "./Header";

export type QuestType = {
  id: number;
  XPValue: number;
  users: { id: number };
  code: number;
  createdAt: Date;
  description: string;
  difficulty: string;
  duration: number;
  missions: [{ id: number; title: string }];
  title: string;
};

type QuestTabProps = {
  value: number;
};

const QuestsTab = (props: QuestTabProps) => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedQuest, setSelectedQuest] = React.useState<QuestType | null>(
    null
  );

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
    }
  );

  const quests = data && data.item;

  return (
    <>
      <Fade in={props.value === 1} timeout={450}>
        <Box
          sx={{
            width: "90%",
            height: "90%",
            backgroundColor: "#f1d6b8",
            borderRadius: "30px",
            boxShadow: 2,
            marginTop: 0,
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            gap: "10%",
          }}
        >
          {quests &&
            quests.map((quest) => (
              <Box
                key={quest.id}
                sx={{
                  backgroundColor: "lightgrey",
                  width: "80%",
                  height: "15%",
                  display: "flex",
                  padding: "1.5rem",
                  borderRadius: "10px",
                  boxShadow: 1,
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    gap: "30%",
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
                  <Checkbox sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }} />
                </Box>
              </Box>
            ))}
          <QuestDetailsModal
            handleClose={handleClose}
            modalOpen={modalOpen}
            quest={selectedQuest}
          />
        </Box>
      </Fade>
    </>
  );
};

export default QuestsTab;
