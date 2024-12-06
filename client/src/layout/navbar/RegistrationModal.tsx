import {
  Box,
  Button,
  DialogContent,
  DialogTitle,
  Fade,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import Loader from "../../utils/Loader";
import { IoClose } from "react-icons/io5";
import { useLoader } from "../../context/LoaderContext";
import {
  checkUserExistingVanityAddress,
  storeUserVanityWallet,
} from "../../api/userVanityAPI";
import { generateVanityWallet } from "../../api/vanityAPI";
import { toast } from "react-toastify";

const vanity_suffix = process.env.REACT_APP_VANITY_SUFFIX!;

const RegisterModal: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  const { isLoading, setIsLoading } = useLoader();
  const [option, setOption] = useState("mobile");
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  // Handle Input Change
  const handleInputChange = (value: string) => {
    setInputValue(value);
    validateInput(value); // Validate as user types
  };

  // Handle Option Change
  const handleOptionChange = (event: any) => {
    setOption(event.target.value);
    setInputValue("");
    setError("");
  };

  // Validate Email or Mobile
  const validateInput = (value: string) => {
    if (option === "mobile") {
      const mobileRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format
      if (!mobileRegex.test(value)) {
        setError(
          "Invalid mobile number. Use E.164 format (e.g., +1234567890)."
        );
      } else {
        setError(""); // Clear error
      }
    } else if (option === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Standard email format
      if (!emailRegex.test(value)) {
        setError("Invalid email address. Please enter a valid email.");
      } else {
        setError(""); // Clear error
      }
    }
  };

  // Handle Register Button Click
  const handleAssignVanity = async () => {
    // Check if vanity address exists for the given mobile or email
    try {
      setIsLoading(true);
      const existingVanity = await checkUserExistingVanityAddress(
        option === "mobile" ? inputValue : undefined,
        option === "email" ? inputValue : undefined
      );
      // If the vanity address exists
      if (existingVanity) {
        // setVanityAddress(existingVanity.vanityDetails[0]?.vanityAddress);
        toast.success("You have Already assigned a Vanity Address ! Please login this account to access it.");
      } else {
        // If no existing vanity address, generate a new vanity address
        const generateResponse = await generateVanityWallet(vanity_suffix!, 1);
        if (generateResponse?.data?.[0]?.address) {
          const generatedAddress = generateResponse.data[0];
          // Store the new vanity wallet address using the API
          const vanityAccountType = "Main";
          const storeResponse = await storeUserVanityWallet(
            option === "mobile" ? inputValue : undefined,
            option === "email" ? inputValue : undefined,
            generatedAddress.address,
            generatedAddress.privKey,
            vanityAccountType
          );
          if (storeResponse) {
            // setVanityAddress(generatedAddress.address);
            toast.success("Vanity address assigned successfully!");
          } else {
            toast.error("Error storing vanity address!");
          }
        } else {
          toast.error("Error generating vanity address!");
        }
      }
    } catch (error:any) {
      console.error("Error during vanity address assignment:", error);
      toast.error(`Error occurred while assigning vanity address! ${error}`);
    }
    finally{
      setIsLoading(false);
      onClose();
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
              zIndex: 2000,
              p: 3,
            }}
          >
            <DialogTitle
              sx={{ m: 0, p: 2, textAlign: "center" }}
              id="customized-dialog-title"
            >
              Assign Vanity
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
              <form
              // onSubmit={handleSubmit}
              >
                <Box display="flex" flexDirection="column" gap={6}>
                  {/* Dropdown for Option Selection */}
                  <TextField
                    select
                    fullWidth
                    value={option}
                    onChange={handleOptionChange}
                    label="Select Registration Option"
                    className="mb-4 bg-white text-black rounded-lg"
                    variant="outlined"
                  >
                    <MenuItem value="mobile">Using Mobile Number</MenuItem>
                    <MenuItem value="email">Using Email</MenuItem>
                  </TextField>

                  {/* Input Field */}
                  <TextField
                    fullWidth
                    value={inputValue}
                    onChange={(e) => handleInputChange(e.target.value)}
                    label={
                      option === "mobile"
                        ? "Enter Your Mobile Number"
                        : "Enter Your Email Address"
                    }
                    placeholder={
                      option === "mobile"
                        ? "e.g., +1234567890"
                        : "e.g., example@email.com"
                    }
                    variant="outlined"
                    error={!!error}
                    helperText={error}
                  />

                  {/* Assign Vanity Button */}
                  <Button
                    color="primary"
                    variant="contained"
                    fullWidth
                    className="bg-[#5692D9] text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#4578B5] transition-all"
                    onClick={handleAssignVanity}
                    disabled={!inputValue.trim()}
                  >
                    Assign Vanity
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

export default RegisterModal;
