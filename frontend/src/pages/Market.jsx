import React from "react"
import { useQuery } from "@tanstack/react-query"
import styles from "./Market.module.css"
import NFTCard from "../components/NFTCard"

function Market() {

const { data, status, error } = useQuery({
    queryKey: ["nfts"],
    queryFn: async () => {
    
            try {
                console.log("Fetching data for artistId:");
                const response = await fetch(`http://localhost:3000/nfts`);
                const result = await response.json();
                return result;
            } catch (err) {
                console.error("Error fetching data:", err)
                throw err
            }
        },
    })

    return (
        <div className={styles.marketContainer}>
            {status === "pending" && (
                <div className={styles.notConnected}>Loading...</div>
            )}
            {status === "error" && (
                <div className={styles.notConnected}>
                    Error occurred querying the Subgraph: {error.message}
                </div>
            )}
            {status === "success" && (
                <div className={styles.nftList}>
                    {data.nfts.map((nft) => (
                        <NFTCard key={nft.id} id={nft.id} uri={nft.tokenURI} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default Market
