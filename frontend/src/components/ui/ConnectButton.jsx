import React, { useEffect } from "react"
import Avvvatars from "avvvatars-react"
import { useWeb3Modal, useWeb3ModalAccount } from "@web3modal/ethers/react"

import styles from "./ConnectButton.module.css"
import { useUser } from "../../contexts/UserProvider"

export default function ConnectButton() {
    const { open } = useWeb3Modal()
    const { isConnected, address } = useWeb3ModalAccount()
    const { createUser, fetchUser } = useUser()

    useEffect(() => {
        async function initializeUser() {
            if (isConnected && address) {
                const user = await fetchUser(address)
                if (!user) {
                    const newUser = {
                        name: "User",
                        about: "",
                        profilePicture:
                            "https://indigo-neighbouring-smelt-221.mypinata.cloud/ipfs/QmSJVuP5U1G3Wm4b3dgJWV1rcK19pbdPtUkRvJPYe8MBQa",
                        walletAddress: address,
                        isArtist: false,
                        twitterUsername: "",
                    }
                    await createUser(newUser)
                }
            }
        }
        initializeUser()
    }, [isConnected, address])

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
