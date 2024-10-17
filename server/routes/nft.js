import express from "express";
import dotenv from "dotenv";
import { ethers } from "ethers";
dotenv.config();

import {
  getNftDetails,
  getNftMetadata,
  getNfts,
} from "../controllers/nftController.js";

const router = express.Router();

/* FOR MARKET DISPLAY */
router.get("/getAll", getNfts);
router.get("/nftMetadata", getNftMetadata);
router.post("/getOne", getNftDetails);

export default router;
