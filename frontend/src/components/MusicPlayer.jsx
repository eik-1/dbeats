import React, { useState, useEffect } from "react"
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react"

import MintModal from "./MintModal"
import styles from "./MusicPlayer.module.css"
import { useMusic } from "../contexts/MusicProvider"

function MusicPlayer() {
    const {
        currentTrack,
        isPlaying,
        play,
        pauseTrack,
        resumeTrack,
        seekTo,
        setVolume,
        audioRef,
    } = useMusic()
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [isMintModalOpen, setIsMintModalOpen] = useState(false)

    useEffect(() => {
        const audio = audioRef.current
        const updateProgress = () => setCurrentTime(audio.currentTime)
        const updateDuration = () => setDuration(audio.duration)

        audio.addEventListener("timeupdate", updateProgress)
        audio.addEventListener("loadedmetadata", updateDuration)

        return () => {
            audio.removeEventListener("timeupdate", updateProgress)
            audio.removeEventListener("loadedmetadata", updateDuration)
        }
    }, [audioRef])

    function handleMintClick() {
        setIsMintModalOpen(true)
    }

    function handleCloseMintModal() {
        setIsMintModalOpen(false)
    }

    const togglePlay = () => {
        if (isPlaying) {
            pauseTrack()
        } else {
            resumeTrack()
        }
    }

    const handleProgressChange = (e) => {
        const newTime = e.target.value
        setCurrentTime(newTime)
        seekTo(newTime)
    }

    const handleVolumeChange = (e) => {
        setVolume(e.target.value)
    }

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
    }

    if (!currentTrack) return null

    return (
        <div className={styles.musicPlayer}>
            <div className={styles.songInfo}>
                <img
                    src={currentTrack.imageUrl}
                    alt={currentTrack.name}
                    className={styles.coverArt}
                />
                <div>
                    <h3 className={styles.songTitle}>{currentTrack.name}</h3>
                    <p className={styles.artistName}>{currentTrack.artist}</p>
                </div>
            </div>
            <div className={styles.controls}>
                <div className={styles.progressContainer}>
                    <span className={styles.timeControl}>
                        {formatTime(currentTime)}
                    </span>
                    <input
                        type="range"
                        min="0"
                        max={duration}
                        value={currentTime}
                        onChange={handleProgressChange}
                        className={styles.progressBar}
                    />
                    <span className={styles.timeControl}>
                        {formatTime(duration)}
                    </span>
                </div>
                <div className={styles.playControl}>
                    <button className={styles.controlButton} onClick={() => {}}>
                        <SkipBack size={20} fill="#424242" />
                    </button>
                    <button className={styles.playButton} onClick={togglePlay}>
                        {isPlaying ? (
                            <Pause size={24} fill="#48CFCB" />
                        ) : (
                            <Play size={24} fill="#48CFCB" />
                        )}
                    </button>
                    <button className={styles.controlButton} onClick={() => {}}>
                        <SkipForward size={20} fill="#424242" />
                    </button>
                </div>
            </div>
            <div className={styles.volumeControl}>
                <Volume2 size={20} />
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    onChange={handleVolumeChange}
                    className={styles.volumeSlider}
                />
            </div>
            <button onClick={handleMintClick} className={styles.mintButton}>
                Mint
            </button>
            <MintModal
                isOpen={isMintModalOpen}
                onClose={handleCloseMintModal}
                currentTrack={currentTrack}
            />
        </div>
    )
}

export default MusicPlayer
