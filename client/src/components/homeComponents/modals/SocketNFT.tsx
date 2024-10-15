import { Box, DialogContent, DialogTitle, Fade, IconButton, Modal, Typography } from '@mui/material';
import React from 'react'
import { IoClose } from 'react-icons/io5';
import { NFTData } from '../../../utils/Types';
import NftCard from '../card/NftCard';
import ModalNFTCard from '../card/ModalNFTCard';


const SocketNFT: React.FC<{
    open: boolean;
    onClose: () => void;
    NFTDetails: NFTData[];
  }> = ({ open, onClose ,NFTDetails}) => {
    // console.log("NFTDetails--------------",NFTDetails);
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
              width: { xs: "70%", sm: "65%", md: "55%", lg: "45%", xl: "35%" },
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
              Persona Socket NFT
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
             {NFTDetails.map((nft,index) => (
              <ModalNFTCard key={index} nft={nft} /> // Ensure NFTData has a unique key field
            ))}
            </DialogContent>
          </Box>
        </Fade>
      </Modal>
    );
}

export default SocketNFT
