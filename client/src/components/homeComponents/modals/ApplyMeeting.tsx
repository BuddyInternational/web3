import {
    Box,
    DialogContent,
    DialogTitle,
    Fade,
    IconButton,
    Modal,
  } from "@mui/material";
  import React from "react";
  import { IoClose } from "react-icons/io5";
  import CommonJotform from "../../../utils/CommonJotform";
  const applyMeetingFormUrl = process.env.REACT_APP_APPLY_MEETING_ROOM_JOTFORM_LINK;
  
  const ApplyMeeting: React.FC<{
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
              width: {
                xs: "99vw",
                sm: "80vw",
                md: "70vw",
                lg: "70vw",
                xl: "50vw",
              },
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
              Apply For Meeting Room
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
              <CommonJotform
                formUrl={applyMeetingFormUrl!}
                defaults={""}
              />
            </DialogContent>
          </Box>
        </Fade>
      </Modal>
    );
  };
  
  export default ApplyMeeting;
  