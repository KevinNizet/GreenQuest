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

const Dashboard = () => {
  const [value, setValue] = useState(0);
  const [questCode, setQuestCode] = useState<number | "">("");

  const [joinQuestByCode, { data, error }] = useMutation(
    mutationJoinQuestByCode
  );

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleQuestCodeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const code = parseInt(event.target.value, 10); // Convertir la chaîne en nombre
    setQuestCode(isNaN(code) ? "" : code); // Si la conversion échoue, définir le state comme une chaîne vide
  };

  const handleJoinQuest = async () => {
    try {
      const response = await joinQuestByCode({
        variables: { code: questCode },
      });
      console.log("Quête rejointe avec succès:", response.data.joinQuestByCode);
      console.log("data : ", data);
      //TODO: Màj UI pour retour utilisateur si succés (toast ? )
    } catch (err) {
      console.error("La quête n'a pas pu être rejointe", error);
      //TODO: Màj UI pour retour utilisateur si échec (toast ? )
    }
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
    </Layout>
  );
};

export default Dashboard;
