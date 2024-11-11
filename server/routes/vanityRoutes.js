import express from "express";
import {
  checkExistingVanityAddress,
  generateAndStoreVanityAddress,
  generateVanityWallet,
  storeVanityWallet,
  downloadVanityAddress
} from "../controllers/vanityController.js";

const vanityRoutes = express.Router();

vanityRoutes.get("/checkVanityAddress", checkExistingVanityAddress);
vanityRoutes.post(
  "/generateAndStoreVanityAddress",
  generateAndStoreVanityAddress
);
vanityRoutes.post("/generateVanityWallet",generateVanityWallet);
vanityRoutes.post("/storeVanityWallet",storeVanityWallet);
vanityRoutes.get("/downloadVanityAddress", downloadVanityAddress);


export { vanityRoutes };
