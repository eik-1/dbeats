import express from "express";
import dotenv from "dotenv";
import { ethers } from "ethers";
import { dbeatsNftABI } from "../utils/nftABI.js";
dotenv.config();

const router = express.Router();

const provider = new ethers.JsonRpcProvider(process.env.ARB_SEPOLIA_RPC);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

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

export default router;
