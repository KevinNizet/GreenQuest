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

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

type modalsType = {
  modalOpen: boolean;
  auth: boolean;
  handleClose: () => void;
  setAuth: (newvalue: boolean) => void;
  handleSwitchPosition: (newvalue: boolean) => void;
};

export default function BasicModal({
  modalOpen,
  auth,
  setAuth,
  handleClose,
  handleSwitchPosition,
}: modalsType) {
  const router = useRouter();
  const ApolloClient = useApolloClient();

  const [doSignout] = useMutation(signout, {
    refetchQueries: [queryMySelf],
  });

  const logout = () => {
    doSignout();
    setAuth(false);
    ApolloClient.resetStore();
    router.replace("/");
    handleClose();
  };

  const handleLoginClick = () => {
    handleClose();
    handleSwitchPosition(true);
    setAuth(true);
  };

  console.log("auth in modal:", auth);
  return (
    <div>
      <Modal
        open={modalOpen}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Voulez vous vraiment vous déconnecter?
          </Typography>
          <Stack direction="row" spacing={2}>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <Button variant="contained" onClick={logout} sx={{ mt: 2 }}>
                Oui
              </Button>
              <Button
                variant="contained"
                onClick={handleLoginClick}
                sx={{ mt: 2, ml: 3 }}
              >
                Non
              </Button>
            </Typography>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
}
