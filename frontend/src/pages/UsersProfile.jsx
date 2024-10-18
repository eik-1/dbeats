import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Link } from "react-router-dom"
import styles from "./UsersProfile.module.css"
import ProfileCard from "../components/ProfileCard"
import { useUser } from "../contexts/UserProvider"

function UsersProfile() {
    const { searchUsers } = useUser()
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [nftData, setNftData] = useState(null)
    const [queryStatus, setQueryStatus] = useState("idle")
    const [queryError, setQueryError] = useState(null)

    const { name } = useParams()

    useEffect(() => {
        if (user && user.walletAddress) {
            setQueryStatus("pending")
            fetch(
                `http://localhost:3000/userNfts?walletAddress=${user.walletAddress}`,
            )
                .then((response) => response.json())
                .then((result) => {
                    setNftData(result)
                    setQueryStatus("success")
                })
                .catch((err) => {
                    console.error("Error fetching data:", err)
                    setQueryError(err)
                    setQueryStatus("error")
                })
        }
    }, [user])

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
            </div>
            <h1 className={styles.title}>Tracks Created</h1>
            <div>
                {queryStatus === "pending" && (
                    <div className={styles.notConnected}>Loading...</div>
                )}
                {queryStatus === "error" && (
                    <div className={styles.notConnected}>
                        Error occurred querying the server: {queryError.message}
                    </div>
                )}
                {queryStatus === "success" && (
                    <div className={styles.profileCardContent}>
                        {nftData.artist ? (
                            nftData.artist.nfts.map((nft) => (
                                <Link to={`/track/${nft.address}`} state={{ address: nft.address }} key={nft.address} className={styles.profileCardContent}>
                                <ProfileCard
                                    key={nft.tokenURI}
                                    uri={nft.tokenURI}
                                    mintprice={nft.mintPrice}
                                    address={nft.address}
                                />
                                </Link>
                            ))
                        ) : (
                            <div className={styles.notConnected}>
                                No artist data found for the given address.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default UsersProfile
