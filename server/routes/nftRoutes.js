import express from "express";
import { saveNFTDetails,fetchNFTDetails,updateNFTClaimDetails,getNFTClaimDetails } from "../controllers/nftDataController.js";

const nftRoutes = express.Router();

nftRoutes.post("/saveNftDetails" , saveNFTDetails);
nftRoutes.post("/updateNFTClaimDetails" , updateNFTClaimDetails);
nftRoutes.get('/getNFTDetails/:walletAddress', fetchNFTDetails);
nftRoutes.get('/getNFTClaimDetails/:walletAddress/:tokenId/:contractAddress', getNFTClaimDetails);

export {nftRoutes};
