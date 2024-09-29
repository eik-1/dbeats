import React from "react"
import { useQuery } from "@tanstack/react-query"
import { gql, request } from "graphql-request"
import styles from "./Market.module.css"
import NFTCard from "../components/NFTCard"

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
`

const url = import.meta.env.VITE_SUBGRAPH_URL

function Market() {
    
    const { data, status } = useQuery({
        queryKey: ["nfts"],
        queryFn: async () => await request(url, query),
    })

    return (
        <div className={styles.marketContainer}>
            {status === "pending" && (
                <div className={styles.notConnected}>Loading...</div>
            )}
            {status === "error" && (
                <div className={styles.notConnected}>
                    Error occurred querying the Subgraph
                </div>
            )}
            {status === "success" && (
                <div className={styles.nftList}>
                    {data.nfts.map((nft) => (
                        <NFTCard id={nft.id} uri={nft.tokenURI} />
                    ))}
                </div>
            )}
        </div> 
    )
}

export default Market
