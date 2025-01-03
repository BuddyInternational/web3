import {
  Box,
  Button,
  Checkbox,
  DialogContent,
  DialogTitle,
  Fade,
  FormControlLabel,
  IconButton,
  Modal,
  Typography,
} from "@mui/material";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import {
  checkExistingVanityAddress,
  generateVanityWallet,
  storeVanityWallet,
} from "../../../api/vanityAPI";
import { toast } from "react-toastify";
import { useGullyBuddyNotifier } from "../../../utils/GullyBuddyNotifier";
import { ethers } from "ethers";
import { useVanityAddressUpdate } from "../../../context/VanityAddressesListContext";
import { useLoader } from "../../../context/LoaderContext";
import Loader from "../../../utils/Loader";
import useContract from "../../../utils/useContract";

// vanity address suffix
const vanity_suffix: string | undefined = process.env.REACT_APP_VANITY_SUFFIX;

const Leadership: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  const [isChecked, setIsChecked] = useState(false);
  const { isLoading, setIsLoading } = useLoader();
  const { isConnected, address, chainId } = useWeb3ModalAccount();
  const { notifyGullyBuddy } = useGullyBuddyNotifier();
  const { walletProvider } = useWeb3ModalProvider();
  const { setTriggerVanityAddressUpdate } = useVanityAddressUpdate();
  const { getContract } = useContract();

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };

  const handleGenerateVanityAddress = async () => {
    if (isConnected && address) {
      setIsLoading(true);
      try {
        // Ensure the user is on the correct network
        if (chainId !== 137 && chainId !== 1) {
          toast.error(
            "Unsupported network. Please switch to Ethereum or Polygon."
          );
          setIsLoading(false);
          return;
        }

        // Check if the wallet already has a vanity address
        const existingAddress = await checkExistingVanityAddress(address);
        console.log("existingAddress==============", existingAddress);
        if (existingAddress && existingAddress.AxiosError) {
          const error = existingAddress.AxiosError;
          // Show toast based on the error type
          if (error.code === "ERR_NETWORK") {
            toast.error(error.message);
          } else if (error.code === "ERR_NO_RESPONSE") {
            toast.error("No response from the server. Please try again later.");
          } else {
            toast.error(`Error: ${error.message}`);
          }
        } else {
          // setVanityAddress(existingAddress.vanityAddress);
          // Generate a new vanity address
          const generateResponse = await generateVanityWallet(
            vanity_suffix!,
            1
          );
          if (generateResponse?.data?.[0]?.address) {
            const generatedAddress = generateResponse.data[0];
            // Store the generated address using the helper function
            const sender = address!;
            const message = `A new Vanity Address has been generated by the user with Wallet Address: **${address}**. The generated Vanity Address is: **${generatedAddress.address}**. © Gully Buddy International. All rights reserved.`;

            // const feesAmount = 10;
            const feesAmount = 0.5;
            const vanityAccountType = "Prestige";
            let notificationResult: any;
            // notificationResult = await notifyGullyBuddy(
            //   sender,
            //   message,
            //   feesAmount
            // );
            try {
              notificationResult = await notifyGullyBuddy(
                sender,
                message,
                feesAmount
              );
            } catch (error: any) {
              console.error("Error in notifyGullyBuddy:", error);
              toast.error(
                error.message ||
                  "Failed to send notification due to an unexpected error."
              );
              return;
            }
            console.log("notificationResult", notificationResult);
            if (notificationResult && notificationResult.notificationTxHash) {
              try {
                // Transfer Annotation Token to prestige Account
                // Instantiate the contract
                const nftMarketContract = await getContract(
                  walletProvider as ethers.Eip1193Provider,
                  chainId
                );
                const transferToken =
                  await nftMarketContract.transferANTokenToPrestige(
                    generatedAddress.address
                  );
                console.log("Transaction sent:", transferToken);
                // Wait for the transaction to be confirmed
                await transferToken.wait();
                console.log("Transaction confirmed:", transferToken.hash);
                toast.success(
                  "Transfer Annotation Token to Prestige Account Successfully!"
                );

                await storeVanityWallet(
                  address,
                  generatedAddress.address,
                  generatedAddress.privKey,
                  vanityAccountType
                );
                // setVanityAddress(generatedAddress.address);
                toast.success("Generate Prestige Account Successfully!");
                // Trigger the VanityAddressUpdate
                setTriggerVanityAddressUpdate((prev) => !prev);
              } catch (error: any) {
                console.error(
                  "Error in Transfering Annotation Token to Prestige Account:",
                  error
                );
                toast.error(
                  "Error in Transfering Annotation Token to Prestige Account"
                );
              }
            } else {
              // setIsLoading(false);
              toast.error(
                "Error sending notification and Generate vanity Address!"
              );
              setIsLoading(false);
              onClose();
              return;
            }
          } else {
            toast.error("Error Generate vanity Address!");
            setIsLoading(false);
            onClose();
            return;
          }
        }
      } catch (e) {
        console.error("Error in Generate Prestige Account:", e);
      } finally {
        setIsLoading(false);
        onClose();
      }
    }
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
              p: 3,
            }}
          >
            <DialogTitle
              sx={{ m: 0, p: 2, textAlign: "center" }}
              id="customized-dialog-title"
            >
              Liquidating Your Full Account Token NFT
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
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ marginBottom: 3 }}
              >
                To initiate the liquidation of your full account, you must
                provide the original developers with a complete snapshot of your
                account history at the time of liquidation. This process will
                not take long. Simply complete your request to join the
                waitlist, which will be processed accordingly. These requests
                may coincide with mass wallet payouts, which are conducted
                monthly or more frequently. All items, including those related
                to your <strong>Manager Role</strong> in collaboration with Web3
                Gully Buddy International, will be addressed as part of this
                process.
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ marginBottom: 3 }}
              >
                - Any of your <strong>"Gully Buddy International NFTs"</strong>,
                including those in your personal wallet or those wrapped
                <br />
                - Your "Tokens that are currently wrapped at the time of
                request"
                <br />
                - User generated content participation rewards
                <br />
                - Your externally Wrapped NFTs
                <br />- Any items linked to your provided vanity address
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ marginBottom: 2 }}
              >
                a report is issued on the available Annotation Prestige for
                those interested in the information.
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ marginBottom: 2 }}
              >
                Once your account request has been validated and approved by the
                organization, your vanity will be listed on the marketplace.
                Your account will enter hibernation mode, and funds will be made
                available. You may resume your journey at any time, and the
                marketplace will send the proceeds to your personal wallet.
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ marginBottom: 2 }}
              >
                Within four days, you will be able to claim an additional
                wallet, allowing you to resume your journey. You will now have
                more than one "vanity address" associated with the organization.
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ marginBottom: 3 }}
              >
                <strong>Prestige NFTs</strong> are based on endorsement
                agreements for <strong>"Managers"</strong> of the Gully Buddy
                International organization’s partners. They can be issued to you
                at any time based on user-contributed and/or generated content,
                participation earnings, or interactions with{" "}
                <strong>"Team Members"</strong> NFTs. These are distributed
                daily or monthly and may be limited to special events, which can
                vary.
              </Typography>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                    color="primary"
                  />
                }
                sx={{ marginBottom: 3 }}
                label="If you would like to proceed to liquidate items in prestige vanity by marketplace."
              />

              <Button
                variant="contained"
                color="primary"
                onClick={handleGenerateVanityAddress}
              >
                Prestige Your Account Now
              </Button>
            </DialogContent>
            {/* {isLoading && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-10 z-50">
              <div className="loader border-8 border-t-8 border-gray-300 border-t-white rounded-full w-12 h-12 animate-spin"></div>
            </div>
          )} */}
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default Leadership;
