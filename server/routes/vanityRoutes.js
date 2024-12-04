import express from "express";
import {
  checkExistingVanityAddress,
  generateAndStoreVanityAddress,
  generateVanityWallet,
  storeVanityWallet,
  downloadVanityAddress,
  trackDownload,
  VanityCallcount,
  deleteVanityAddress,
} from "../controllers/vanityController.js";

const vanityRoutes = express.Router();

vanityRoutes.get("/checkVanityAddress", checkExistingVanityAddress);
vanityRoutes.post(
  "/generateAndStoreVanityAddress",
  generateAndStoreVanityAddress
);
vanityRoutes.post("/generateVanityWallet",generateVanityWallet);
vanityRoutes.post("/storeVanityWallet",storeVanityWallet);
vanityRoutes.delete('/deleteVanityAddress/:walletAddress/:vanityAddressToDelete', deleteVanityAddress);
vanityRoutes.get("/downloadVanityAddress", downloadVanityAddress);
vanityRoutes.post("/trackDownload", trackDownload);
vanityRoutes.get("/vanityCallcount", VanityCallcount);


export { vanityRoutes };
