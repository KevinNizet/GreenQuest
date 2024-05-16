import React, { useState } from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Layout from "@/components/Layout";
import { Button, Typography } from "@mui/material";
import MissionsTab from "../components/MissionsTab";
import QuestsTab from "../components/QuestsTab";

const Dashboard = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Layout title="dashboard">
      <Box
        sx={{
          height: "10%",
          display: "flex",
          alignItems: "center",
          padding: "2rem",
          justifyContent: "space-between",
          margin: "1rem 0 1rem 0",
        }}
      >
        <Box
          sx={{
            backgroundColor: "lightgrey",
            width: "40%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            padding: "1rem",
            borderRadius: "10px",
            boxShadow: 1,
          }}
        >
          <Typography
            sx={{
              fontSize: "20px",
            }}
          >
            Point d&apos;expérience :
          </Typography>
        </Box>
        <Button variant="contained" href="/questtunnel">
          Créer une quête
        </Button>
      </Box>
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
          height: "65%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {value === 0 && <MissionsTab />}
        {value === 1 && <QuestsTab />}
      </Box>
    </Layout>
  );
};

export default Dashboard;
