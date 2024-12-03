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
  InputLabel,
  Modal,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { IoClose } from "react-icons/io5";

const SendVanityDataModal: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
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
             {/* Wallet Address Input */}
          <TextField
            label="Wallet Address"
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
