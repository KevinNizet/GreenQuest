import { useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { Grid, Typography, TextField, Button, Paper } from "@mui/material";
import { useQuestContext } from "@/contexts/QuestContext";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/fr";
import { ThemeProvider } from "@mui/material/styles";
import { QuestTunnelTheme } from "@/themes/questTunnelTheme";

export default function StartAndDuration() {
  const router = useRouter();
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const { setQuestInfo } = useQuestContext();

  const previousPage = () => {
    router.back();
  };

  const nextPage = () => {
    const formattedStartDate = startDate?.toISOString();

    setQuestInfo((prevQuestInfo) => ({
      ...prevQuestInfo,
      startDate: formattedStartDate,
      duration: duration,
    }));

    router.push("/questtunnel/difficulty");
  };

  return (
    <ThemeProvider theme={QuestTunnelTheme}>
      <Layout title="Date de début et durée de la quête">
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          gap={5}
          marginTop={3}
        >
          <Typography variant="h1">Crée ta quête 🚀</Typography>

          <Paper
            elevation={3}
            sx={{
              backgroundColor: "transparent",
              boxShadow: "none",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "2rem",
              alignItems: "center",
              padding: 2,
              width: {
                xs: "90%",
                sm: "80%",
                md: "70%",
                lg: "60%",
                xl: "50%",
              },
            }}
          >
            <Typography variant="h2">Étape 2 📅</Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
              <DatePicker
                label="Date de début de la quête"
                format="DD/MM/YYYY"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                sx={{ width: "100%" }}
                minDate={dayjs()}
              />
            </LocalizationProvider>
            <TextField
              label="Durée de la quête (en jours)"
              type="number"
              variant="outlined"
              fullWidth
              margin="normal"
              InputProps={{ inputProps: { min: 1 } }}
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
            />
            <Grid
              container
              justifyContent="space-between"
              alignItems="center"
              width="100%"
              gap={2}
            >
              <Button
                variant="contained"
                onClick={previousPage}
                color="secondary"
              >
                Retour
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={nextPage}
                disabled={!startDate || duration <= 0}
              >
                Suivant
              </Button>
            </Grid>
          </Paper>
        </Grid>
      </Layout>
    </ThemeProvider>
  );
}
