import React from "react";
import {
  Modal,
  Fade,
  DialogTitle,
  IconButton,
  DialogContent,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";
import ApplyMeeting from "./ApplyMeeting";

const MeetingRoom: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openApplyModal, setOpenApplyModal] = React.useState(false);
  

  const handleOpenApplyMeetingModal = () => {
    setOpenApplyModal(true);
    setAnchorEl(null);
  };

  const handleCloseApplyMeetingModal = () => {
    setOpenApplyModal(false);
    setAnchorEl(null);
    onClose();
  };
  return (
    <>
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
            Meeting Room (Endorsed)
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
            <Typography variant="body1" color="text.secondary"sx={{ marginTop: 2,marginBottom:2}}>
              Meeting Room (Endorsed) :{" "}
              <Link to="/#" className="underline text-blue-400">
                The Layer Operators ®
              </Link>
            </Typography>

            <Box sx={{ marginTop: 4,marginBottom:2, textAlign: "center" }}>
              <Link to={"/#"}>
                <Button variant="contained" color="primary" onClick={handleOpenApplyMeetingModal}>
                  Apply for Meeting Room
                </Button>
              </Link>
            </Box>
            <Typography variant="body2" gutterBottom>
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
              Terms of use | Gully Buddy International ® All Rights Reserved .
            </Typography>
          </DialogContent>
        </Box>
      </Fade>
    </Modal>
    {openApplyModal &&(
      <ApplyMeeting
      open={openApplyModal}
      onClose={handleCloseApplyMeetingModal}
    />
    )}
    </>
  );
};

export default MeetingRoom;
