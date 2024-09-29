import React, { useEffect } from "react"
import { useWeb3ModalAccount } from "@web3modal/ethers/react"
import { useNavigate } from "react-router-dom"
import styles from "./Profile.module.css"
import { useUser } from "../contexts/UserProvider"
import ProfileCard from "../components/ProfileCard"
import { useQuery } from "@tanstack/react-query"
import { gql, request } from "graphql-request"

const query = gql`
    query MyQuery {
        artist(id: "0x1abc133c222a185fede2664388f08ca12c208f76") {
            nfts {
                tokenURI
                mintPrice
                address
            }
        }
    }
`

const url = import.meta.env.VITE_SUBGRAPH_URL

function Profile() {
    const { address, isConnected } = useWeb3ModalAccount()
    const { user, fetchUser, applyForArtist } = useUser()
    const navigate = useNavigate()

    const { data, status } = useQuery({
        queryKey: ["nfts", address],
        queryFn: async () => await request(url, query, { artistId: address }),
        enabled: !!address, // Only run the query if the address is available
    })

    console.log(data)
    useEffect(() => {
        async function initializeUser() {
            if (address) {
                const newUser = await fetchUser(address)
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
                {/* Add more sections here as needed */}
            </div>
            <h1 className={styles.title}>Tracks Created</h1>
            {/* <div className={styles.headings}>
                <p className={styles.heading}>Track Name</p>
                <p className={styles.heading}>Price</p>
                <p className={styles.heading}>Sales</p>
            </div> */}
            <div>
                {status === "pending" && (
                    <div className={styles.notConnected}>Loading...</div>
                )}
                {status === "error" && (
                    <div className={styles.notConnected}>
                        Error occurred querying the Subgraph
                    </div>
                )}
                {status === "success" && (
                    <div className={styles.profileCardContent}>
                        {data.artist.nfts.map((nft) => (
                            <ProfileCard
                                key={nft.tokenURI}
                                uri={nft.tokenURI}
                                mintprice={nft.mintPrice}
                                address={nft.address}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Profile
