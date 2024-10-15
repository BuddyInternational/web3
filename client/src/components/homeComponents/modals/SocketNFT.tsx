import { Box, DialogContent, DialogTitle, Fade, IconButton, Modal, Typography } from '@mui/material';
import React from 'react'
import { IoClose } from 'react-icons/io5';

const SocketNFT: React.FC<{
    open: boolean;
    onClose: () => void;
  }> = ({ open, onClose }) => {
    return (
      <Modal open={open} onClose={onClose}>
        <Fade in={open}>
          <Box
            sx={{
              position: "absolute",
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
            }}
          >
            <DialogTitle
              sx={{ m: 0, p: 2, textAlign: "center" }}
              id="customized-dialog-title"
            >
              Persona Socket NFT
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
              <Typography
                variant="h6"
                sx={{ color: "text.secondary", mt: 2, textAlign: "center" }}
              >
                This feature is coming soon.
              </Typography>
            </DialogContent>
          </Box>
        </Fade>
      </Modal>
    );
}

export default SocketNFT
