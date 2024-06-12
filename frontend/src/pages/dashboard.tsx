import React, { useState } from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Layout from "@/components/Layout";
import { Button, Typography } from "@mui/material";
import MissionsTab from "../components/MissionsTab";
import QuestsTab from "../components/QuestsTab";
import JoinQuestModal from "../components/modals/JoinQuestModal";

const Dashboard = () => {
  const [value, setValue] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <Layout title="dashboard">
      <Box
        key="join-create-buttons"
        sx={{
          height: "10%",
          display: "flex",
          alignItems: "center",
          padding: "2rem",
          justifyContent: "space-between",
          margin: "1rem 0 1rem 0",
        }}
      >
        <Button
          variant="contained"
          onClick={handleOpenModal}
          sx={{ height: "70%" }}
        >
          Rejoindre une quête
        </Button>
        <Button variant="contained" href="/questtunnel" sx={{ height: "70%" }}>
          Créer une quête
        </Button>
      </Box>
      <JoinQuestModal open={modalOpen} onClose={handleCloseModal} />
      <Box
        sx={{
          width: "100%",
          bgcolor: "transparent",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          centered
          sx={{ boxShadow: 1 }}
        >
          <Tab label="Missions" sx={{ fontSize: "25px" }} />
          <Tab label="Quêtes" sx={{ fontSize: "25px" }} />
        </Tabs>
      </Box>
      <Box
        sx={{
          width: "100%",
          height: "60%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {value === 0 && <MissionsTab value={value} />}
        {value === 1 && <QuestsTab value={value} />}
      </Box>
    </Layout>
  );
};

export default Dashboard;
