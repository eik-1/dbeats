import axios from "axios";
import dotenv from "dotenv";
import { gql, request } from "graphql-request";
dotenv.config();

const url = process.env.SUBGRAPH_URL;

export const getNfts = async (req, res) => {
  const query = gql`
    {
      nfts(skip: 25) {
        id
        address
        artist {
          id
        }
        tokenURI
      }
    }
  `;

  try {
    const data = await request(url, query);
    console.log(data);
    res.json(data);
  } catch (error) {
    console.error("Error fetching NFTs from subgraph:", error);
    res.status(500).json({ error: "Failed to fetch NFTs" });
  }
};

export const getNftMetadata = async (req, res) => {
  const { uri } = req.query;

  try {
    const response = await axios.get(uri);
    const nftData = response.data;
    res.json(nftData);
  } catch (error) {
    console.error("Error fetching NFT metadata:", error);
    res.status(500).json({ error: "Failed to fetch NFT metadata" });
  }
};
