import express from "express";
import {
  checkExistingVanityAddress,
  generateAndStoreVanityAddress,
} from "../controllers/vanityController.js";

const vanityRoutes = express.Router();

vanityRoutes.get("/checkVanityAddress", checkExistingVanityAddress);
vanityRoutes.post(
  "/generateAndStoreVanityAddress",
  generateAndStoreVanityAddress
);

export { vanityRoutes };
