import React, { useState } from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Layout from "@/components/Layout";
import { Button, Typography, TextField } from "@mui/material";
import MissionsTab from "../components/MissionsTab";
import QuestsTab from "../components/QuestsTab";
import { useMutation } from "@apollo/client";
import { mutationJoinQuestByCode } from "@/graphql/joinQuestByCode/mutationJoinQuestByCode";
import Snackbar from "@mui/material/Snackbar";

const Dashboard = () => {
  const [value, setValue] = useState(0);
  const [questCode, setQuestCode] = useState<string>("");
  const [toastOpen, setToastOpen] = React.useState({
    open: false,
    vertical: "top",
    horizontal: "right",
  });
  const { vertical, horizontal, open } = toastOpen;
  const [toastMessage, setToastMessage] = React.useState("");

  const [joinQuestByCode, { data, error }] = useMutation(
    mutationJoinQuestByCode
  );

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleQuestCodeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setQuestCode(event.target.value);
  };

  const isValidQuestCode = (code: string): boolean => {
    return /^\d{6}$/.test(code);
  };

  const handleJoinQuest = async () => {
    if (!isValidQuestCode(questCode)) {
      setToastMessage("Veuillez entrer un code valide à 6 chiffres.");
      setToastOpen({ ...toastOpen, open: true });
      return;
    }
    try {
      const codeNumber = parseInt(questCode);
      const response = await joinQuestByCode({
        variables: { code: codeNumber },
      });
      console.log("Quête rejointe avec succès:", response.data.joinQuestByCode);
      setToastMessage("La quête a été rejointe avec succès 👍🏻 !");
      setToastOpen({ ...toastOpen, open: true });
    } catch (err) {
      setToastMessage("Une erreur est survenue 😔");
      setToastOpen({ ...toastOpen, open: true });
    }
  };

  const handleCloseToast = () => {
    setToastOpen({ ...toastOpen, open: false });
  };

  return (
    <Layout title="dashboard">
      <Box></Box>
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

        <Button variant="contained" href="/questtunnel" sx={{ height: "70%" }}>
          Créer une quête
        </Button>
      </Box>
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
            width: "100%",
            height: "auto",
            display: "flex",
            alignItems: "center",
            padding: "1rem",
            borderRadius: "10px",
            boxShadow: 1,
            marginBottom: "2rem",
          }}
        >
          <Typography
            sx={{
              fontSize: "20px",
              marginRight: "1rem",
            }}
          >
            Rejoins une quête grace à ton code :
          </Typography>
          <TextField
            variant="outlined"
            sx={{ width: "100%" }}
            autoComplete="off"
            value={questCode}
            onChange={handleQuestCodeChange}
          />
          <Button
            variant="contained"
            sx={{ marginLeft: "1rem", height: "100%" }}
            onClick={handleJoinQuest}
          >
            Valider
          </Button>
        </Box>
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
          height: "60%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {value === 0 && <MissionsTab value={value} />}
        {value === 1 && <QuestsTab value={value} />}
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          height: "4%",
        }}
      >
        <Button variant="contained" sx={{ width: "20%", fontSize: "18px" }}>
          Valider
        </Button>
      </Box>
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleCloseToast}
        message={toastMessage}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        key={vertical + horizontal}
      />
    </Layout>
  );
};

export default Dashboard;
