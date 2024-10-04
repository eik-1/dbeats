import React, { useEffect, useRef, useState } from "react"
import { ethers } from "ethers"
import styles from "./MintModal.module.css"
import { useMusic } from "../contexts/MusicProvider"
import mintNFT from "../Utils/mintNFT"

function MintModal({ isOpen, onClose }) {
    const { currentTrack } = useMusic()
    const [address, setAddress] = useState("")
    const [price, setPrice] = useState(0)
    const dialogRef = useRef(null)

    useEffect(() => {
        if (isOpen) {
            setAddress(currentTrack.id)
            dialogRef.current.showModal()
        } else {
            setAddress("")
            dialogRef.current.close()
        }
    }, [isOpen])

    async function handleMint() {}

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
                <div className={styles.quantity}>
                    <h2>Price</h2>
                    <h2>{price}</h2>
                </div>
                <div className={styles.decisionButtons}>
                    <button className={styles.mintButton} onClick={handleMint}>
                        Mint
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
