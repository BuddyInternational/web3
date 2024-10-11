import React, { useState } from "react";
import {
  Modal,
  Fade,
  DialogTitle,
  IconButton,
  DialogContent,
  Box,
  TextField,
  Button,
} from "@mui/material";
import { IoClose } from "react-icons/io5";
import { useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers/react";
import { useVanityContext } from "../../../context/VanityContext";
import nftMarketAbi from "../../../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import { ethers } from "ethers";

const CDEReward: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  const { address } = useWeb3ModalAccount();
  const { vanityAddress } = useVanityContext();
  const { walletProvider } = useWeb3ModalProvider();
  const nftMarketContractAddress: string | undefined =
    process.env.REACT_APP_NFT_MARKET_CONTRACT_ADDRESS;
    const [loading, setLoading] = useState(false);
  const [inputValues, setInputValues] = useState({
    walletAddress: address,
    vanityAddress: vanityAddress,
    amount: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

    // Handle submit
  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
   
    console.log("Submitted values:", inputValues);
    if (typeof window.ethereum === "undefined") {
      console.error(
        "Ethereum provider is not available. Make sure to install a Web3 wallet like MetaMask."
      );
      setLoading(false);
      return;
    }
    const ethersProvider = new ethers.BrowserProvider(
      walletProvider as ethers.Eip1193Provider
    );
    const signer = await ethersProvider.getSigner();
    console.log("signer-------------",signer);
    const nftMarketContract = new ethers.Contract(
      nftMarketContractAddress!,
      nftMarketAbi.abi,
      signer
    );
    setLoading(true);
    try {
      // Convert the price from Ether to Wei
      const amountInEther = inputValues?.amount;
      if (typeof amountInEther === "string") {
        const amountInWei = ethers.parseEther(amountInEther);
        console.log("amountInWei-----------", amountInWei);

        const tx = await nftMarketContract.transferEthAndGetTestCDE(
          amountInEther,
          vanityAddress,{
            value: 0, // Pass the Ether amount
        }
        );
        console.log("Transaction sent:", tx);
        // Wait for the transaction to be confirmed
        await tx.wait();
        console.log("Transaction confirmed:", tx.hash);
      }
      
    } catch (error) {
      console.error("Error executing transaction:", error);
    }finally {
      setLoading(false); 
      onClose();
    }
  };

  return (
    <>
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
            Wrap your ETH for CDE
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
            <form onSubmit={handleSubmit}>
              <Box display="flex" flexDirection="column" gap={6}>
                <TextField
                  name="walletAddress"
                  label="Wallet Address"
                  variant="outlined"
                  fullWidth
                  slotProps={{
                    input: {
                      readOnly: true,
                    },
                  }}
                  defaultValue={address}
                />
                <TextField
                  name="vanityAddress"
                  label="Vanity Address"
                  variant="outlined"
                  fullWidth
                  slotProps={{
                    input: {
                      readOnly: true,
                    },
                  }}
                  defaultValue={vanityAddress}
                />
                <TextField
                  name="amount"
                  label="Amount"
                  variant="outlined"
                  fullWidth
                  type="number"
                  value={inputValues.amount}
                  onChange={handleChange}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Submit
                </Button>
              </Box>
            </form>
          </DialogContent>
        {loading && (
     <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-10 z-50">
     <div className="loader border-8 border-t-8 border-gray-300 border-t-white rounded-full w-12 h-12 animate-spin"></div>
   </div>
      )}
        </Box>
      </Fade>
    </Modal>
    </>
  );
};

export default CDEReward;
