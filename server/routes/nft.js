import express from "express";
import dotenv from "dotenv";
import { ethers } from "ethers";
dotenv.config();

import { getNftMetadata, getNfts } from "../controllers/nftController.js";
import { dbeatsNftABI } from "../utils/nftABI.js";

const router = express.Router();

const provider = new ethers.JsonRpcProvider(process.env.ARB_SEPOLIA_RPC);
// const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

/* TO GET PRICE DISPLAY ON MODAL */
router.get("/price/:address", async (req, res) => {
  try {
    const contract = new ethers.Contract(
      req.params.address,
      dbeatsNftABI,
      provider
    );

    const mintPrice = await contract._mintPrice();
    res.json({ price: ethers.formatEther(mintPrice) });
  } catch (error) {
    res.status(500).json({ error: "Error fetching price" });
  }
});

/* FOR MARKET DISPLAY */
router.get("/getAll", getNfts);
router.get("/nftMetadata", getNftMetadata);

export default router;
