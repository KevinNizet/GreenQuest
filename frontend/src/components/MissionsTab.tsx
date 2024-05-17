import { Box, Checkbox, Fade, Typography } from "@mui/material";
import React from "react";
import { userType } from "./Header";
import { useQuery } from "@apollo/client";
import { queryMySelf } from "@/graphql/queryMySelf";
import { QuestType } from "./QuestsTab";
import { queryGetQuestByUser } from "@/graphql/queryGetQuestByUser";

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
      variables: {
        userId: me?.id,
      },
    }
  );
  console.log(error);

  const quests = data && data.item;

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
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          gap: "10%",
        }}
      >
        {quests &&
          quests.map((quest) =>
            quest.missions?.map((mission) => (
              <Box
                key={mission.id}
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
                  >
                    {mission.title}
                  </p>
                  <Checkbox sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }} />
                </Box>
              </Box>
            ))
          )}
      </Box>
    </Fade>
  );
};

export default MissionsTab;
