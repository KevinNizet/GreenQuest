import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Snackbar,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ReactCodeInput from "react-code-input";
import { useMutation } from "@apollo/client";
import { mutationJoinQuestByCode } from "@/graphql/joinQuestByCode/mutationJoinQuestByCode";
import { ApolloError } from "@apollo/client";

interface JoinQuestModalProps {
  open: boolean;
  onClose: () => void;
  onQuestJoined: () => void;
}

const JoinQuestModal: React.FC<JoinQuestModalProps> = ({
  open,
  onClose,
  onQuestJoined,
}) => {
  const [questCode, setQuestCode] = useState<string>("");
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [joinQuestByCode] = useMutation(mutationJoinQuestByCode);

  const handleQuestCodeChange = (code: string) => {
    setQuestCode(code);
  };

  const handleJoinQuest = async () => {
    if (questCode.length !== 6) {
      setToastMessage("Tu dois entrer un code valide à 6 chiffres");
      setToastOpen(true);
      return;
    }
    try {
      const codeNumber = parseInt(questCode);
      await joinQuestByCode({
        variables: { code: codeNumber },
      });
      setToastMessage("La quête a été rejointe avec succès 👍🏻 !");
      setToastOpen(true);
      onClose();
      onQuestJoined();
    } catch (err) {
      if (err instanceof ApolloError) {
        const errorMessage = err.graphQLErrors[0]?.message || err.message;
        if (errorMessage.includes("Tu as déjà rejoint cette quête")) {
          setToastMessage("Tu as déjà rejoint cette quête 😅");
        } else {
          setToastMessage("Une erreur est survenue 😔");
        }
      } else {
        setToastMessage("Une erreur inconnue est survenue 😔");
      }
      setToastOpen(true);
    }
  };

  const handleCloseToast = () => {
    setToastOpen(false);
  };

  const inputStyle = {
    width: "1.5rem",
    height: "2rem",
    margin: "0.2rem",
    fontSize: "1.2rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
    textAlign: "center" as "center",
  };

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("xs"));

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="xs"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            padding: isSmallScreen ? "1rem" : "1.5rem",
            width: isSmallScreen ? "90%" : "auto",
          },
        }}
      >
        <DialogTitle>Rejoins une quête ⚔️</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Pour rejoindre une quête, entre le code de 6 chiffres fourni par le
            créateur de la quête 🔑
          </DialogContentText>
          <Box
            display="flex"
            justifyContent="center"
            mt={2}
            sx={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              flexWrap: "nowrap",
              overflowX: "auto",
            }}
          >
            <ReactCodeInput
              name="questCode"
              type="number"
              fields={6}
              onChange={handleQuestCodeChange}
              value={questCode}
              inputStyle={inputStyle}
              inputMode="numeric"
              autoFocus
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={onClose}
            color="primary"
            sx={{ fontSize: isSmallScreen ? "0.8rem" : "1rem" }}
          >
            Annuler
          </Button>
          <Button
            onClick={handleJoinQuest}
            color="primary"
            sx={{ fontSize: isSmallScreen ? "0.8rem" : "1rem" }}
          >
            Rejoindre
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={toastOpen}
        autoHideDuration={5000}
        onClose={handleCloseToast}
        message={toastMessage}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{
          "& .MuiSnackbarContent-root": {
            backgroundColor: "#333",
            color: "#fff",
          },
        }}
      />
    </>
  );
};

export default JoinQuestModal;
