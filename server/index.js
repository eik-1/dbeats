import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import { gql, request } from "graphql-request";
import userRouter from "./routes/users.js";
import axios from "axios";
import { Network, Alchemy } from "alchemy-sdk";

const port = 3000;
const url = process.env.SUBGRAPH_URL;

const settings = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ARB_SEPOLIA,
};

const alchemy = new Alchemy(settings);

const alchemyFetch = async (address) => {
  const owners = await alchemy.nft.getNftsForContract(address);

  const numberOfOwners = owners.nfts.length;

  return numberOfOwners;
};

const app = express();
dotenv.config();

//Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Connect to MongoDB
mongoose.connect(
  `mongodb+srv://eik:${process.env.MONGOOSE_PASSWORD}@dbeats.8elky.mongodb.net/?retryWrites=true&w=majority&appName=DBeats`
);

//Routes
app.use("/user", userRouter);

app.get("/userNfts", async (req, res) => {
  const walletAddress = req.query.walletAddress.toLowerCase();
  console.log("Received wallet address:", walletAddress);

  const query = gql`
    query MyQuery($artistId: String!) {
      artist(id: $artistId) {
        address
        nfts {
          tokenURI
          mintPrice
          address
        }
      }
    }
  `;

  try {
    const data = await request(url, query, { artistId: walletAddress });
    res.json(data);
  } catch (error) {
    console.error("Error fetching data from subgraph:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.get("/nftData", async (req, res) => {
  const { uri, address } = req.query;

  try {
    // Fetch NFT metadata
    const response = await axios.get(uri);
    const nftData = response.data;

    // Fetch additional data (e.g., number of owners) if needed
    const numberOfOwners = await alchemyFetch(address); // Assuming alchemyFetch is defined

    // Combine data
    const data = {
      name: nftData.name,
      image: nftData.image,
      artist: nftData.attributes[0].value,
      numberOfOwners,
    };

    res.json(data);
  } catch (error) {
    console.error("Error fetching NFT data:", error);
    res.status(500).json({ error: "Failed to fetch NFT data" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
