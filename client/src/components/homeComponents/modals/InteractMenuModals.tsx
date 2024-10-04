import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import {
  DialogContent,
  DialogTitle,
  Fade,
  IconButton,
  Typography,
} from "@mui/material";
import { IoClose } from "react-icons/io5";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  width: { xs: "90%", sm: "70%", md: "60%", lg: "50%", xl: "40%" },
  maxHeight: "80%",
  overflowY: "auto",
  borderRadius: "16px",
  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)", 
  p: 4, 
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
            sx={{
              m: 0,
              p: 2,
              textAlign: "center",
              borderBottom: "1px solid #e0e0e0",
            }}
            id="customized-dialog-title"
          >
            <Typography variant="h4" component="h4">
              {modalContents.title}
            </Typography>
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 16,
              top: 16,
              fontSize: "24px",
              bgcolor: "rgba(0, 0, 0, 0.05)",
              "&:hover": { bgcolor: "rgba(0, 0, 0, 0.1)" }, 
              borderRadius: "50%",
            }}
          >
            <IoClose />
          </IconButton>
          <DialogContent dividers sx={{ padding: "24px" }}>
            {modalContents.videoUrl ? (
              <Box
                component="video"
                className="h-auto w-full object-cover"
                controls
                sx={{
                  borderRadius: "8px",
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", 
                }}
                src={modalContents.videoUrl}
              />
            ) : (
              <Typography
                variant="h6"
                sx={{ color: "text.secondary", mt: 2, textAlign: "center" }}
              >
                {modalContents.description}
              </Typography>
            )}
          </DialogContent>
        </Box>
      </Fade>
    </Modal>
  );
};

export default InteractMenuModals;
