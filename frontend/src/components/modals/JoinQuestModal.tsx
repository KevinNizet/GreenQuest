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
} from "@mui/material";
import ReactCodeInput from "react-code-input";
import { useMutation } from "@apollo/client";
import { mutationJoinQuestByCode } from "@/graphql/joinQuestByCode/mutationJoinQuestByCode";
import { ApolloError } from "@apollo/client";

interface JoinQuestModalProps {
  open: boolean;
  onClose: () => void;
}

const JoinQuestModal: React.FC<JoinQuestModalProps> = ({ open, onClose }) => {
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
      //   setTimeout(() => {
      //     window.location.reload();
      //   }, 1000);
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
    width: "2.5rem",
    height: "2.5rem",
    margin: "0.5rem",
    fontSize: "2rem",
    fontStyle: "Roboto",
    borderRadius: "4px",
    border: "1px solid #ccc",
    textAlign: "center" as "center",
  };

  return (
    <>
      <style>
        {`
          input[type=number]::-webkit-outer-spin-button,
          input[type=number]::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          input[type=number] {
            -moz-appearance: textfield;
          }
        `}
      </style>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Rejoins une quête</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Pour rejoindre une quête, entre le code de 6 chiffres fourni par le
            créateur de la quête.
          </DialogContentText>
          <Box display="flex" justifyContent="center" mt={2}>
            <ReactCodeInput
              name="questCode"
              type="number"
              fields={6}
              onChange={handleQuestCodeChange}
              value={questCode}
              inputStyle={inputStyle}
              inputMode="numeric"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Annuler
          </Button>
          <Button onClick={handleJoinQuest} color="primary">
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
      />
    </>
  );
};

export default JoinQuestModal;
