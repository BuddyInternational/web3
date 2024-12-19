import {
  Box,
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import {
  checkExistingVanityAddress,
  deleteVanityAddress,
  storeVanityWallet,
} from "../../api/vanityAPI";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { updateVanityUserContentWalletForVanityTransfer } from "../../api/userContentAPI";
import { updateVanityStoryLineContentWalletForVanityTransfer } from "../../api/storyLineContentAPI";
import { useLoader } from "../../context/LoaderContext";
import Loader from "../../utils/Loader";
import { toast } from "react-toastify";
import { useVanityAddressUpdate } from "../../context/VanityAddressesListContext";
import { useGullyBuddyNotifier } from "../../utils/GullyBuddyNotifier";
import { updateVanityScreenWriteContentWalletForVanityTransfer } from "../../api/screenWriteContentAPI";

const SendVanityDataModal: React.FC<{
  open: boolean;
  onClose: () => void;
  vanityAddresses: { vanityAddress: string; vanityAccountType: string }[];
}> = ({ open, onClose, vanityAddresses }) => {
  const { address } = useWeb3ModalAccount();
  const [selectedVanityAddress, setSelectedVanityAddress] = useState("");
  const { setTriggerVanityAddressUpdate } = useVanityAddressUpdate();
  const { notifyGullyBuddy } = useGullyBuddyNotifier();
  const [walletAddress, setWalletAddress] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [walletError, setWalletError] = useState("");
  const [vanityError, setVanityError] = useState("");
  const [agreeError, setAgreeError] = useState("");
  const { isLoading, setIsLoading } = useLoader();

  // Handle Wallet Address Validation (as user types)
  const handleWalletAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setWalletAddress(value);
    const walletRegex = /^(0x)?[0-9a-fA-F]{40}$/;

    if (!value) {
      setWalletError("Wallet address is required");
    } else if (!walletRegex.test(value)) {
      setWalletError(
        "Invalid wallet address. Please enter a valid Ethereum address."
      );
    } else {
      setWalletError("");
    }
  };

  // Handle Dropdown Selection
  const handleVanityAddressChange = (
    e: React.ChangeEvent<{ value: unknown }>
  ) => {
    const value = e.target.value as string;
    setSelectedVanityAddress(value);
    if (!value) {
      setVanityError("select vanity address");
    } else {
      setVanityError("");
    }
  };

  // Handle Checkbox Validation
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.checked;
    setAgreed(value);
    if (value === false) {
      setAgreeError("Please Check the Teams and Condition.");
    } else {
      setAgreeError("");
    }
  };

  // Handle submit Vanity Data to Wallet Address
  const handleSubmit = async () => {
    setIsLoading(true);

    // Validation for required fields
    if (!selectedVanityAddress) {
      setVanityError("Select a vanity address");
      setIsLoading(false);
      return;
    }
    if (!walletAddress) {
      setWalletError("Wallet address is required");
      setIsLoading(false);
      return;
    }
    if (!agreed) {
      setAgreeError("You must agree to the terms");
      setIsLoading(false);
      return;
    }

    // Array to hold rollback functions
    let rollbackActions = [];

    try {
      // Step 1: Fetch existing vanity address details
      const existingAddress = await checkExistingVanityAddress(address!);
      if (existingAddress && existingAddress.AxiosError) {
        // toast.error("Vanity address does not exist.");
        return;
      }

      const selectedVanityDetail = existingAddress.vanityDetails.find(
        (detail: any) => detail.vanityAddress === selectedVanityAddress
      );

      if (!selectedVanityDetail) {
        // toast.error("Selected vanity address not found.");
        return;
      }

      // Step 2: Delete the existing vanity address
      const deleteResponse = await deleteVanityAddress(
        address!,
        selectedVanityAddress
      );
      if (!deleteResponse) {
        // throw new Error("Failed to delete vanity address.");
        return;
      }

      // Add rollback for deleting the vanity address
      rollbackActions.push(async () =>
        storeVanityWallet(
          address!,
          selectedVanityDetail.vanityAddress,
          selectedVanityDetail.vanityPrivateKey,
          selectedVanityDetail.vanityAccountType
        )
      );

      // Step 3: Insert vanity details into the new wallet
      const updateVanityDetailsResponse = await storeVanityWallet(
        walletAddress,
        selectedVanityDetail.vanityAddress,
        selectedVanityDetail.vanityPrivateKey,
        selectedVanityDetail.vanityAccountType
      );
      if (!updateVanityDetailsResponse) {
        // throw new Error("Failed to store vanity wallet details.");
        return;
      }
      console.log(updateVanityDetailsResponse.message);

      // Add rollback for storing vanity details
      rollbackActions.push(async () =>
        deleteVanityAddress(walletAddress, selectedVanityAddress)
      );

      // Step 4: Update user-generated content
      await updateVanityUserContentWalletForVanityTransfer(
        selectedVanityAddress,
        walletAddress
      );
      rollbackActions.push(async () =>
        updateVanityUserContentWalletForVanityTransfer(
          selectedVanityAddress,
          address!
        )
      );

      // Step 5: Update storyline content
      await updateVanityStoryLineContentWalletForVanityTransfer(
        selectedVanityAddress,
        walletAddress
      );
      rollbackActions.push(async () =>
        updateVanityStoryLineContentWalletForVanityTransfer(
          selectedVanityAddress,
          address!
        )
      );

      // Step 6: Update screen write content
      await updateVanityScreenWriteContentWalletForVanityTransfer(
        selectedVanityAddress,
        walletAddress
      );
      rollbackActions.push(async () =>
        updateVanityScreenWriteContentWalletForVanityTransfer(
          selectedVanityAddress,
          address!
        )
      );

      // Step 7: Send OnChain Message when transfer Vanity Details
      const sender = address!;
      const message = `The vanity Address "${selectedVanityAddress}" transfer Vanity Account to this wallet Address "${walletAddress}"`;
      const feesAmount = 75;
      // const feesAmount = 0.5;

      const notificationResult = await notifyGullyBuddy(
        sender,
        message,
        feesAmount
      );

      if (!notificationResult || !notificationResult.notificationTxHash) {
        toast.error("Failed to send on-chain message.");
        // Rollback changes in reverse order
        for (const rollback of rollbackActions.reverse()) {
          try {
            await rollback();
          } catch (rollbackError) {
            console.error("Rollback failed:", rollbackError);
          }
        }
        return;
      } else {
        toast.success("Successfully Sent Notification!");
        // Success Message
        toast.success("Vanity Details Transfer successfully.");
        setTriggerVanityAddressUpdate((prev) => !prev);
      }
    } catch (error) {
      console.error("Error during vanity address transfer:", error);
      toast.error("An error occurred during the transfer process.");

      // Rollback changes in reverse order
      for (const rollback of rollbackActions.reverse()) {
        try {
          await rollback();
        } catch (rollbackError) {
          console.error("Rollback failed:", rollbackError);
        }
      }
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  // for enable disble button
  const isSubmitDisabled =
    !selectedVanityAddress || !!vanityError || !!walletError || !agreed;

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
              Send Vanity Details
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
              {/* Dropdown for Vanity Address Selection */}
              <FormControl
                fullWidth
                sx={{ marginBottom: 2 }}
                error={!!vanityError}
              >
                <Typography variant="body1" gutterBottom>
                  Select Vanity Address
                </Typography>
                <Select
                  value={selectedVanityAddress}
                  onChange={(e: any) => {
                    handleVanityAddressChange(e);
                  }}
                  displayEmpty
                  variant="outlined"
                  sx={{ marginBottom: 2 }}
                >
                  <MenuItem value="" disabled>
                    Select a Vanity Address
                  </MenuItem>
                  {vanityAddresses.filter(
                    (vanity) => vanity.vanityAccountType === "Prestige"
                  ).length > 0 ? (
                    vanityAddresses
                      .filter(
                        (vanity) => vanity.vanityAccountType === "Prestige"
                      )
                      .map((vanity, index) => (
                        <MenuItem key={index} value={vanity.vanityAddress}>
                          {vanity.vanityAddress} ({vanity.vanityAccountType})
                        </MenuItem>
                      ))
                  ) : (
                    <MenuItem disabled>
                      You Have No Any Prestige Accounts
                    </MenuItem>
                  )}
                </Select>
                {vanityError && <FormHelperText>{vanityError}</FormHelperText>}
              </FormControl>

              {/* Wallet Address Input */}
              <TextField
                label="Receiver's Wallet Address"
                fullWidth
                value={walletAddress}
                onChange={handleWalletAddressChange}
                variant="outlined"
                error={!!walletError}
                helperText={walletError}
                sx={{ marginBottom: 2 }}
              />

              {/* Checkbox for agreement */}
              <FormControl error={!!agreeError} sx={{ marginBottom: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={agreed}
                      onChange={handleCheckboxChange}
                    />
                  }
                  label="I agree to the terms and conditions"
                />
                {agreeError && <FormHelperText>{agreeError}</FormHelperText>}
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose} color="secondary">
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                color="primary"
                variant="contained"
                disabled={isSubmitDisabled}
              >
                Submit
              </Button>
            </DialogActions>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default SendVanityDataModal;
