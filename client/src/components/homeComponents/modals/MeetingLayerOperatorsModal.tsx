import {
  Box,
  Button,
  DialogContent,
  DialogTitle,
  Fade,
  IconButton,
  Modal,
  Typography,
} from "@mui/material";
import { yellow } from "@mui/material/colors";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import ReactPlayer from "react-player";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

// Shazam API call options
const options = {
  method: "GET",
  url: "https://shazam.p.rapidapi.com/search",
  params: {
    term: "shape of you",
    locale: "en-US",
    offset: "0",
    limit: "1",
  },
  headers: {
    "x-rapidapi-key": process.env.REACT_APP_SHAZAM_KEY!,
    "x-rapidapi-host": process.env.REACT_APP_SHAZAM_HOST!,
  },
};

const videoURL = process.env.REACT_APP_MEETING_ROOM_VIDEO!;
// Server API Base URL
const server_api_base_url: any = process.env.REACT_APP_SERVER_API_BASE_URL;

const MeetingLayerOperatorsModal: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  // States for song data, video URL, timer, and fetching status
  const [songData, setSongData] = useState<any>({
    songName: "Shape of You",
    artistName: "Ed Sheeran",
    coverImage:
      "https://is1-ssl.mzstatic.com/image/thumb/Music111/v4/2d/1c/4f/2d1c4fd7-018c-0529-693b-c67fea53b698/190295851286.jpg/400x400cc.jpg",
    audioUrl: "https://www.shazam.com/track/338965882/shape-of-you",
  });
  const [videoUrl, setVideoUrl] = useState("");
  const [hasFetched, setHasFetched] = useState(false);
  const [timer, setTimer] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Fetch the song details from Shazam API when modal opens
  useEffect(() => {
    const fetchSongDetails = async () => {
      try {
        const response = await axios.request(options);
        const song = response.data.tracks.hits[0].track;
        setSongData({
          songName: song.title,
          artistName: song.subtitle,
          coverImage: song.images.coverart,
          audioUrl: song.url,
        });
      } catch (error) {
        console.error("Error fetching song details:", error);
      }
    };

    if (open && !hasFetched) {
      fetchSongDetails();
      setHasFetched(true);
    }
  }, [open, hasFetched]);

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
            <span className="bg-blue-100 text-blue-800 text-xs sm:text-[0.5rem] md:text-xs font-medium sm:p-1.5 md:p-2 rounded dark:bg-blue-900 dark:text-blue-300">
              {isTimerActive
                ? `Claim Rewards in ${timer} SECONDS`
                : "Thanks! You Earned TIM tokens."}
            </span>

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
              display: "flex",
              flexDirection: "column",
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

            {/* Song Cover and Details Section */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 2,
                mt: "auto",
              }}
            >
              {/* Song Cover Image */}
              <Box
                sx={{
                  width: { xs: "70px", sm: "90px", md: "120px" },
                  height: { xs: "70px", sm: "90px", md: "120px" },
                  borderRadius: "8px",
                  overflow: "hidden",
                  flexShrink: 0,
                  marginBottom: { xs: 2, md: 0 },
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
                {/* Shazam Link */}
                <Link
                  to={songData.audioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#6086d1] text-xs sm:text-base md:text-lg no-underline hover:underline"
                >
                  Listen on Shazam
                </Link>
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
