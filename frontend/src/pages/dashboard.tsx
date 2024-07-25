import React, { useState } from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Layout from "@/components/Layout";
import { Button } from "@mui/material";
import MissionsTab from "../components/MissionsTab";
import QuestsTab from "../components/QuestsTab";
import JoinQuestModal from "../components/modals/JoinQuestModal";
import Lottie from "react-lottie";
import cible from "@/images/lottie/cible.json";
import boussole from "@/images/lottie/boussole.json";

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

  const defaultOptionsCible = {
    loop: false,
    autoplay: true,
    animationData: cible,
  };

  const defaultOptionsBoussole = {
    loop: false,
    autoplay: true,
    animationData: boussole,
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
          sx={{
            width: { xs: "45%", sm: "20%", lg: "16%", xl: "12%" },
            height: { sm: "5vh", md: "6vh" },
            textAlign: "center",
          }}
        >
          Rejoindre une quête
        </Button>
        <Button
          variant="contained"
          href="/questtunnel"
          sx={{
            width: { xs: "45%", sm: "20%", lg: "16%", xl: "12%" },
            height: { sm: "5vh", md: "6vh" },
            textAlign: "center",
          }}
        >
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
          marginBottom: "50px",
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
          height: "80px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "1.8rem",
        }}
      >
        {value === 0 && (
          <Lottie options={defaultOptionsCible} height="200%" width="200%" />
        )}
        {value === 1 && (
          <Lottie options={defaultOptionsBoussole} height="100%" width="100%" />
        )}
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
