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
import Link from "next/link";

const Dashboard = () => {
  const [value, setValue] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [missionsKey, setMissionsKey] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleQuestJoined = () => {
    setMissionsKey((prevKey) => prevKey + 1);
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
          justifyContent: "center",
          padding: "2rem",
          gap: "40%",
          margin: "1rem 0 1rem 0",
        }}
      >
        <Button
          variant="contained"
          onClick={handleOpenModal}
          sx={{
            width: { xs: "30%", sm: "20%", lg: "16%", xl: "12%" },
            height: { sm: "5vh", md: "8vh" },
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            whiteSpace: "normal",
            wordBreak: "break-word",
            padding: "0.5rem",
            fontSize: {
              xs: "0.6rem",
              sm: "0.65rem",
              md: "0.8rem",
              lg: "1rem",
            },
          }}
        >
          Rejoindre <br />
          une quête
        </Button>
        <Box
          sx={{
            width: { xs: "30%", sm: "20%", lg: "16%", xl: "12%" },
            height: { sm: "5vh", md: "8vh" },
          }}
        >
          <Link href="/questtunnel" passHref style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              sx={{
                width: "100%",
                height: "100%",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                whiteSpace: "normal",
                wordBreak: "break-word",
                padding: "0.5rem",
                fontSize: {
                  xs: "0.6rem",
                  sm: "0.65rem",
                  md: "0.8rem",
                  lg: "1rem",
                },
              }}
            >
              Créer une <br />
              quête
            </Button>
          </Link>
        </Box>
      </Box>
      <JoinQuestModal
        open={modalOpen}
        onClose={handleCloseModal}
        onQuestJoined={handleQuestJoined}
      />
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
        {value === 0 && (
          <MissionsTab
            key={missionsKey}
            value={value}
            onQuestJoined={handleQuestJoined}
          />
        )}
        {value === 1 && <QuestsTab value={value} />}
      </Box>
    </Layout>
  );
};

export default Dashboard;
