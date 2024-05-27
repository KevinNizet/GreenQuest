import { Box, Checkbox, Fade } from "@mui/material";
import React, { useState } from "react";
import { userType } from "./Header";
import { useQuery } from "@apollo/client";
import { queryMySelf } from "@/graphql/queryMySelf";
import { QuestType } from "./QuestsTab";
import { queryGetQuestByUser } from "@/graphql/queryGetQuestByUser";
import Pagination from "@mui/material/Pagination";
import { green } from "@mui/material/colors";

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

  const quests = data && data.item;

  const [page, setPage] = useState(1);
  const missionsPerPage = 4;

  // Flatten all missions from all quests
  const allMissions = quests?.flatMap((quest) => quest.missions) || [];

  // Calculate total pages
  const totalPages = Math.ceil(allMissions.length / missionsPerPage);

  // Determine the missions to display on the current page
  const displayedMissions = allMissions.slice(
    (page - 1) * missionsPerPage,
    page * missionsPerPage
  );

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
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
            {displayedMissions.map((mission) => (
              <Box
                key={mission.id}
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
