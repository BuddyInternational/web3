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
import nftMarketAbi from '../../../artifacts/contracts/NFTMarket.sol/NFTMarket.json';

interface ModalContents {
  title: string;
  description: string;
  videoUrl?: string;
  content: any;
}

interface CustomModalProps {
  open: boolean;
  onClose: () => void;
  modalContents: ModalContents;
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
}) => {
  const { address } = useWeb3ModalAccount();
  const { vanityAddress } = useVanityContext();
  const { walletProvider } = useWeb3ModalProvider();
  const nftMarketContractAddress: string | undefined =
    process.env.REACT_APP_NFT_MARKET_CONTRACT_ADDRESS;

  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const claimRewards = async () => {
    // Check if window.ethereum is available
    if (typeof window.ethereum === "undefined") {
      console.error(
        "Ethereum provider is not available. Make sure to install a Web3 wallet like MetaMask."
      );
      return;
    }
    const ethersProvider = new ethers.BrowserProvider(
      walletProvider as ethers.Eip1193Provider
    );
    const signer = await ethersProvider.getSigner();
    console.log("signer-------------", signer);
    const nftMarketContract = new ethers.Contract(
      nftMarketContractAddress!,
      nftMarketAbi.abi,
      signer
    );
    try {
      // alert("Claim rewards called");
      const claimTokenAmount = ethers.parseUnits("10", 18);
      console.log("claimTokenAmount---------",claimTokenAmount);
        const tx = await nftMarketContract.claimTimTokenReward(
          claimTokenAmount,
          vanityAddress,
          // { gasLimit: 500000 }
        );
        console.log("Transaction sent:", tx);
        // Wait for the transaction to be confirmed
        await tx.wait();
        console.log("Transaction confirmed:", tx.hash);  
      
    } catch (error) {
      console.log("Error Claiming Rewards", error);
    }
  };

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
    if (open) {
      setTimeLeft(30);
      setIsPlaying(false); // Ensure the timer doesn't start automatically
    } else {
      setIsPlaying(false); // Pause the timer when modal is closed
    }
  }, [open]);

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
                  url={modalContents.videoUrl}
                  loop={true}
                  playing={isPlaying}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
                <Button
                  variant="contained"
                  onClick={claimRewards}
                  disabled={timeLeft > 0}
                  sx={{
                    width: "100%",
                    m: 3,
                    p: 1,
                  }}
                >
                  Claim Reward {timeLeft > 0 && "in "}
                  {timeLeft > 0 && timeLeft}
                  {timeLeft > 0 && " Seconds"}
                </Button>
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
  );
};

export default InteractMenuModals;
