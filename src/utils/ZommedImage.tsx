import { Modal, Fade} from "@mui/material";
import React from "react";

const ZoomedImage: React.FC<{
  open: any;
  handleClose: any;
  src: any;
}> = ({ open, handleClose, src }) => {
  return (
    <Modal open={open} onClose={handleClose} closeAfterTransition>
      <Fade in={open}>
        <div className="relative h-full w-full">
          <h1
          className="absolute top-6 left-0 right-0 m-auto p-1.5 w-1/5 text-center bg-neutral-600 text-white">
            to exit full screen, press <span className="border p-2 text-sm">ESC</span>
          </h1>
          <img
            className="h-full w-full object-fit"
            src={src}
            alt="NFT image"
          />
        </div>
      </Fade>
    </Modal>
  );
};

export default ZoomedImage;
