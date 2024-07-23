import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useApolloClient, useMutation } from "@apollo/client";
import { signout } from "@/graphql/signout";
import { queryMySelf } from "@/graphql/queryMySelf";
import { useRouter } from "next/router";
import { Stack } from "@mui/material";
import { userType } from "../Header";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "70%", sm: "60%", md: "40%", lg: "40%", xl: "25%" },
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: "15px",
};

type modalsType = {
  modalOpen: boolean;
  me: userType;
  handleClose: () => void;
};

export default function HeaderModal({
  modalOpen,
  me,
  handleClose,
}: modalsType) {
  const router = useRouter();
  const ApolloClient = useApolloClient();

  const [doSignout] = useMutation(signout, {
    refetchQueries: [queryMySelf],
  });

  const logout = async () => {
    try {
      await doSignout();
      ApolloClient.resetStore();
      handleClose();
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de la déconnexion :",
        error
      );
    }
  };

  const handleLoginClick = () => {
    handleClose();
    router.push("/");
  };

  return (
    <div>
      <Modal
        open={modalOpen}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {me
              ? "Voulez-vous vraiment vous déconnecter?"
              : "Veuillez vous connecter."}
          </Typography>
          <Stack direction="row" spacing={2}>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              {me ? (
                <>
                  <Button variant="contained" onClick={logout} sx={{ mt: 2 }}>
                    Oui
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleClose}
                    sx={{ mt: 2, ml: 3 }}
                  >
                    Non
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleLoginClick}
                  sx={{ mt: 2 }}
                >
                  Connexion
                </Button>
              )}
            </Typography>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
}
