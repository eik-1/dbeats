import React from "react"
import Avvvatars from "avvvatars-react"
import { useWeb3Modal, useWeb3ModalAccount } from "@web3modal/ethers/react"
import styles from "./ConnectButton.module.css"

export default function ConnectButton() {
    const { open } = useWeb3Modal()
    const { isConnected, address } = useWeb3ModalAccount()

    const handleClick = () => {
        if (isConnected) {
            open()
        } else {
            open()
        }
    }

    return (
        <div className={styles.connectButton} onClick={handleClick}>
            {isConnected ? (
                <div className={styles.avatarContainer}>
                    <div className={styles.avatar}>
                        <Avvvatars
                            style="shape"
                            value={address}
                            size={40}
                            shadow={true}
                            border={true}
                            borderColor="#48CFCB"
                        />
                    </div>
                    <span className={styles.networkIndicator}></span>
                </div>
            ) : (
                <button>Connect</button>
            )}
        </div>
    )
}
