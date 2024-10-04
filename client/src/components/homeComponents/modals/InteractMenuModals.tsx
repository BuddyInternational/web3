import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { DialogContent, DialogTitle, Fade, IconButton } from "@mui/material";
import { IoClose } from "react-icons/io5";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "white",
  width: { xs: "90%", sm: "70%", md: "60%", lg: "50%", xl: "40%" },
  maxHeight: "80%",
  overflowY: "auto",
  borderRadius: "8px",
  boxShadow: 3,
  p: 3,
};

interface CustomModalProps {
  open: boolean;
  onClose: () => void;
  modalContents: any;
}

const InteractMenuModals: React.FC<CustomModalProps> = ({
  open,
  onClose,
  modalContents,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Fade in={open}>
        <Box sx={style}>
          <DialogTitle
            sx={{ m: 0, p: 2, textAlign: "center" }}
            id="customized-dialog-title"
          >
            {modalContents.title}
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={(theme) => ({
              position: "absolute",
              right: 16,
              top: 16,
              fontSize: "20px",
              border: "1px solid gray",
              borderRadius: "10px",
            })}
          >
            <IoClose />
          </IconButton>
          <DialogContent dividers>
            {modalContents.videoUrl ? (
              <video
                className="h-auto w-full object-cover"
                controls
                src={modalContents.videoUrl}
              />
            ) : (
              <p>{modalContents.description}</p>
            )}
          </DialogContent>
        </Box>
      </Fade>
    </Modal>
  );
};

export default InteractMenuModals;
