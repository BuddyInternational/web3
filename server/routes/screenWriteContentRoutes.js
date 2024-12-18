import express from "express";
import { deleteScreenWriteContentDetail, getScreenWriteContent, saveScreenWriteContent, trackDownloadScreenWriteContent, updateScreenWriteContentDetail, updateVanityScreenWriteContentWalletForVanityTransfer } from "../controllers/screenWriteController.js";

const screenWriteContentRoutes = express.Router();

screenWriteContentRoutes.post("/saveScreenWriteContent" , saveScreenWriteContent);
screenWriteContentRoutes.get("/getScreenWriteContent" , getScreenWriteContent);
screenWriteContentRoutes.put('/updateScreenWriteContentDetail/:walletAddress/:ipfsHash', updateScreenWriteContentDetail);
screenWriteContentRoutes.put('/updateVanityScreenWriteContentWalletForVanityTransfer', updateVanityScreenWriteContentWalletForVanityTransfer);
screenWriteContentRoutes.delete('/deleteScreenWriteContentDetail/:walletAddress/:ipfsHash', deleteScreenWriteContentDetail);
screenWriteContentRoutes.post("/trackDownloadScreenWriteContent", trackDownloadScreenWriteContent);

export {screenWriteContentRoutes};
