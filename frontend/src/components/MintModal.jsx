import React, { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ethers } from "ethers"
import { Copy } from "lucide-react"

import styles from "./MintModal.module.css"
import mintNFT from "../Utils/mintNFT.js"

function MintModal({ isOpen, onClose, currentTrack }) {
    const price = currentTrack.price
    const priceFormat = ethers.formatEther(price)
    const genre = currentTrack.genre

    const [priceInUSD, setPriceInUSD] = useState("")
    const [isMinting, setIsMinting] = useState(false)
    const dialogRef = useRef(null)

    const navigate = useNavigate()

    useEffect(() => {
        if (isOpen) {
            fetchExchangeRate()
            dialogRef.current.showModal()
        } else {
            dialogRef.current.close()
        }
    }, [isOpen])

    async function fetchExchangeRate() {
        const url =
            "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
        const options = {
            method: "GET",
            headers: {
                accept: "application/json",
                "x-cg-demo-api-key": import.meta.env.VITE_COINGECKO_API,
            },
        }
        try {
            const response = await fetch(url, options)
            const data = await response.json()
            const exchangeRate = data.ethereum.usd
            const usdPrice = parseFloat(priceFormat) * exchangeRate
            setPriceInUSD(usdPrice.toFixed(2))
        } catch (error) {
            console.error("Error fetching exchange rate:", error)
            setPriceInUSD("N/A")
        }
    }

    async function handleMint() {
        setIsMinting(true)
        try {
            const priceInWei = ethers.parseEther(priceFormat)
            const receipt = await mintNFT(currentTrack.id, priceInWei)
            console.log("Minting successful:", receipt)
        } catch (error) {
            console.error("Error minting NFT:", error)
        } finally {
            setIsMinting(false)
        }
    }

    function handleArtistNav() {
        dialogRef.current.close()
        navigate(`${currentTrack.artist}`)
    }

    function handleCopy() {
        navigator.clipboard.writeText(currentTrack.id)
    }

    return (
        <dialog ref={dialogRef} className={styles.dialog}>
            <div className={styles.dialogContent}>
                <h1 className={styles.dialogHeading}>Mint NFT</h1>
                <div className={styles.songInfo}>
                    <img
                        src={currentTrack.imageUrl}
                        alt={currentTrack.name}
                        className={styles.coverArt}
                    />
                    <div>
                        <h3 className={styles.songTitle}>
                            {currentTrack.name}
                        </h3>
                        <p
                            className={styles.artistName}
                            onClick={handleArtistNav}
                        >
                            {currentTrack.artist}
                        </p>
                    </div>
                </div>
                <div className={styles.detail}>
                    <h2 className={styles.detailHeading}>Mint Price : </h2>
                    <h2 className={styles.detailValue}>{priceFormat} ETH</h2>
                    <h2 className={styles.detailValue}>(${priceInUSD} USD)</h2>
                </div>
                <div className={styles.detail}>
                    <h2 className={styles.detailHeading}>NFT Address : </h2>
                    <h2 className={styles.detailValue}>{currentTrack.id}</h2>
                    <Copy
                        className={styles.copy}
                        onClick={handleCopy}
                        size={17}
                    />
                </div>
                <div className={styles.detail}>
                    <h2 className={styles.detailHeading}>Genre : </h2>
                    <h2 className={styles.detailValue}>{genre}</h2>
                </div>
                <div className={styles.decisionButtons}>
                    <button
                        className={styles.mintButton}
                        disabled={isMinting}
                        onClick={handleMint}
                    >
                        {isMinting ? "Minting..." : "Mint"}
                    </button>
                    <button onClick={onClose} className={styles.closeButton}>
                        Close
                    </button>
                </div>
            </div>
        </dialog>
    )
}

export default MintModal
