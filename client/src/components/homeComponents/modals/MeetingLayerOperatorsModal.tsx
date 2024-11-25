import {
  Box,
  DialogContent,
  DialogTitle,
  Fade,
  IconButton,
  Modal,
  Typography,
} from "@mui/material";
import React from "react";
import { IoClose } from "react-icons/io5";

const MeetingLayerOperatorsModal: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  // Static Song Data
  const songData = {
    coverImage: "/music_cover.jpeg", // Replace with actual image path
    songName: "Shape of You",
    artistName: "Ed Sheeran",
    gifUrl: "/music-giphy.gif", // Replace with actual GIF path
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Fade in={open}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#132743",
            width: {
              xs: "99vw",
              sm: "80vw",
              md: "70vw",
              lg: "70vw",
              xl: "50vw",
            },
            height: "70%",
            overflow: "hidden",
            borderRadius: "5px",
            boxShadow: 2,
            color: "white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            borderColor: "white",
          }}
        >
          {/* Title */}
          <DialogTitle
            sx={{ m: 0, p: 2, textAlign: "center", color: "white" }}
            id="customized-dialog-title"
          >
            This Meeting Room has Earned 152 TIM
          </DialogTitle>

          {/* Close Button */}
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 16,
              top: 16,
              fontSize: "20px",
              border: "1px solid white",
              borderRadius: "10px",
              color: "white",
            }}
          >
            <IoClose />
          </IconButton>
          <DialogContent
            dividers
            sx={{
              borderColor: "white", // Set divider color to white
              color: "white", // Optional: Text color
            }}
          >
            {/* Full-Width GIF Section */}
            <Box
              sx={{
                width: "90%", // Full width of modal
                height: "70%", // Restrict the height to a reasonable value
                overflow: "hidden", // Ensure no overflow if the image aspect ratio varies
                borderRadius: "8px",
                margin: "auto",
                marginTop: "25px",
                marginBottom: "15px",
              }}
            >
              <img
                src={songData.gifUrl}
                alt="GIF"
                style={{
                  width: "100%", // Ensures it takes the full width
                  height: "auto", // Maintains the aspect ratio
                  display: "block", // Avoid inline element space issues
                }}
              />
            </Box>

            {/* Bottom Section */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 2,
                mt: "auto", // Push the bottom content to the end
              }}
            >
              {/* Song Cover Image */}
              <Box
                sx={{
                  width: "90px",
                  height: "90px",
                  borderRadius: "8px",
                  overflow: "hidden",
                  flexShrink: 0,
                  marginLeft: 4,
                }}
              >
                <img
                  src={songData.coverImage}
                  alt="Song Cover"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>

              {/* Song Details */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  textAlign: "right",
                  marginRight: 4,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ color: "white", fontWeight: "bold" }}
                >
                  {songData.songName}
                </Typography>
                <Typography variant="subtitle1" sx={{ color: "gray" }}>
                  {songData.artistName}
                </Typography>
              </Box>
            </Box>
          </DialogContent>
        </Box>
      </Fade>
    </Modal>
  );
};

export default MeetingLayerOperatorsModal;
