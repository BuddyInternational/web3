import express from "express";
import { deleteStoryLineContentDetail, getStoryLineContent, saveStoryLineContent, trackDownloadStoryLineContent, updateStoryLineContentDetail } from "../controllers/storyLineContentController.js";

const storyLineContentRoutes = express.Router();

storyLineContentRoutes.post("/saveStoryLineContent" , saveStoryLineContent);
storyLineContentRoutes.get("/getStoryLineContent" , getStoryLineContent);
storyLineContentRoutes.put('/updateStoryLineContentDetail/:walletAddress/:ipfsHash', updateStoryLineContentDetail);
storyLineContentRoutes.delete('/deleteStoryLineContentDetail/:walletAddress/:ipfsHash', deleteStoryLineContentDetail);
storyLineContentRoutes.post("/trackDownloadStoryLineContent", trackDownloadStoryLineContent);


export {storyLineContentRoutes};
