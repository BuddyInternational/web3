import express from "express";
import { saveSocketNFTAndUpdateLastTransfer,getSocketNFTLastTransferDetails } from "../controllers/socketNFTDataController.js";

const socketNFTRoutes = express.Router();

socketNFTRoutes.post("/saveSocketNFTAndUpdateLastTransfer" , saveSocketNFTAndUpdateLastTransfer);
socketNFTRoutes.post("/getSocketNFTLastTransferDetails" , getSocketNFTLastTransferDetails);

export {socketNFTRoutes};
