import React, { useEffect, useRef, useState } from "react"
import axios from "axios"
import { Copy } from "lucide-react"

import styles from "./MintModal.module.css"

const BASE_URL = "http://localhost:3000"

function MintModal({ isOpen, onClose, currentTrack }) {
    const [price, setPrice] = useState(0)
    const [priceInUSD, setPriceInUSD] = useState(0)
    const [isMinting, setIsMinting] = useState(false)
    const dialogRef = useRef(null)

    useEffect(() => {
        if (isOpen) {
            fetchPrice()
            dialogRef.current.showModal()
        } else {
            dialogRef.current.close()
        }
    }, [isOpen])

    async function fetchPrice() {
        try {
            const response = await axios.get(
                `${BASE_URL}/nft/price/${currentTrack.id}`,
            )
            setPrice(response.data.price)
        } catch (error) {
            console.error("Error fetching price:", error)
        }
    }

    async function handleMint() {
        setIsMinting(true)
        const address = currentTrack.id
        const quantity = 1
        try {
            const response = await axios.post(`${BASE_URL}/nft/mint`, {
                address,
                quantity,
            })
            console.log("Minting successful:", response.data)
            onClose()
        } catch (error) {
            console.error(
                "Error minting NFT:",
                error.response ? error.response.data : error.message,
            )
        } finally {
            setIsMinting(false)
        }
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
                        <p className={styles.artistName}>
                            {currentTrack.artist}
                        </p>
                    </div>
                </div>
                <div className={styles.detail}>
                    <h2 className={styles.detailHeading}>Mint Price : </h2>
                    <h2 className={styles.detailValue}>{price} ETH</h2>
                    <h2 className={styles.detailValue}>(${priceInUSD})</h2>
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
