import { Modal, Fade } from "@mui/material";
import React from "react";
// import { MdZoomOutMap } from "react-icons/md";

const ZoomedImage: React.FC<{
  open: any;
  handleClose: any;
  src: any;
}> = ({ open, handleClose, src }) => {
  return (
    <Modal open={open} onClose={handleClose} closeAfterTransition>
      <Fade in={open}>
        <div
          className="flex flex-col items-center justify-center h-full w-full relative p-4"
        >
          <h1 className="hidden md:block my-2 m-auto p-1.5 w-96 text-center bg-neutral-600 text-white rounded capitalize">
            to exit full screen, press{" "}
            <span className="border p-2 text-sm">ESC</span>
          </h1>
          <img
            className="object-contain sm:h-full md:h-5/6 w-auto h-5/6 max-h-[90vh]"
            src={src}
            alt="NFT"
            style={{ width: "auto", height: "90%" }}
          />
          <span className="absolute z-20 bg-gray-700 sm:bottom-2 sm:right-4 lg:bottom-4 lg:right-6 p-2 rounded-lg hover:bg-gray-600 hover:bg-opacity-75">
          {/* <MdZoomOutMap className="text-white text-xl cursor-pointer"  onClick={handleClose}/> */}
          <button className="text-white text-xl p-1 cursor-pointer" onClick={handleClose}>Close</button>
          </span>
        </div>
      </Fade>
    </Modal>
  );
};

export default ZoomedImage;
