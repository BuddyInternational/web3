import {
  Box,
  DialogContent,
  DialogTitle,
  Fade,
  IconButton,
  Modal,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import ReactPlayer from "react-player";

const videoURL = process.env.REACT_APP_MINIGAME_VIDEO!;
// Server API Base URL
const server_api_base_url: any = process.env.REACT_APP_SERVER_API_BASE_URL;

const MinigameModal: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  const [hasFetched, setHasFetched] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  // Function to resolve the short URL and set the full video URL
  useEffect(() => {
    const resolveUrl = async () => {
      if (videoURL) {
        try {
          const response = await axios.get(
            `${server_api_base_url}/api/resolve-url`,
            {
              params: { shortUrl: videoURL },
            }
          );
          // Set the resolved URL if CORS allows
          if (response.data.resolvedUrl) {
            setVideoUrl(response.data.resolvedUrl);
          } else {
            console.warn("Could not resolve URL due to CORS.");
          }
        } catch (error) {
          console.error("Error resolving the short URL:", error);
        }
      }
    };
    if (videoURL && !hasFetched) {
      resolveUrl();
      setHasFetched(true);
    }
  }, [videoURL, hasFetched, server_api_base_url]);

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
            width: { xs: "90%", sm: "70%", md: "60%", lg: "50%", xl: "40%" },
            height: {
              xs: "30%",
              sm: "50%",
              md: "55%",
            },
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
          {/* Header Section */}
          {/* Title */}
          <DialogTitle
            sx={{
              m: 0,
              p: 2,
              textAlign: "center",
              fontSize: { xs: "0.7rem", sm: "1rem", md: "1.2rem" },
            }}
            id="customized-dialog-title"
          >
            Minigame (Player Vs. Player)
          </DialogTitle>

          {/* Close Button */}
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={(theme) => ({
              position: "absolute",
              color: "white",
              right: 10,
              top: 10,
              fontSize: { xs: "0.7rem", sm: "1rem", md: "1.2rem" },
              border: "1px solid gray",
              borderRadius: "10px",
            })}
          >
            <IoClose />
          </IconButton>

          <DialogContent
            dividers
            sx={{
              borderColor: "white",
              color: "white",
            }}
          >
            {/* Full-Width GIF Section */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: {
                  xs: "200px",
                  sm: "400px",
                  md: "450px",
                },
              }}
            >
              <ReactPlayer
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "8px",
                  boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
                }}
                width={"100%"}
                controls={true}
                url={videoUrl}
                loop={true}
                playing={true}
                config={{
                  file: {
                    attributes: {
                      crossOrigin: "anonymous",
                    },
                  },
                }}
              />
            </Box>
          </DialogContent>
        </Box>
      </Fade>
    </Modal>
  );
};

export default MinigameModal;
