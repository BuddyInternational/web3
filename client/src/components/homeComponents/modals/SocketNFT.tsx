import {
  Box,
  DialogContent,
  DialogTitle,
  Fade,
  IconButton,
  Modal,
} from "@mui/material";
import React, { useState,useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { NFTData } from "../../../utils/Types";
import ModalNFTCard from "../card/ModalNFTCard";
import CardChainFilterMenus from "../card/CardChainFilterMenus";
import { ethers } from "ethers";
import {
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";

const SocketNFT: React.FC<{
  open: boolean;
  onClose: () => void;
  NFTDetails: NFTData[];
}> = ({ open, onClose, NFTDetails }) => {
  console.log("NFTDetails--------------",NFTDetails);
  const [connectedNetwork, setConnectedNetwork] = useState<string | null>(null);
  const [selectedChain, setSelectedChain] = useState<string>("All");
  const { walletProvider } = useWeb3ModalProvider();


  useEffect(() => {
    const getConnectedNetwork = async () => {
      if (typeof window.ethereum !== "undefined") {
        const ethersProvider = new ethers.BrowserProvider(
          walletProvider as ethers.Eip1193Provider
        );
        const network= await ethersProvider.getNetwork();
        setConnectedNetwork(network.name.toLowerCase()); // e.g., "mainnet", "rinkeby"
      } else {
        console.error("Ethereum provider is not available.");
      }
    };
    getConnectedNetwork();
  }, []);

  // Get unique chains from NFTDetails
  const uniqueChains: string[] = Array.from(
    new Set(
      NFTDetails.map((nft) => nft.chainName).filter(
        (chain): chain is string => chain !== undefined
      )
    )
  );

  // Filter NFTs based on selected chain
  // const filteredNFTDetails =
  //   selectedChain === "All"
  //     ? NFTDetails
  //     : NFTDetails.filter((nft) => nft.chainName === selectedChain);
  console.log(connectedNetwork);

  const filteredNFTDetails = NFTDetails.filter(
    (nft) =>
      nft.chainName?.toLowerCase() === connectedNetwork &&
      (selectedChain === "All" || nft.chainName === selectedChain)
  );

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
            // width: { xs: "70%", sm: "70%", md: "55%", lg: "45%", xl: "35%" },
            width: {
              xs: "99vw",
              sm: "80vw",
              md: "70vw",
              lg: "70vw",
              xl: "50vw",
            },
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
            Select NFT to Socket 
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
            {/* Dropdown for filtering by chain */}
            <div className="flex justify-end sm: mb-1 md:mb-3 container mx-auto px-4 gap-2">
              {/* <label
                htmlFor="chainSelect"
                className="text-md font-bold text-[#191818] sm:py-2 md:py-4 "
              >
                Filter by Chain:
              </label>
              <CardChainFilterMenus
                uniqueChains={uniqueChains}
                selectedChain={selectedChain}
                setSelectedChain={setSelectedChain}
                component="SocketNFT"
              /> */}
            </div>
            {filteredNFTDetails.map((nft, index) => (
              <ModalNFTCard
                key={index}
                nft={nft}
                onClose={onClose}
              />
            ))}
          </DialogContent>
        </Box>
      </Fade>
    </Modal>
  );
};

export default SocketNFT;
