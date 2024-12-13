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
import { useBalanceUpdate } from "../../../context/BalanceUpdateContext";
import { useLoader } from "../../../context/LoaderContext";
import Loader from "../../../utils/Loader";
import { checkExistingVanityAddress } from "../../../api/vanityAPI";

const CDEReward: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  const { address, chainId } = useWeb3ModalAccount();
  const { vanityAddress } = useVanityContext();
  const { walletProvider } = useWeb3ModalProvider();
  const { setTriggerUpdate } = useBalanceUpdate();
  const nftMarketContractAddress: string | undefined =
    process.env.REACT_APP_NFT_MARKET_CONTRACT_ADDRESS;
  const { isLoading, setIsLoading } = useLoader();
  const [mainVanityAccount, setMainVanityAccount] = useState<string | null>(null);
  const [inputValues, setInputValues] = useState({
    walletAddress: address,
    vanityAddress: null,
    amount: "",
    selectedChain: "Ethereum", // Default chain
    selectedToken: 0, // Default token
    receiver: 0, // Default receiver
  });

  // Fetch Main Vanity Account when modal opens
  useEffect(() => {
    const fetchMainVanityAccount = async () => {
      try {
        const existingAddress = await checkExistingVanityAddress(address!); // Fetch vanity data
        console.log("existingAddress: ", existingAddress);

        // Find the Main Vanity Account
        const mainAccount = existingAddress?.vanityDetails?.find(
          (detail:any) => detail.vanityAccountType === "Main"
        );

        if (mainAccount) {
          setMainVanityAccount(mainAccount.vanityAddress);
          setInputValues((prev) => ({
            ...prev,
            vanityAddress: mainAccount.vanityAddress,
          }));
        } else {
          console.warn("No Main Vanity Account found for the address.");
          setMainVanityAccount(null);
        }
      } catch (error) {
        console.error("Error fetching Main Vanity Account: ", error);
        setMainVanityAccount(null);
      }
    };

    if (open) {
      fetchMainVanityAccount();
    }
  }, [open, address]);

  // network explorer
  const networkExplorers: any = {
    1: "https://etherscan.io/tx/", // Mainnet
    11155111: "https://sepolia.etherscan.io/tx/", // Sepolia
    137: "https://polygonscan.com/tx/", // Polygon Mainnet
    80001: "https://mumbai.polygonscan.com/tx/", // Polygon Testnet
    42161: "https://arbiscan.io/tx/", // Arbitrum One
  };

  // get ExplorerLink
  const getExplorerLink = async (transactionHash: string) => {
    if (typeof window.ethereum === "undefined") {
      throw new Error("Ethereum provider is not available");
    }

    const ethersProvider = new ethers.BrowserProvider(walletProvider!);
    const network = await ethersProvider.getNetwork();
    const chainId = network.chainId.toString();

    const baseExplorerUrl = networkExplorers[chainId];
    if (!baseExplorerUrl) {
      throw new Error("Network explorer URL not configured for this chain");
    }

    return `${baseExplorerUrl}${transactionHash}`;
  };

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
      | React.ChangeEvent<HTMLInputElement | { name?: string; value: string }>
      | SelectChangeEvent<number>
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
    if (receiver === 1) {
      if (selectedToken === 0) return "4% discount on CDE token";
      if (selectedToken === 1) return "9.5% discount on TIM token";
      if (selectedToken === 2) return "No discount available on AN token";
    }
    return "No discount available for Wallet Address";
  };

  // Determine the text color based on the receiver
  const getDiscountColor = () => {
    const { receiver } = inputValues;
    return receiver === 1 ? "green" : "red";
  };

  // Handle submit the wrap CDE or TIM or AN token purchase
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Submitted values:", inputValues);
    setIsLoading(true);
    if (typeof window.ethereum === "undefined") {
      console.error(
        "Ethereum provider is not available. Make sure to install a Web3 wallet like MetaMask."
      );
      setIsLoading(false);
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

    try {
      // Convert the price from Ether to Wei
      const amountInEther = inputValues?.amount;
      console.log("amountInEther--------", amountInEther);
      const tokenType = inputValues?.selectedToken;
      console.log("tokenType---------", tokenType);
      const receiverType = inputValues?.receiver;
      console.log("receiverType-----------", receiverType);

      const targetAddress =
        receiverType === 0
          ? inputValues.walletAddress
          : inputValues.vanityAddress;

      // Ensure parameters are valid
      if (!targetAddress || !amountInEther) {
        toast.error("Please fill in all required fields.");
        setIsLoading(false);
        return;
      }

      console.log("targetAddress============",targetAddress);

      if (typeof amountInEther === "string") {
        const amountInWei = ethers.parseEther(amountInEther);
        console.log("amountInWei-----------", Number(amountInWei));

        const tx = await nftMarketContract.purchaseToken(
          amountInWei,
          targetAddress,
          tokenType,
          receiverType,
          {
            value: amountInWei, // Pass the Ether amount
            // gasLimit: 300000,
          }
        );
        console.log("Transaction sent:", tx);
        // Wait for the transaction to be confirmed
        await tx.wait();
        // Trigger the balance update
        setTriggerUpdate((prev) => !prev);
        console.log("Transaction confirmed:", tx.hash);
        // Explorer link
        const explorerLink = await getExplorerLink(tx.hash);

        // Success toast with redirect link
        toast.success(
          <span>
            Transaction Confirmed! View on{" "}
            <a
              href={explorerLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "lightblue", textDecoration: "underline" }}
            >
              Explorer
            </a>
          </span>,
          {
            onClick: () => window.open(explorerLink, "_blank"),
          }
        );
      }
    } catch (error: any) {
      console.error("Error from contract:", error);
      if (error?.reason) {
        console.error("Revert reason:", error.reason);
        console.error("Revert reason message:", error?.info?.error?.message);

        const explorerLink = await getExplorerLink(error?.transaction?.hash);

        // Failure toast with explorer link
        toast.error(
          <span>
            {`Reason: ${
              error?.info?.error?.message || "An unknown error occurred."
            } `}
            {error?.transaction?.hash && (
              <>
                View on{" "}
                <a
                  href={explorerLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "lightblue", textDecoration: "underline" }}
                >
                  Explorer
                </a>
              </>
            )}
          </span>,
          {
            onClick: () => window.open(explorerLink, "_blank"),
          }
        );
        // toast.error(`Reason: ${error?.info?.error?.message || "An unknown error occurred"}`);
      } else if (error?.receipt) {
        const transactionHash = error.receipt?.hash;
        const explorerLink = await getExplorerLink(transactionHash);

        toast.error(
          <span>
            {`Error Purchasing Tokens. Please check the transaction details.`}
            {transactionHash && (
              <>
                {" "}
                View on{" "}
                <a
                  href={explorerLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "lightblue", textDecoration: "underline" }}
                >
                  Explorer
                </a>
              </>
            )}
          </span>,
          {
            onClick: () => window.open(explorerLink, "_blank"),
          }
        );
      } else {
        console.error("Error Purchasing Tokens.");
        toast.error("Error Purchasing Tokens,");
      }
    } finally {
      setIsLoading(false);
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
      {isLoading && <Loader />}

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
                      // onChange={handleChange}
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
                      <MenuItem value={0}>CDE</MenuItem>
                      <MenuItem value={1}>TIM</MenuItem>
                      <MenuItem value={2}>AN</MenuItem>
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
                      <MenuItem value={0}>
                        Your Wallet Address
                        <span className="ml-2">
                          ({formatAddress(inputValues.walletAddress)})
                        </span>
                      </MenuItem>
                      {/* <MenuItem value={1}>
                        Your Vanity Address
                        <span className="ml-2">
                          ({formatAddress(inputValues.vanityAddress)})
                        </span>
                      </MenuItem> */}
                      {mainVanityAccount && (
                        <MenuItem value={1}>
                          Your Main Vanity Address
                          <span className="ml-2">
                            ({formatAddress(mainVanityAccount)})
                          </span>
                        </MenuItem>
                      )}
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
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default CDEReward;
