import React, { useEffect, useRef } from "react"
import styles from "./MintModal.module.css"
import { useMusic } from "../contexts/MusicProvider"

function MintModal({ isOpen, onClose }) {
    const { currentTrack } = useMusic()
    const dialogRef = useRef(null)

    useEffect(() => {
        if (isOpen) {
            dialogRef.current.showModal()
        } else {
            dialogRef.current.close()
        }
    }, [isOpen])

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
                    <h2>Quantity</h2>
                </div>
                <div className={styles.decisionButtons}>
                    <button className={styles.mintButton}>Mint</button>
                    <button onClick={onClose} className={styles.closeButton}>
                        Close
                    </button>
                </div>
            </div>
        </dialog>
    )
}

export default MintModal
