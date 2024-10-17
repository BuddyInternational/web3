import express from "express";
import { saveNFTDetails,fetchNFTDetails } from "../controllers/nftDataController.js";

const nftRoutes = express.Router();

nftRoutes.post("/saveNftDetails" , saveNFTDetails);
nftRoutes.get('/getNFTDetails/:walletAddress', fetchNFTDetails);

export {nftRoutes};
