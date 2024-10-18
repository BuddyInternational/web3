import express from "express";
import { saveUserContent,getUserContent } from "../controllers/userContentController.js";

const userContentRoutes = express.Router();

userContentRoutes.post("/saveUserContent" , saveUserContent);
userContentRoutes.get("/getUserContent" , getUserContent);

export {userContentRoutes};
