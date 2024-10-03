import React, { useEffect, useState } from "react"
import { Skeleton } from "./ui/Skeleton"
import styles from "./ProfileCard.module.css"
// import { useMusic } from "../contexts/MusicProvider"
// import alchemyFetch from "../Utils/AlchemyFetch"

function ProfileCard({ id, uri , mintprice, address}) {
    const [name, setName] = useState("")
    const [imageUrl, setImageUrl] = useState("")
    // const [musicUrl, setMusicUrl] = useState("")
    const [artist, setArtist] = useState("")
    const [loading, setLoading] = useState(true)
    const [numberOfOwners, setNumberOfOwners] = useState(0)

    // const { currentTrack, isPlaying, play, pauseTrack } = useMusic()

    useEffect(() => {
        const fetchNftData = async () => {
            try {
                // Fetch data from the Express server endpoint
                const response = await fetch(`http://localhost:3000/nftData?uri=${encodeURIComponent(uri)}&address=${address}`);
                const data = await response.json();

                // Update state with the fetched data
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

    // const handlePlayClick = () => {
    //     if (currentTrack && currentTrack.id === id && isPlaying) {
    //         pauseTrack()
    //     } else {
    //         play({ id, name, artist, musicUrl, imageUrl })
    //     }
    // }

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
                    <p>Tickets Sold : {numberOfOwners}</p>
                </div>

                {/* <button className={styles.playButton} onClick={handlePlayClick}>
                    {currentTrack && currentTrack.id === id && isPlaying ? (
                        <Pause size={23} fill="#000" />
                    ) : (
                        <Play size={23} fill="#000" />
                    )}
                </button> */}
            </div>
        </div>
    )
}

export default ProfileCard
