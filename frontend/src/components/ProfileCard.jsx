import React, { useEffect, useState } from "react"
import { Skeleton } from "./ui/Skeleton"
import styles from "./ProfileCard.module.css"

function ProfileCard({ id, uri , mintprice, address}) {
    const [name, setName] = useState("")
    const [imageUrl, setImageUrl] = useState("")
    const [artist, setArtist] = useState("")
    const [loading, setLoading] = useState(true)
    const [numberOfOwners, setNumberOfOwners] = useState(0)



    useEffect(() => {
        const fetchNftData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/nftData?uri=${encodeURIComponent(uri)}&address=${address}`);
                const data = await response.json();
                setName(data.name);
                setImageUrl(data.image);
                setArtist(data.artist);
                setNumberOfOwners(data.numberOfOwners);
            } catch (error) {
                console.error("Error fetching NFT data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNftData();
    }, [uri, address]);

    if (loading) {
        return <Skeleton className="h-[125px] w-[250px] rounded-xl" />
    }

    return (
        <div className={styles.card}>
            <img className={styles.image} src={imageUrl} alt={name}></img>
            <div className={styles.overlay}></div>
            <div className={styles.info}>
                <div className={styles.cardInfo}>
                    <h1 className={styles.trackName}>{name}</h1>
                    <p>Mint Price : {mintprice / 10 ** 18} ETH</p>
                    <p>Copies Sold : {numberOfOwners}</p>
                </div>
            </div>
        </div>
    )
}

export default ProfileCard
