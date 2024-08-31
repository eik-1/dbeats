import React from "react"
import { useWeb3ModalAccount } from "@web3modal/ethers/react"
import styles from "./Profile.module.css"
import { useUser } from "../contexts/UserProvider"

function Profile() {
    const { address, isConnected } = useWeb3ModalAccount()
    const { user } = useUser()

    if (!isConnected) {
        return (
            <div className={styles.notConnected}>
                Please connect your wallet to view your profile.
            </div>
        )
    }

    return (
        <div className={styles.profileContainer}>
            <div className={styles.profileHeader}>
                <img
                    src={user.profilePicture}
                    alt={user.name}
                    className={styles.profilePicture}
                />
                <div className={styles.profileInfo}>
                    <h1 className={styles.name}>{user.name}</h1>
                    <p className={styles.address}>{address}</p>
                </div>
                <button className={styles.editButton}>Edit Profile</button>
            </div>
            <div className={styles.profileContent}>
                <h2 className={styles.sectionTitle}>About</h2>
                <p className={styles.about}>{user.about}</p>
                {/* Add more sections here as needed */}
            </div>
        </div>
    )
}

export default Profile
