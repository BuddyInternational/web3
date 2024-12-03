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

const SendVanityDataModal: React.FC<{
  open: boolean;
  onClose: () => void;
  vanityAddresses: { vanityAddress: string; vanityAccountType: string }[];
}> = ({ open, onClose ,vanityAddresses}) => {
  console.log("vanityAddresses******************************",vanityAddresses);
  const [selectedVanityAddress, setSelectedVanityAddress] = useState("");
    const [walletAddress, setWalletAddress] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [agreeError, setAgreeError] = useState('');

  // Handle Wallet Address Validation (as user types)
  const handleWalletAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setWalletAddress(value);

    // Simple wallet address validation: Check if it is empty or not
    if (!value) {
      setError('Wallet address is required');
    } else {
      setError(''); // Clear error if valid input is present
    }
  };

  // Handle Dropdown Selection
  const handleVanityAddressChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedVanityAddress(e.target.value as string);
  };

  // Handle Checkbox Validation
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAgreed(e.target.checked);
    if (e.target.checked) {
      setAgreeError(''); // Clear error if checkbox is checked
    }
  };

  // Handle submit Vanity Data
  const handleSubmit = () => {
    if (!walletAddress) {
      setError('Wallet address is required');
      return;
    }

    if (!agreed) {
        setAgreeError('You must agree to the terms');
      return;
    }

    // Submit logic
    alert(`Wallet Address Submitted: ${walletAddress}`);
    onClose();
  };

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
             <FormControl fullWidth sx={{ marginBottom: 2 }}>
              <Typography variant="body1" gutterBottom>
                Select Vanity Address
              </Typography>
              <Select
                value={selectedVanityAddress}
                onChange={(e:any) => {handleVanityAddressChange(e)}}
                displayEmpty
                variant="outlined"
              >
                <MenuItem value="" disabled>
                  Select a Vanity Address
                </MenuItem>
                {vanityAddresses.map((vanity, index) => (
                  <MenuItem key={index} value={vanity.vanityAddress}>
                    {vanity.vanityAddress} ({vanity.vanityAccountType})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

             {/* Wallet Address Input */}
          <TextField
            label="Receiver's Wallet Address"
            fullWidth
            value={walletAddress}
            onChange={handleWalletAddressChange}
            variant="outlined"
            error={!!error}
            helperText={error}
            sx={{ marginBottom: 2 }}
          />

          {/* Checkbox for agreement */}
          <FormControl error={!!agreeError} sx={{ marginBottom: 2 }}>
            <FormControlLabel
              control={<Checkbox checked={agreed} onChange={handleCheckboxChange} />}
              label="I agree to the terms and conditions"
            />
            {agreeError && <FormHelperText>{agreeError}</FormHelperText>}
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">Cancel</Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">Submit</Button>
        </DialogActions>
        </Box>
      </Fade>
    </Modal>
  );
};

export default SendVanityDataModal;
