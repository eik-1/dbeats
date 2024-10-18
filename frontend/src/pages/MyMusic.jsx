import React, { useEffect, useState } from "react"
import axios from "axios"
import { useWeb3ModalAccount } from "@web3modal/ethers/react"
import { Link } from "react-router-dom"
import styles from "./MyMusic.module.css"
import { useUser } from "../contexts/UserProvider"
import NFTCard from "../components/NFTCard"

function MyMusic() {
    const [userNfts, setUserNfts] = useState([])

    const { address, isConnected } = useWeb3ModalAccount()
    const { fetchUser } = useUser()
    console.log("userNfts: ", userNfts)
    useEffect(() => {
        if (!isConnected || !address) return
        async function fetchNftAddresses() {
            try {
                setUserNfts([])
                const data = await fetchUser(address)
                const nftAddresses = data.mintedNfts
                for (let i = 0; i < nftAddresses.length; i++) {
                    const nftAddress = nftAddresses[i]
                    const response = await axios.post(
                        "http://localhost:3000/nft/getOne",
                        { nftAddress },
                    )
                    const nftData = response.data.nfts[0]
                    setUserNfts((prevNfts) => [...prevNfts, nftData])
                }
            } catch (error) {
                console.error("Error fetching NFT addresses:", error)
            }
        }
        fetchNftAddresses()
    }, [isConnected, address])

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Your Minted Tracks</h1>
            <div className={styles.nftList}>
                {userNfts.map((nft) => (
                    <Link to={`/track/${nft.address}`} state={{ address: nft.address }} key={nft.address} className={styles.profileCardContent}>
                    <NFTCard
                        key={nft.id}
                        id={nft.id}
                        uri={nft.tokenURI}
                        price={nft.mintPrice}
                        genre={nft.genre}
                    />
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default MyMusic
