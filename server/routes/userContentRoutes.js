import express from "express";
import { saveUserContent,getUserContent,updateContentDetail ,deleteContentDetail, trackDownloadUserContent, updateVanityUserContentWalletForVanityTransfer} from "../controllers/userContentController.js";

const userContentRoutes = express.Router();

userContentRoutes.post("/saveUserContent" , saveUserContent);
userContentRoutes.get("/getUserContent" , getUserContent);
userContentRoutes.put('/updateContentDetail/:walletAddress/:ipfsHash', updateContentDetail);
userContentRoutes.put('/updateVanityUserContentWalletForVanityTransfer', updateVanityUserContentWalletForVanityTransfer);
userContentRoutes.delete('/deleteContentDetail/:walletAddress/:ipfsHash', deleteContentDetail);
userContentRoutes.post("/trackDownloadUserContent", trackDownloadUserContent);


export {userContentRoutes};
