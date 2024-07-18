import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { QuestType } from "../QuestsTab";
import { userType } from "../Header";
import { Button } from "@mui/material";
import { useMutation } from "@apollo/client";
import { mutationDeleteQuest } from "@/graphql/mutationDeleteQuest";
import Snackbar, { SnackbarOrigin } from "@mui/material/Snackbar";
import { queryGetQuestByUser } from "@/graphql/queryGetQuestByUser";
import LeaderBoard from "../LeaderBoard";

interface State extends SnackbarOrigin {
  open: boolean;
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 550,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

type QuestDetailsModalType = {
  handleClose: () => void;
  modalOpen: boolean;
  quest: QuestType | null;
  me: userType | undefined;
};

export default function BasicModal({
  handleClose,
  modalOpen,
  quest,
  me,
}: QuestDetailsModalType) {
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [state, setState] = React.useState<State>({
    open: false,
    vertical: "top",
    horizontal: "center",
  });

  const { vertical, horizontal, open } = state;

  const handleClick = (newState: SnackbarOrigin) => {
    setState({ ...newState, open: true });
  };

  const handleCloseSnackbar = () => {
    setState({ ...state, open: false });
  };

  const [deleteQuest] = useMutation(mutationDeleteQuest, {
    variables: { deleteQuestId: quest?.id },
    refetchQueries: [queryGetQuestByUser],
    onCompleted: () => {
      handleClick({ vertical: "top", horizontal: "right" });
    },
  });

  const handleOpenConfirmModal = () => {
    handleClose();
    setConfirmOpen(true);
  };

  const handleCloseConfirmModal = () => {
    setConfirmOpen(false);
  };

  return (
    <div>
      <Modal
        open={modalOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ borderRadius: "10px" }}
      >
        <Box sx={style} key={quest?.id}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {quest?.title}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {quest?.description}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Date de début : {quest?.startDate.split("T")[0]}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Durée: {quest?.duration} {quest?.duration === 1 ? "jour" : "jours"}
          </Typography>
          <br />
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Classement :
          </Typography>
          <br />
          <LeaderBoard questId={quest?.id} userId={me?.id} key={quest?.id} />
          <br />
          <>
            {quest?.createdBy.id === me?.id && (
              <Button
                key={quest?.id}
                sx={{ color: "red", fontSize: "20px" }}
                onClick={handleOpenConfirmModal}
              >
                Supprimer
              </Button>
            )}
          </>
        </Box>
      </Modal>
      <Modal open={confirmOpen} onClose={handleCloseConfirmModal}>
        <Box sx={style}>
          <Typography id="modal-modal-description" sx={{ mt: 2 }} variant="h6">
            Vous êtes sûr de vouloir supprimer cette quête ?
          </Typography>
          <Button
            sx={{ color: "red", fontSize: "20px", mt: 2 }}
            onClick={() => {
              deleteQuest();
              handleCloseConfirmModal();
            }}
          >
            Confirmer
          </Button>
          <Button
            sx={{ fontSize: "20px", mt: 2 }}
            onClick={handleCloseConfirmModal}
          >
            Annuler
          </Button>
        </Box>
      </Modal>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        onClose={handleCloseSnackbar}
        message={`La quête ${quest?.title} a été supprimée ✅`}
        autoHideDuration={5000}
        key={vertical + horizontal}
        sx={{
          "& .MuiSnackbarContent-root": {
            backgroundColor: "white ",
            color: "#DBAD42",
            borderRadius: "10px",
            fontSize: "15px",
          },
        }}
      />
    </div>
  );
}
