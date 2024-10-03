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
import { useWeb3ModalAccount } from "@web3modal/ethers/react";

const CDEReward: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
    const { address } = useWeb3ModalAccount();
  const [inputValues, setInputValues] = useState({
    walletAddress: address,
    vanityAddress: "0x364hjkdhgjhj65464565474fjghjfkh",
    amount: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitted values:", inputValues);
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
            width: { xs: "90%", sm: "70%", md: "60%", lg: "50%", xl: "40%" }, // Responsive width
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
                  defaultValue="0x364hjkdhgjhj65464565474fjghjfkh"
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
        </Box>
      </Fade>
    </Modal>
  );
};

export default CDEReward;
