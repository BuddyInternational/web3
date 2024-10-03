import express from 'express';
const router = express.Router();
import vanityController  from '../controllers/vanityController.js'; 


router.post("/generateVanityAddress", vanityController.generateVanityAddress);
router.post("/saveVanityAddress", vanityController.storeVanityAddress);

module.exports = router;