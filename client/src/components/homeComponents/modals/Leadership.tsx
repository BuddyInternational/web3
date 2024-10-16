import {
  Box,
  DialogContent,
  DialogTitle,
  Fade,
  IconButton,
  Modal,
  Typography,
} from "@mui/material";
import React from "react";
import { IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";

const Leadership: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
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
              sx={{ marginBottom: 2 }}
            >
              To initiate the liquidation of your full account, you must provide
              the original developers with a complete snapshot of your account
              history. This includes any items related to the collaboration,
              such as:
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ marginBottom: 2 }}
            >
              - NFTs
              <br />
              - Vested wrappers
              <br />
              - User-generated content participation rewards
              <br />
              - Client-wrapped vested items
              <br />- Any items linked to your provided vanity address
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ marginBottom: 2 }}
            >
              Once validated and approved by the organization, you will receive
              the “manager” NFT, allowing you to manage your assets effectively.
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ marginBottom: 2 }}
            >
              Within four days, you will be able to claim an additional wallet,
              enabling you to embark on this journey again. Now, you will have
              more than one "vanity address" with the organization.
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ marginBottom: 2 }}
            >
              <strong>Prestige NFTs</strong> are endorsements from the
              organization’s partners and can be issued to you at any time based
              on your citations at Gully Buddy International.
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ marginTop: 2 }}
            >
              Liquidate full account requires refresh token NFT{" "}
              <Link to="/#" className="underline text-blue-400 ml-2">
                click here
              </Link>
            </Typography>
          </DialogContent>
        </Box>
      </Fade>
    </Modal>
  );
};

export default Leadership;
