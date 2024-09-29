import React, { useEffect, useState } from "react"
import { Play, Pause } from "lucide-react"
import styles from "./ProfileCard.module.css"
import { Skeleton } from "./ui/Skeleton"
import { useMusic } from "../contexts/MusicProvider"
import alchemyFetch from "../Utils/AlchemyFetch"

function ProfileCard({ id, uri , mintprice, address}) {
    const [name, setName] = useState("")
    const [imageUrl, setImageUrl] = useState("")
    // const [musicUrl, setMusicUrl] = useState("")
    const [artist, setArtist] = useState("")
    const [loading, setLoading] = useState(true)
    const [numberOfOwners, setNumberOfOwners] = useState(0)

    // const { currentTrack, isPlaying, play, pauseTrack } = useMusic()



    // ******************************************************************
    // fetch sales and number of ticketsremaining from smart contract 
    // *********************************************************************



    useEffect(() => {
        const fetchNftData = async () => {
            try {
                // console.log("rui", uri)
                const response = await fetch(uri)
                // console.log("response", response)
                const data = await response.json()
                setName(data.name)
                setImageUrl(data.image)
                // setMusicUrl(data.animation_url)
                setArtist(data.attributes[0].value)
                const numberOfOwners = await alchemyFetch(address)
                setNumberOfOwners(numberOfOwners)
                
            } catch (error) {
                console.error("Error fetching NFT data:", error)
            } finally {
                setLoading(false)
            }
            
        }

        fetchNftData()
    }, [uri])

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
