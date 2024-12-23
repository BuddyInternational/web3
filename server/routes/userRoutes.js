import express from "express";
import { checkExistingUserVanityAddress, downloadVanityAddressForUser, getAllUsersData, logInUser, logOutUser, storeUserVanityWallet } from "../controllers/registrationController.js";

const userVanityRoutes = express.Router();

userVanityRoutes.get("/checkUserVanityAddress", checkExistingUserVanityAddress);
userVanityRoutes.get("/getAllUsersData", getAllUsersData);
userVanityRoutes.post("/storeUserVanityWallet",storeUserVanityWallet);
userVanityRoutes.post("/logInUser",logInUser);
userVanityRoutes.post("/logOutUser",logOutUser);
userVanityRoutes.get("/downloadVanityAddressForUser", downloadVanityAddressForUser);


export { userVanityRoutes };
