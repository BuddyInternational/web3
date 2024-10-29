import express from "express";
import {
  checkExistingVanityAddress,
  generateAndStoreVanityAddress,
  generateVanityWallet,
  storeVanityWallet
} from "../controllers/vanityController.js";

const vanityRoutes = express.Router();

vanityRoutes.get("/checkVanityAddress", checkExistingVanityAddress);
vanityRoutes.post(
  "/generateAndStoreVanityAddress",
  generateAndStoreVanityAddress
);
vanityRoutes.post("/generateVanityWallet",generateVanityWallet);
vanityRoutes.post("/storeVanityWallet",storeVanityWallet);


export { vanityRoutes };
