import React, { useEffect } from "react"
import { useWeb3ModalAccount } from "@web3modal/ethers/react"
import { useNavigate, Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import styles from "./Profile.module.css"
import { useUser } from "../contexts/UserProvider"
import ProfileCard from "../components/ProfileCard"

function Profile() {
    const { address, isConnected } = useWeb3ModalAccount()
    const { user, fetchUser, applyForArtist } = useUser()
    const navigate = useNavigate()
    const serverUrl = import.meta.env.VITE_SERVER_URL
    let newAddress

    if (address) {
        newAddress = address.toLowerCase()
    }

    const { data, status, error } = useQuery({
        queryKey: ["nfts", newAddress],
        queryFn: async () => {
            if (newAddress) {
                console.log("Fetching data for artistId:", newAddress)
                try {
                    const response = await fetch(
                        `${serverUrl}/userNfts?walletAddress=${newAddress}`,
                    )
                    const result = await response.json()
                    console.log("Response from server:", result)
                    return result
                } catch (err) {
                    console.error("Error fetching data:", err)
                    throw err
                }
            }
        },
        enabled: !!newAddress,
    })

    useEffect(() => {
        async function initializeUser() {
            if (address) {
                const newUser = await fetchUser(address)
                console.log("Fetched user:", newUser)
            }
        }
        initializeUser()
    }, [isConnected, address])

    async function handleApply() {
        await applyForArtist()
        window.location.reload()
    }

    if (!isConnected || !user) {
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
                <div className={styles.profileButtons}>
                    {!user.hasApplied ? (
                        <button
                            onClick={handleApply}
                            className={styles.applyButton}
                        >
                            Apply For Artist
                        </button>
                    ) : user.isArtist ? (
                        <></>
                    ) : (
                        <button disabled className={styles.appliedButton}>
                            Applied
                        </button>
                    )}

                    <button
                        onClick={() => navigate("/profile/edit")}
                        className={styles.editButton}
                    >
                        Edit Profile
                    </button>
                </div>
            </div>
            <div className={styles.profileContent}>
                <h2 className={styles.sectionTitle}>About</h2>
                <p className={styles.about}>{user.about}</p>
            </div>
            <h1 className={styles.title}>Tracks Created</h1>
            <div>
                {status === "pending" && (
                    <div className={styles.notConnected}>Loading...</div>
                )}
                {status === "error" && (
                    <div className={styles.notConnected}>
                        Error occurred querying the server: {error.message}
                    </div>
                )}
                {status === "success" && (
                    <div className={styles.profileCardContent}>
                        {data.artist ? (
                            data.artist.nfts.map((nft) => (
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

export default Profile
