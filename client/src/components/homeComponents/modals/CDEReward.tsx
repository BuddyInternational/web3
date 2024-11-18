import React, { useEffect, useState } from "react";
import {
  Modal,
  Fade,
  DialogTitle,
  IconButton,
  DialogContent,
  Box,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import { IoClose } from "react-icons/io5";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { useVanityContext } from "../../../context/VanityContext";
import nftMarketAbi from "../../../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import { ethers } from "ethers";
import { toast } from "react-toastify";

const CDEReward: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  const { address, chainId } = useWeb3ModalAccount();
  console.log("chainId========", chainId);
  const { vanityAddress } = useVanityContext();
  const { walletProvider } = useWeb3ModalProvider();
  const nftMarketContractAddress: string | undefined =
    process.env.REACT_APP_NFT_MARKET_CONTRACT_ADDRESS;

  const [loading, setLoading] = useState(false);
  const [inputValues, setInputValues] = useState({
    walletAddress: address,
    vanityAddress: vanityAddress,
    amount: "",
    selectedChain: "Ethereum", // Default chain
    selectedToken: "CDE", // Default token
    receiver: "walletAddress", // Default receiver
  });

  useEffect(() => {
    // Mapping chainId to chain names
    const chainMapping: any = {
      1: "Ethereum",
      137: "Polygon",
      42161: "Arbitrum",
      11155111: "Sepolia",
    };
    if (chainId) {
      const selectedChain = chainMapping[chainId] || "Ethereum";
      setInputValues((prevValues) => ({
        ...prevValues,
        selectedChain,
      }));
    }
  }, [chainId]);

  // Updated handleChange function
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
      | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    setInputValues((prevValues) => ({
      ...prevValues,
      [name!]: value,
    }));
  };

  // Calculate discount
  const getDiscountText = () => {
    const { receiver, selectedToken } = inputValues;
    if (receiver === "vanityAddress") {
      if (selectedToken === "CDE") return "4% discount on CDE token";
      if (selectedToken === "TIM") return "9.5% discount on TIM token";
    }
    return "No discount available for Wallet Address";
  };

  // Determine the text color based on the receiver
  const getDiscountColor = () => {
    const { receiver } = inputValues;
    return receiver === "vanityAddress" ? "green" : "red";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
    console.log("signer===========", signer);
    const nftMarketContract = new ethers.Contract(
      nftMarketContractAddress!,
      nftMarketAbi.abi,
      signer
    );

    console.log("nftMarketContract============", nftMarketContract);
    setLoading(true);
    try {
      // Convert the price from Ether to Wei
      const amountInEther = inputValues?.amount;
      console.log("amountInEther--------", amountInEther);
      const tokenType = inputValues?.selectedToken;
      console.log("tokenType---------", tokenType);
      const receiverType = inputValues?.receiver;
      console.log("receiverType-----------", receiverType);

      if (typeof amountInEther === "string") {
        const amountInWei = ethers.parseEther(amountInEther);
        console.log("amountInWei-----------", Number(amountInWei));

        const tx = await nftMarketContract.transferEthAndGetTestCDEOrTestTIM(
          amountInWei,
          vanityAddress,
          tokenType,
          receiverType,
          {
            value: 0, // Pass the Ether amount
            gasLimit: 800000,
          }
        );
        console.log("Transaction sent:", tx);
        // Wait for the transaction to be confirmed
        await tx.wait();
        console.log("Transaction confirmed:", tx.hash);
      }
    } catch (error: any) {
      // console.error("Error from contract:", error);
      // console.error("Transaction error:", error.reason);
      console.error("Error from contract:", error);
      // if(error?.message){
      //   console.error("Error message:", error.message.error.message);
      //   toast.error("Error message:", error?.message);
      // }
      if (error?.reason) {
        console.error("Revert reason:", error.reason);
        toast.error("Revert reason:", error.reason);
      } else {
        console.error(
          "Error Purchasing Tokens,Please check the transaction details in the explorer."
        );
        toast.error(
          "Error Purchasing Tokens,Please check the transaction details in the explorer."
        );
      }
    } finally {
      setLoading(false);
      onClose();
    }
  };
  // Helper function to slice the address
  const formatAddress = (address: any) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
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
              zIndex: 2000,
              p: 3,
            }}
          >
            <DialogTitle
              sx={{ m: 0, p: 2, textAlign: "center" }}
              id="customized-dialog-title"
            >
              Purchase and/or Wrap your CDE for % off Market Price!
            </DialogTitle>
            <IconButton
              aria-label="close"
              onClick={onClose}
              sx={(theme) => ({
                position: "absolute",
                right: 12,
                top: 10,
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
                  {/* Chain Dropdown */}

                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Chain</InputLabel>
                    <Select
                      name="selectedChain"
                      value={inputValues.selectedChain}
                      onChange={handleChange}
                      label="Chain"
                      inputProps={{ readOnly: true }}
                      disabled
                    >
                      <MenuItem value="Ethereum">Ethereum</MenuItem>
                      <MenuItem value="Polygon">Polygon</MenuItem>
                      <MenuItem value="Arbitrum">Arbitrum</MenuItem>
                      <MenuItem value="Sepolia">Sepolia</MenuItem>
                    </Select>
                  </FormControl>

                  {/* Token Dropdown */}
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Token</InputLabel>
                    <Select
                      name="selectedToken"
                      value={inputValues.selectedToken}
                      onChange={handleChange}
                      label="Token"
                    >
                      <MenuItem value="CDE">CDE</MenuItem>
                      <MenuItem value="TIM">TIM</MenuItem>
                    </Select>
                  </FormControl>

                  {/* Receiver Address Dropdown */}
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Receiver Address</InputLabel>
                    <Select
                      name="receiver"
                      value={inputValues.receiver}
                      onChange={handleChange}
                      label="Receiver Address"
                    >
                      <MenuItem value="walletAddress">
                        Your Wallet Address
                        <span className="ml-2">
                          ({formatAddress(inputValues.walletAddress)})
                        </span>
                      </MenuItem>
                      <MenuItem value="vanityAddress">
                        Your Vanity Address
                        <span className="ml-2">
                          ({formatAddress(inputValues.vanityAddress)})
                        </span>
                      </MenuItem>
                    </Select>
                    {/* Display Discount */}
                    <Box mt={1} textAlign="left" color={getDiscountColor()}>
                      {getDiscountText()}
                    </Box>
                  </FormControl>

                  {/* Amount */}
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
