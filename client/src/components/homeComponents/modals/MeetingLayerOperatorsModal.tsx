import {
  Box,
  Button,
  DialogContent,
  DialogTitle,
  Fade,
  IconButton,
  Modal,
  Snackbar,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import ReactPlayer from "react-player";
import { toast } from "react-toastify";

const videoURL = process.env.REACT_APP_MEETING_ROOM_VIDEO!;
// Server API Base URL
const server_api_base_url: any = process.env.REACT_APP_SERVER_API_BASE_URL;

const MeetingLayerOperatorsModal: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  // Static Song Data
  const songData = {
    coverImage: "/music_cover.jpeg",
    songName: "Shape of You",
    artistName: "Ed Sheeran",
    videoUrl: videoURL,
  };
  const [videoUrl, setVideoUrl] = useState("");
  const [hasFetched, setHasFetched] = useState(false);

  console.log("vedio url ===============", songData.videoUrl);

  // Timer State
  const [timer, setTimer] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Start timer when modal opens
  useEffect(() => {
    let countdown: NodeJS.Timeout;
    if (open) {
      setIsTimerActive(true);
      setTimer(30);
      countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            clearInterval(countdown);
            setIsTimerActive(false);
            toast.success("Thanks! This meeting room has earned TIM tokens.");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(countdown);
  }, [open]);

  // Function to resolve the short URL and set the full video URL
  useEffect(() => {
    const resolveUrl = async () => {
      if (songData.videoUrl) {
        try {
          const response = await axios.get(
            `${server_api_base_url}/api/resolve-url`,
            {
              params: { shortUrl: songData.videoUrl },
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
    if (songData.videoUrl && !hasFetched) {
      resolveUrl();
      setHasFetched(true);
    }
  }, [songData.videoUrl, hasFetched, server_api_base_url]);

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
            height: {
              xs: "40%", 
              sm: "60%",
              md: "70%",
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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 2,
              borderBottom: "1px solid white",
            }}
          >
            {/* Claim Button */}
            <Button
              variant="contained"
              sx={{
                backgroundColor: isTimerActive ? "green" : "#5692D9",
                color: "white",
                fontSize: isTimerActive
                  ? { xs: "0.5rem", sm: "0.6rem", md: "0.8rem" }
                  : { xs: "0.6rem", sm: "0.8rem", md: "1rem" },
                "&.Mui-disabled": {
                  backgroundColor: "green",
                },
              }}
              disabled={isTimerActive}
            >
              {isTimerActive
                ? `Claim Rewards in ${timer} SECONDS`
                : "Claim TIM"}
            </Button>

            {/* Title */}
            <DialogTitle
              sx={{
                textAlign: "center",
                color: "white",
                fontSize: { xs: "0.5rem", sm: "0.7rem", md: "1rem" },
              }}
            >
              This Meeting Room has Earned 152 TIM
            </DialogTitle>

            {/* Close Button */}
            <IconButton
              aria-label="close"
              onClick={onClose}
              sx={{
                color: "white",
                fontSize: { xs: "0.5rem", sm: "0.7rem", md: "1rem" },
              }}
            >
              <IoClose />
            </IconButton>
          </Box>

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
                  sm: "300px",
                  md: "400px",
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

            {/* Middle Section */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 2,
                mt: "auto",
                // flexDirection: { sm: "column", md: "row" },
              }}
            >
              {/* Song Cover Image */}
              <Box
                sx={{
                  width: { xs: "70px", sm: "90px", md: "120px" }, // Responsive image size
                  height: { xs: "70px", sm: "90px", md: "120px" },
                  borderRadius: "8px",
                  overflow: "hidden",
                  flexShrink: 0,
                  marginBottom: { xs: 2, md: 0 }, // Add bottom margin on small screens for spacing
                  marginRight: { md: 4 },
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
                  // marginRight: 4,
                  marginRight: { xs: 0, md: 4 },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    fontSize: { xs: "1rem", sm: "1.2rem", md: "1.4rem" },
                  }}
                >
                  {songData.songName}
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: "gray",
                    fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
                  }}
                >
                  {songData.artistName}
                </Typography>
              </Box>
            </Box>
            {/* Bottom Section */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mt: 2,
              }}
            >
              {/* All right Reserved */}
              <Typography
                variant="caption"
                sx={{
                  color: "white",
                  textAlign: "center",
                  fontSize: { xs: "0.8rem", sm: "1rem" },
                }}
              >
                ® All Rights Reserved
              </Typography>
            </Box>
          </DialogContent>
        </Box>
      </Fade>
    </Modal>
  );
};

export default MeetingLayerOperatorsModal;
