import { Modal, Fade } from "@mui/material";
import React from "react";

const ZoomedImage: React.FC<{
  open: any;
  handleClose: any;
  src: any;
}> = ({ open, handleClose, src }) => {
  return (
    <Modal open={open} onClose={handleClose} closeAfterTransition>
      <Fade in={open}>
        <div
          className="relative h-full w-full"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h1 className="my-2 m-auto p-1.5 w-96 text-center bg-neutral-600 text-white rounded capitalize">
            to exit full screen, press{" "}
            <span className="border p-2 text-sm">ESC</span>
          </h1>
          <img
            className="object-fit"
            src={src}
            alt="NFT image"
            style={{ width: "auto", height: "90%" }}
          />
        </div>
      </Fade>
    </Modal>
  );
};

export default ZoomedImage;
