import React, { useState } from "react";
import {
  Box,
  Button,
  DialogContent,
  DialogTitle,
  Fade,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { IoClose } from "react-icons/io5";
import { logInUser } from "../../api/userVanityAPI";
import { useVanityContext } from "../../context/VanityContext";
import { useAuthContext } from "../../context/AuthContext";
import { useLoader } from "../../context/LoaderContext";
import Loader from "../../utils/Loader";
import { toast } from "react-toastify";

const LoginModal: React.FC<{
  open: boolean;
  onClose: () => void;
  logInType: string;
}> = ({ open, onClose, logInType}) => {
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const { setVanityAddress } = useVanityContext();
  const { setAuthMethod, setLoginDetails, setIsLoggedIn } = useAuthContext();
  const { isLoading, setIsLoading } = useLoader();

  // handle login
  const handleLogIn = async (logInContent: any) => {
    try {
      setIsLoading(true);
      // Call the API to check the user's vanity address
      const response = await logInUser(logInContent);

      if (response) {
        setVanityAddress(response?.vanityDetails[0]?.vanityAddress);
        setLoginDetails(
          logInType === "Mobile"
            ? { mobile: mobile }
            : { email: email }
        );
        setIsLoggedIn(true);
        setAuthMethod(logInType.toLowerCase()); 
        toast.success("User Login Successfully");
      } else {
        toast.warning("User Not Found. Please Register First and try again.");
      }

      // Close the modal after API call
      onClose();
    } catch (error:any) {
      console.error("Error during  login:", error);
      toast.error(`Error during login. Please try again. ${error}`);
      setMobile("");
      setEmail("");
    }
    finally{
      setIsLoading(false);
    }
  };

  return (
    <>
     {isLoading && <Loader />}

    <Modal open={open} onClose={onClose} aria-labelledby="login-modal-title">
      <Fade in={open}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            width: { xs: "90%", sm: "70%", md: "50%", lg: "40%", xl: "30%" },
            maxHeight: "80%",
            overflowY: "auto",
            borderRadius: "12px",
            boxShadow: 24,
            p: 4,
          }}
        >
          {/* Modal Title */}
          <DialogTitle
            sx={{
              textAlign: "center",
              fontSize: "1.5rem",
              fontWeight: "bold",
              mb: 2,
              color: "#333",
            }}
            id="login-modal-title"
          >
            Login with {logInType}
          </DialogTitle>

          {/* Close Button */}
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 16,
              top: 16,
              fontSize: "1.25rem",
              color: "#888",
              backgroundColor: "#f4f4f4",
              "&:hover": { backgroundColor: "#e0e0e0" },
            }}
          >
            <IoClose />
          </IconButton>

          {/* Modal Content */}
          <DialogContent
            dividers
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              mt: 2,
            }}
          >
            <Typography
              variant="body1"
              sx={{ textAlign: "center", color: "#555" }}
            >
              Enter your{" "}
              {logInType === "Mobile" ? "Mobile Number" : "Email Address"} below
              to continue.
            </Typography>

            {/* Input Field */}
            <TextField
              fullWidth
              label={logInType === "Mobile" ? "Mobile Number" : "Email"}
              value={logInType === "Mobile" ? mobile : email}
              onChange={
                logInType === "Mobile"
                  ? (e) => setMobile(e.target.value)
                  : (e) => setEmail(e.target.value)
              }
              variant="outlined"
              type={logInType === "Mobile" ? "tel" : "email"}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />

            {/* Login Button */}
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#5773ff",
                color: "#fff",
                fontWeight: "bold",
                textTransform: "none",
                borderRadius: "8px",
                py: 1.5,
                "&:hover": {
                  backgroundColor: "#456bd9",
                },
              }}
              onClick={logInType === "Mobile" ? () =>handleLogIn(mobile): () => handleLogIn(email)}
            >
              Login
            </Button>
          </DialogContent>
        </Box>
      </Fade>
    </Modal>
    </>
  );
};

export default LoginModal;
