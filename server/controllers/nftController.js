import axios from "axios";
import dotenv from "dotenv";
import { gql, request } from "graphql-request";
dotenv.config();

const url = process.env.SUBGRAPH_URL;

export const getNfts = async (req, res) => {
  const query = gql`
    {
      nfts {
        id
        address
        artist {
          id
        }
        tokenURI
        genre
        mintPrice
      }
    }
  `;

  try {
    const data = await request(url, query);
    res.json(data);
  } catch (error) {
    console.error("Error fetching NFTs from subgraph:", error);
    res.status(500).json({ error: "Failed to fetch NFTs" });
  }
};

export const getNftDetails = async (req, res) => {
  const { nftAddress } = req.body;
  console.log("Address: ", nftAddress);
  const query = gql`
    query GetNftDetails($address: String!) {
      nfts(where: { address: $address }) {
        address
        name
        mintPrice
        tokenURI
        genre
        artist {
          id
        }
      }
    }
  `;
  try {
    const variables = { address: nftAddress };
    const data = await request(url, query, variables);
    res.json(data);
  } catch (error) {
    console.error("Error fetching details of the NFT", error);
    res.status(500).json({ error: "Failed to fetch the details" });
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
