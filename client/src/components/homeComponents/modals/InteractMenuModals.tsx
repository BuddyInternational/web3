import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import {
  Button,
  DialogContent,
  DialogTitle,
  Fade,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { IoClose } from "react-icons/io5";
import ReactPlayer from "react-player";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { useVanityContext } from "../../../context/VanityContext";
import { ethers } from "ethers";
import nftMarketAbi from "../../../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import { ERC721ABI } from "../../../utils/ABI";
import { ERC1155ABI } from "../../../utils/ABI";
import { NFTData } from "../../../utils/Types";

interface ModalContents {
  title: string;
  description: string;
  videoUrl?: string;
  content: any;
  nftDetail: NFTData;
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
  // console.log("modelContents===================", modalContents);
  const { address } = useWeb3ModalAccount();
  const { vanityAddress } = useVanityContext();
  const { walletProvider } = useWeb3ModalProvider();
  const nftMarketContractAddress: string | undefined =
    process.env.REACT_APP_NFT_MARKET_CONTRACT_ADDRESS;
  const [inputValues, setInputValues] = useState({
    walletAddress: address,
    vanityAddress: vanityAddress,
    contractAddress: modalContents.nftDetail.contractAddress,
    tokenId: modalContents.nftDetail.tokenId,
    chainName: modalContents.nftDetail.chainName,
    name: modalContents.nftDetail.name,
    tokenType: modalContents.nftDetail.tokenType,
    floorPriceEther: modalContents.nftDetail.floorPrice,
    floorPriceUsd: modalContents.nftDetail.floorPriceUsd,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Update inputValues when modalContents changes
  useEffect(() => {
    if (open) {
      setInputValues((prevValues) => ({
        ...prevValues,
        walletAddress: address,
        vanityAddress: vanityAddress,
        contractAddress: modalContents.nftDetail.contractAddress,
        tokenId: modalContents.nftDetail.tokenId,
        chainName: modalContents.nftDetail.chainName,
        name: modalContents.nftDetail.name,
        tokenType: modalContents.nftDetail.tokenType,
        floorPriceEther: modalContents.nftDetail.floorPrice,
        floorPriceUsd: modalContents.nftDetail.floorPriceUsd,
      }));
    }
  }, [open, address, vanityAddress, modalContents]);

  // handle change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  // nft form submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitted values:", inputValues);
    // Check if window.ethereum is available
    if (typeof window.ethereum === "undefined") {
      console.error(
        "Ethereum provider is not available. Make sure to install a Web3 wallet like MetaMask."
      );
      return;
    }
    setIsLoading(true);
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
      const tokenStandard: string | undefined = inputValues?.tokenType;
      console.log("tokenStandard------------", tokenStandard);
      // Approve the NFT to the smart contract
      if (tokenStandard === "ERC721") {
        console.log("Approving ERC721 NFT...");
        const nftContract = new ethers.Contract(
          inputValues.contractAddress!,
          ERC721ABI,
          signer
        );
        console.log("-----------1");
        const approvalTx = await nftContract.approve(
          nftMarketContractAddress,
          inputValues.tokenId
        );
        console.log("Approval transaction sent:", approvalTx);
        await approvalTx.wait();
        console.log("Approval transaction confirmed:", approvalTx.hash);
      } else if (tokenStandard === "ERC1155") {
        console.log("Approving ERC1155 NFT...");
        const nftContract = new ethers.Contract(
          inputValues.contractAddress!,
          ERC1155ABI,
          signer
        );
        console.log("-----------2");
        const approvalTx = await nftContract.setApprovalForAll(
          nftMarketContractAddress,
          true
          // { gasLimit: ethers.utils.hexlify(100000) }
          // {gasLimit: ethers.hexlify(100000)}
        );
        console.log("Approval transaction sent:", approvalTx);
        await approvalTx.wait();
        console.log("Approval transaction confirmed:", approvalTx.hash);
      } else {
        console.error("Invalid token standard:", inputValues.tokenType);
        return;
      }

      // Call the transferNFTAndPay function

      // Convert the price from Ether to Wei
      const floorPriceEther = inputValues?.floorPriceEther;
      if (typeof floorPriceEther === "string") {
        const priceInWei = ethers.parseEther(floorPriceEther);
        console.log("priceInWei-----------", priceInWei);

        const tx = await nftMarketContract.transferNFTAndPay(
          address,
          inputValues.contractAddress!,
          inputValues.tokenId,
          tokenStandard,
          priceInWei
        );
        console.log("Transaction sent:", tx);
        // Wait for the transaction to be confirmed
        await tx.wait();
        console.log("Transaction confirmed:", tx.hash);
      }
    } catch (error) {
      console.error("Error executing transaction:", error);
    } finally {
      setIsLoading(false);
    }
    onClose();
  };

  return (
    <>
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
              {/* {modalContents.videoUrl ? (
              <ReactPlayer
                style={{
                  width:"100%",
                  height: "100%",
                  minHeight: "400px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  boxShadow: "0px 4px 12px rgba(0,0,0,01)",
                }}
                controls={true}
                url={modalContents.videoUrl}
                loop={true}
                playing={true}
              />
            ) */}
              {modalContents.nftDetail &&
              modalContents.nftDetail.contractAddress ? (
                <>
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
                        // value={inputValues.walletAddress}
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
                        // value={inputValues.vanityAddress}
                      />
                      <TextField
                        name="contractAddress"
                        label="Contract Address"
                        variant="outlined"
                        fullWidth
                        slotProps={{
                          input: {
                            readOnly: true,
                          },
                        }}
                        defaultValue={
                          modalContents?.nftDetail?.contractAddress || ""
                        }
                        // value={inputValues.contractAddress}
                      />

                      <Grid container spacing={2}>
                        <Grid size={{ xs: 6, md: 8 }}>
                          <TextField
                            name="tokenId"
                            label="Token ID"
                            variant="outlined"
                            fullWidth
                            defaultValue={
                              modalContents?.nftDetail?.tokenId || ""
                            }
                            // value={inputValues.tokenId}
                            slotProps={{
                              input: {
                                readOnly: true,
                              },
                            }}
                          />
                        </Grid>
                        <Grid size={{ xs: 6, md: 4 }}>
                          <TextField
                            name="chainName"
                            label="Chain Name"
                            variant="outlined"
                            fullWidth
                            defaultValue={
                              modalContents?.nftDetail?.chainName || ""
                            }
                            // value={inputValues.chainName}
                            slotProps={{
                              input: {
                                readOnly: true,
                              },
                            }}
                          />
                        </Grid>
                      </Grid>
                      <Grid
                        container
                        rowSpacing={1}
                        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                      >
                        <Grid size={6}>
                          <TextField
                            name="nftName"
                            label="NFT Name"
                            variant="outlined"
                            fullWidth
                            defaultValue={
                              modalContents?.nftDetail?.name || "Name not found"
                            }
                            // value={inputValues.name || "Name not found"}
                            slotProps={{
                              input: {
                                readOnly: true,
                              },
                            }}
                          />
                        </Grid>
                        <Grid size={6}>
                          <TextField
                            name="tokenType"
                            label="Token Standard"
                            variant="outlined"
                            fullWidth
                            defaultValue={
                              modalContents?.nftDetail?.tokenType || ""
                            }
                            // value={inputValues.tokenType}
                            slotProps={{
                              input: {
                                readOnly: true,
                              },
                            }}
                          />
                        </Grid>
                      </Grid>
                      {/* price */}
                      <Grid
                        container
                        rowSpacing={1}
                        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                      >
                        <Grid size={6}>
                          <TextField
                            name="floorPriceEther"
                            label="Floor Price Ether"
                            variant="outlined"
                            fullWidth
                            type="number"
                            value={inputValues.floorPriceEther}
                            onChange={handleChange}
                          />
                        </Grid>
                        <Grid size={6}>
                          <TextField
                            name="floorPriceUsd"
                            label="Floor Price USD"
                            variant="outlined"
                            fullWidth
                            type="number"
                            value={inputValues.floorPriceUsd}
                            // onChange={handleChange}
                          />
                        </Grid>
                      </Grid>

                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                      >
                        SELL NFT
                      </Button>
                    </Box>
                  </form>
                </>
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
