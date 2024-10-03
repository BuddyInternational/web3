import React from "react";
import {
  Modal,
  Fade,
  DialogTitle,
  IconButton,
  DialogContent,
  Typography,
  Box,
} from "@mui/material";
import { IoClose } from "react-icons/io5";

const TermsModal: React.FC<{
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
            Gully Buddies Membership Rewards!!!!
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
            <Typography variant="body2" color="text.secondary">
              Each NFT Passport activates the perks below:
            </Typography>
            <Typography variant="body2" gutterBottom>
              *Benefit!
              <br />
              There is public trade
              <br />
              CDE (CDE) Token Tracker
              <br />
              CDE (CDE) Token Tracker
              <br />
              <br />
              There is members only option to send amounts to be vested to
              passport client wallet. Client wallets are a vanity address you
              get with membership primarily recognizable to end in CDE they are
              assigned when client claims their NFT membership. These wallets
              are used to consolidate research of participations for further
              development environments. Having CDE as vested includes huge
              rewards but can only currently be claimed once monthly after the
              round of multi wallet payouts are made.
              <br />
              <br />
              *Benefit! There is public trade TIM (TIM) Token Tracker
              <br />
              TIM (TIM) Token Tracker
              <br />
              <br />
              There is membership rewards in TIM by several methods, you may
              have quested your “buddies”, you may have sufficient activity on
              your account, purchases, vested a marginal tier in CDE token,
              commented, user generated content impression, nfts, user generated
              content royalty, user testing, player verse player, socialized in
              a room, read some content, watched a video, much more ways to
              earn. TIM is sent directly to your wallet however can also be
              vested in the manner of CDE.
              <br />
              <br />
              Developers use time for research sponsorship endorsements,
              expenses for service provision more. Having a membership and gully
              buddies is great but when your active member TIM is always paid by
              “buddy international TM”
              <br />
              <br />
              Having TIM as vested includes huge rewards but can only currently
              be claimed once monthly after the round of multi wallet payouts
              are made. More uses for TIM are to come.
              <br />
              <br />
              Earn Tokens Every Month To The Wallets Of Assigned NFT Passport
              Membership
              <br />
              <br />
              Participate in quest for huge rewards Daily and/or weekly and
              monthly.
              <br />
              <br />
              NFTs accumulate monthly valuations based on the client wallets
              activity and/or last activity of the wallets Gully Buddy NFTs.
              <br />
              <br />
              Attn: “Gully Buddy”
              <br />
              suite ######
              <br />
              265 Franklin St
              <br />
              Boston, MA 11200
              <br />
              <br />
              18883795590
              <br />
              <br />
              Terms of use | All rights Reserved Gully Buddy International.
            </Typography>
          </DialogContent>
        </Box>
      </Fade>
    </Modal>
  );
};

export default TermsModal;
