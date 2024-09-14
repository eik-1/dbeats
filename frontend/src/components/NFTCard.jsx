import React, { useEffect, useState } from "react"
import { Play } from "lucide-react"
import styles from "./NFTCard.module.css"
import { Skeleton } from "./ui/Skeleton"

function NFTCard({ id, uri }) {
    const [name, setName] = useState("")
    const [imageUrl, setImageUrl] = useState("")
    const [musicUrl, setMusicUrl] = useState("")
    const [artist, setArtist] = useState("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchNftData = async () => {
            console.log(uri)
            try {
                const response = await fetch(uri)
                const data = await response.json()
                setName(data.name)
                setImageUrl(data.image)
                setMusicUrl(data.animation_url)
                setArtist(data.attributes[0].value)
            } catch (error) {
                console.error("Error fetching NFT data:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchNftData()
    }, [uri])

    if (loading) {
        return <Skeleton className="h-[125px] w-[250px] rounded-xl" />
    }

    return (
        <div className={styles.card}>
            <img src={imageUrl} alt={name}></img>
            <div className={styles.overlay}></div>
            <div className={styles.info}>
                <div className={styles.cardInfo}>
                    <h1 className={styles.trackName}>{name}</h1>
                    <h2 className={styles.artistName}>{artist}</h2>
                </div>
                <button className={styles.playButton}>
                    <Play size={23} fill="#000" />
                </button>
            </div>
        </div>
    )
}

export default NFTCard
