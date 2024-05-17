import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { QuestType } from "../QuestsTab";

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

type QuestDetailsModalType = {
  handleClose: () => void;
  modalOpen: boolean;
  quest: QuestType | null;
};

export default function BasicModal({
  handleClose,
  modalOpen,
  quest,
}: QuestDetailsModalType) {
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
            {quest?.XPValue}
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
