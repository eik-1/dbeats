import React, { createContext, useState, useContext, useRef } from "react"

const MusicContext = createContext()

function MusicProvider({ children }) {
    const [currentTrack, setCurrentTrack] = useState(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [musicAddress, setMusicAddress] = useState(null)
    const audioRef = useRef(new Audio())

    function setAddress({ address }) {
        setMusicAddress(address)
    }

    function play(track) {
        if (currentTrack && currentTrack.id === track.id) {
            resumeTrack()
        } else {
            setCurrentTrack(track)
            audioRef.current.src = track.musicUrl
            audioRef.current.play()
            setIsPlaying(true)
        }
    }

    function pauseTrack() {
        audioRef.current.pause()
        setIsPlaying(false)
    }

    function resumeTrack() {
        audioRef.current.play()
        setIsPlaying(true)
    }

    function seekTo(time) {
        audioRef.current.currentTime = time
    }

    function setVolume(level) {
        audioRef.current.volume = level
    }

    return (
        <MusicContext.Provider
            value={{
                currentTrack,
                isPlaying,
                play,
                pauseTrack,
                resumeTrack,
                seekTo,
                setVolume,
                setAddress,
                audioRef,
            }}
        >
            {children}
        </MusicContext.Provider>
    )
}

function useMusic() {
    const context = useContext(MusicContext)
    if (!context) throw new Error("useAuth must be used within an AuthProvider")
    return context
}

export { MusicProvider, useMusic }
