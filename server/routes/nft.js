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

router.post("/mint", async (req, res) => {
  try {
    const { address, quantity } = req.body;
    console.log("Minting NFT with address:", address, "quantity:", quantity);
    const contract = new ethers.Contract(address, dbeatsNftABI, signer);
    const mintPrice = await contract._mintPrice();
    const tx = await contract.mint(signer.address, quantity, {
      value: mintPrice,
    });
    const receipt = await tx.wait();
    res.json({ success: true, transactionHash: receipt });
  } catch (error) {
    console.error("Minting error:", error);
    res
      .status(500)
      .json({ error: "Error minting NFT", details: error.message });
  }
});

export default router;
