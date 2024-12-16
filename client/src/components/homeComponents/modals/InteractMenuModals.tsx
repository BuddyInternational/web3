import React, { useEffect, useState, useRef } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import {
  Button,
  DialogContent,
  DialogTitle,
  Fade,
  IconButton,
  Typography,
} from "@mui/material";
import { IoClose } from "react-icons/io5";
import ReactPlayer from "react-player";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { useVanityContext } from "../../../context/VanityContext";
import { ethers } from "ethers";
import nftMarketAbi from "../../../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import { getClaimDetails, updateNFTClaimDetails } from "../../../api/nftAPI";
import { NFTDetails } from "../../../utils/Types";
import axios from "axios";
import { useLoader } from "../../../context/LoaderContext";
import Loader from "../../../utils/Loader";
import useContract from "../../../utils/useContract";
import { toast } from "react-toastify";

interface ModalContents {
  title: string;
  description: string;
  videoUrl?: string;
  content: any;
  selectedNFT: NFTDetails;
}

interface CustomModalProps {
  open: boolean;
  onClose: () => void;
  modalContents: ModalContents;
  ChainName: string | undefined;
}

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

const InteractMenuModals: React.FC<CustomModalProps> = ({
  open,
  onClose,
  modalContents,
  ChainName,
}) => {
  const { address,chainId } = useWeb3ModalAccount();
  const { vanityAddress } = useVanityContext();
  const { walletProvider } = useWeb3ModalProvider();
  const { getContract } = useContract();
  const { isLoading, setIsLoading } = useLoader();
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lastClaimedAt, setLastClaimedAt] = useState<Date | null>(null);
  const [timeUntilNextClaim, setTimeUntilNextClaim] = useState(0);
  const [connectedNetwork, setConnectedNetwork] = useState<string | null>(null);
  const [canClaim, setCanClaim] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [hasFetched, setHasFetched] = useState(false); 
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isCorrectNetwork =
    connectedNetwork?.toLowerCase() === ChainName?.toLowerCase();
  // Server API Base URL
  const server_api_base_url: any = process.env.REACT_APP_SERVER_API_BASE_URL;

  // fetch the connected network
  useEffect(() => {
    const getConnectedNetwork = async () => {
      if (typeof window.ethereum !== "undefined") {
        const ethersProvider = new ethers.BrowserProvider(
          walletProvider as ethers.Eip1193Provider
        );
        const network = await ethersProvider.getNetwork();
        setConnectedNetwork(network.name.toLowerCase()); 
      } else {
        console.error("Ethereum provider is not available.");
      }
    };
    getConnectedNetwork();
  });

  // Helper to calculate the time difference until the next reward can be claimed
  const calculateTimeUntilNextClaim = (lastClaimed: Date) => {
    const now = new Date();
    const timeDiff = now.getTime() - new Date(lastClaimed).getTime();
    const secondsSinceLastClaim = timeDiff / 1000;
    const secondsIn24Hours = 86400; // 24 hours in seconds 86400

    if (secondsSinceLastClaim < secondsIn24Hours) {
      setTimeUntilNextClaim(secondsIn24Hours - secondsSinceLastClaim);
      setCanClaim(false); // Cannot claim yet
    } else {
      setTimeUntilNextClaim(0);
      setCanClaim(true); // Can claim reward
    }
  };

  // Fetch the last claimed time from the contract
  const claimRewards = async () => {
    setIsLoading(true);
    // Check if window.ethereum is available
    if (typeof window.ethereum === "undefined") {
      console.error(
        "Ethereum provider is not available. Make sure to install a Web3 wallet like MetaMask."
      );
      setIsLoading(false); 
      return;
    }
    // Ensure the user is on the correct network
    if (chainId !== 137 && chainId !== 1) {
      toast.error("Unsupported network. Please switch to Ethereum or Polygon.");
      setIsLoading(false);
      return;
    }
    const nftMarketContract = await getContract(
      walletProvider as ethers.Eip1193Provider,
      chainId
    );
    try {
      const tx = await nftMarketContract.claimTimTokenReward(
        vanityAddress
      );
      console.log("Transaction sent:", tx);
      await tx.wait();
      console.log("Transaction confirmed:", tx.hash);

      // Now update the NFT claim details in the database
      const response = await updateNFTClaimDetails(
        address!,
        modalContents.selectedNFT.tokenId,
        modalContents.selectedNFT.contractAddress!,
        new Date(),
        [tx.hash]
      );

      if (response) {
        setLastClaimedAt(new Date());
        setCanClaim(false);
        setTimeLeft(30);
        onClose();
      }
      toast.success("Claim successful!");
    } catch (error) {
      console.log("Error Claiming Rewards", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to fetch the last claim date from the database when the modal opens
  useEffect(() => {
    const fetchLastClaimedAt = async () => {
      const claimDetails: any = await getClaimDetails(
        address!,
        modalContents.selectedNFT.tokenId,
        modalContents.selectedNFT.contractAddress!
      );
      if (claimDetails !== null && claimDetails?.lastclaimedAt) {
        const lastClaimedDate = new Date(claimDetails.lastclaimedAt);
        setLastClaimedAt(lastClaimedDate);
        calculateTimeUntilNextClaim(lastClaimedDate);
      } else {
        setLastClaimedAt(null);
        setCanClaim(true);
      }
    };

    if (open && modalContents.selectedNFT.contractAddress!) {
      fetchLastClaimedAt();
    }
  }, [
    open,
    address,
    modalContents.selectedNFT.contractAddress,
    modalContents.selectedNFT.tokenId,
    setLastClaimedAt,
  ]);

  // Effect to handle the timer based on isPlaying state
  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    // Cleanup the interval when isPlaying changes or component unmounts
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, timeLeft]);

  // Reset the timer when the modal is opened
  useEffect(() => {
    if (open && canClaim) {
      setTimeLeft(30);
      setIsPlaying(false); // Ensure the timer doesn't start automatically
    } else {
      setIsPlaying(false); // Pause the timer when modal is closed
    }
  }, [open, canClaim]);

  // Effect to count down timeUntilNextClaim
  useEffect(() => {
    if (timeUntilNextClaim > 0) {
      const interval = setInterval(() => {
        setTimeUntilNextClaim((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timeUntilNextClaim]);

  // Function to resolve the short URL and set the full video URL
  useEffect(() => {
    const resolveUrl = async () => {
      if (modalContents.videoUrl) {
        try {
          console.log(
            "modalContent vedio URL----------------",
            modalContents.videoUrl
          );
          const response = await axios.get(
            `${server_api_base_url}/api/resolve-url`,
            {
              params: { shortUrl: modalContents.videoUrl },
            }
          );
          console.log("response============", response);
          console.log(
            "response url===================",
            response.data.resolvedUrl
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
    if (modalContents.videoUrl && !hasFetched) {
      resolveUrl();
      setHasFetched(true);
    }
  }, [modalContents.videoUrl, hasFetched, server_api_base_url]);

  // Reset hasFetched to false when modal is closed (optional)
  useEffect(() => {
    if (!open) {
      setHasFetched(false);
    }
  }, [open]);

  return (
    <>
      {isLoading && <Loader />}
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
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  <ReactPlayer
                    style={{
                      width: "100%",
                      height: "100%",
                      minHeight: "400px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
                    }}
                    width={"100%"}
                    controls={true}
                    // url={modalContents.videoUrl}
                    url={videoUrl}
                    loop={true}
                    playing={isPlaying}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    config={{
                      file: {
                        attributes: {
                          crossOrigin: "anonymous", // Allows cross-origin access if supported by server
                        },
                      },
                    }}
                  />

                  {/* <Button
                  variant="contained"
                  onClick={claimRewards}
                  disabled={timeLeft > 0 || !canClaim } // Disable based on 30s timer or 24h rule
                  sx={{
                    width: "100%",
                    m: 3,
                    p: 1,
                  }}
                >
                  {timeUntilNextClaim > 0
                    ? `Next Claim Reward After ${Math.floor(
                        timeUntilNextClaim / 3600
                      )}h ${Math.floor(
                        (timeUntilNextClaim % 3600) / 60
                      )}m ${Math.floor(timeUntilNextClaim % 60)}s`
                    : timeLeft > 0
                    ? `Claim Reward in ${timeLeft} Seconds`
                    : "Claim Reward"}
                </Button> */}
                  {isCorrectNetwork ? (
                    <Button
                      variant="contained"
                      onClick={claimRewards}
                      disabled={timeLeft > 0 || !canClaim}
                      sx={{
                        width: "100%",
                        m: 3,
                        p: 1,
                      }}
                    >
                      {timeUntilNextClaim > 0
                        ? `Next Claim Reward After ${Math.floor(
                            timeUntilNextClaim / 3600
                          )}h ${Math.floor(
                            (timeUntilNextClaim % 3600) / 60
                          )}m ${Math.floor(timeUntilNextClaim % 60)}s`
                        : timeLeft > 0
                        ? `Claim Reward in ${timeLeft} Seconds`
                        : "Claim Reward"}
                    </Button>
                  ) : (
                    <Typography
                      variant="h6"
                      color="textSecondary"
                      align="center"
                      sx={{ mt: 2 }}
                    >
                      You can only claim rewards on the connected network's
                      NFTs.
                    </Typography>
                  )}
                </Box>
              ) : modalContents.content ? (
                // Render custom content if available
                modalContents.content
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
    </>
  );
};

export default InteractMenuModals;
