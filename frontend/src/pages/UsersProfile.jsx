import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import styles from "./UsersProfile.module.css"
import { useUser } from "../contexts/UserProvider"

function UsersProfile() {
    const { searchUsers } = useUser()
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const { name } = useParams()

    useEffect(() => {
        async function initializeUser() {
            setLoading(true)
            const newUser = await searchUsers(name)
            setUser(newUser[0])
            setLoading(false)
        }
        initializeUser()
    }, [name, searchUsers])

    if (loading) {
        return <div>Loading...</div>
    }

    if (!user) {
        return <div>User not found</div>
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
                    <p className={styles.address}>{user.walletAddress}</p>
                </div>
                <div className={styles.profileButtons}>
                    <button className={styles.followButton}>Follow</button>
                </div>
            </div>
            <div className={styles.profileContent}>
                <h2 className={styles.sectionTitle}>About</h2>
                <p className={styles.about}>{user.about}</p>
                {/* Add more sections here as needed */}
            </div>
        </div>
    )
}

export default UsersProfile
