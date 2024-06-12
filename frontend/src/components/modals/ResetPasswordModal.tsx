import React, { FormEvent, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useMutation } from "@apollo/client";
import { mutationResetPassword } from "@/graphql/mutationResetPassword";

interface ResetPasswordModalProps {
  open: boolean;
  handleClose: () => void;
}

export function ResetPasswordModal({
  open,
  handleClose,
}: ResetPasswordModalProps) {
  const [resetEmail, setResetEmail] = useState("");
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const [resetMyPassword] = useMutation(mutationResetPassword);

  const resetPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await resetMyPassword({ variables: { email: resetEmail } });
      setResetEmailSent(true);
    } catch (error) {
      console.error(
        "Erreur lors de la réinitialisation du mot de passe:",
        error
      );
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" component="h2">
            Réinitialisation du mot de passe
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        {resetEmailSent ? (
          <Typography variant="body1" sx={{ mt: 2 }}>
            Un email de réinitialisation a été envoyé à votre adresse.
          </Typography>
        ) : (
          <form onSubmit={resetPassword}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="reset-email"
              label="Adresse email"
              name="email"
              autoComplete="email"
              autoFocus
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Envoyer
            </Button>
          </form>
        )}
      </Box>
    </Modal>
  );
}
