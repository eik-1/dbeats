import React, { useState, useRef, useEffect } from "react"
import { Pen, Music } from "lucide-react"
import { useWeb3ModalAccount } from "@web3modal/ethers/react"
import { ethers } from "ethers"

import styles from "./Create.module.css"
import { useUser } from "../contexts/UserProvider"
import ipfsUpload from "../Utils/ipfsUpload"
import jsonUpload from "../Utils/jsonUpload"
import Mint from "../Utils/Mint"

const Create = () => {
    const { user } = useUser()
    const { address } = useWeb3ModalAccount()

    /* State Variables For UI Changes using useRef */
    const [musicImage, setMusicImage] = useState()

    /* State Variables For Music Details */
    const [selectedImageFile, setSelectedImageFile] = useState()
    const [selectedTrack, setSelectedTrack] = useState(null)
    const [releaseName, setReleaseName] = useState("")
    const [genre, setGenre] = useState("")
    const [mintPrice, setMintPrice] = useState("")
    const [ipfsImageUrl, setIpfsImageUrl] = useState("")
    const [ipfsTrackUrl, setIpfsTrackUrl] = useState("")
    const [jsonUrl, setJsonUrl] = useState("")

    /* State Variables For Form Validation */
    const [isFormValid, setIsFormValid] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [formError, setFormError] = useState("")

    /* Refs For Input Fields */
    const fileInputRef = useRef(null)
    const trackInputRef = useRef(null)

    /* Form Validation (Check If All Fields Are Filled) */
    useEffect(() => {
        const checkFormValidity = () => {
            const isValid =
                musicImage &&
                releaseName.trim() !== "" &&
                genre !== "" &&
                mintPrice.trim() !== "" &&
                selectedTrack !== null
            setIsFormValid(isValid)
        }

        checkFormValidity()
    }, [musicImage, releaseName, genre, mintPrice, selectedTrack])

    /* Form Submit Function */
    async function handleSubmit(e) {
        e.preventDefault()
        setIsLoading(true)
        try {
            setFormError("")
            if (musicImage) {
                const imageUrl = await ipfsUpload(selectedImageFile)
                console.log("ipfs url for image: ", imageUrl)
                setIpfsImageUrl(imageUrl)
            } else {
                console.log("no image selected")
            }

            if (selectedTrack) {
                const trackUrl = await ipfsUpload(selectedTrack)
                console.log("ipfs url for track: ", trackUrl)
                setIpfsTrackUrl(trackUrl)
            } else {
                console.log("no track selected")
            }
        } catch (error) {
            setFormError(error.message)
            console.error("Error uploading to ipfs:", error)
        }

        try {
            if (ipfsImageUrl && ipfsTrackUrl) {
                const json = {
                    name: releaseName,
                    description: "description",
                    image: ipfsImageUrl,
                    animation_url: ipfsTrackUrl,
                    attributes: [
                        {
                            trait_type: "artist",
                            value: user.name,
                        },
                        {
                            trait_type: "genre",
                            value: genre,
                        },
                    ],
                }
                const jsonReciept = await jsonUpload(json)
                setJsonUrl(jsonReciept)
                console.log("json url: ", jsonReciept)
            } else {
                console.error("Error generating json")
            }
        } catch (error) {
            setFormError(error.message)
            console.error("Error generating json:", error)
        }

        try {
            if (ipfsImageUrl) {
                console.log("Minting NFT... ", address)
                const price = ethers.parseUnits(mintPrice, "ether")
                const tx = await Mint({
                    user: address,
                    uri: jsonUrl,
                    name: releaseName,
                    symbol: "DBNFT",
                    price: price,
                    genre: genre,
                })
                console.log("mint tx: ", tx)
            } else {
                console.error("Error Minting The NFT")
            }
        } catch (error) {
            setFormError(error.message)
            console.error("Error Minting The NFT:", error)
        } finally {
            setIsLoading(false)
        }
    }

    /* Handle Track Functions */
    function handleTrackChange(e) {
        const file = e.target.files[0]
        const maxSize = 20 * 1024 * 1024
        if (file && file.size > maxSize) {
            setError("File size exceeds 20MB.")
            e.target.value = null
            return
        }
        if (file) {
            setError("")
            setSelectedTrack(file)
        }
    }

    function handleTrackClick() {
        trackInputRef.current.click()
    }

    /* Handle Image Functions */
    async function handleImageClick() {
        fileInputRef.current.click()
    }

    function handleFileChange(e) {
        const file = e.target.files[0]
        const maxSize = 2 * 1024 * 1024 // 2MB in bytes

        if (file && file.size > maxSize) {
            setError("File size exceeds 2MB.")
            e.target.value = null
            return
        }
        setSelectedImageFile(file)
        if (file) {
            setError("")
            const reader = new FileReader()
            reader.onloadend = () => {
                setMusicImage(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    if (!user?.isArtist) {
        return (
            <div className={styles.container}>
                <h1 className={styles.heading}>You are not an artist</h1>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Create Your Release</h1>
            <form method="POST" className={styles.form}>
                <div className={styles.inputGroup}>
                    <label htmlFor="musicImage">1. Pick a cover image</label>
                    <div
                        className={styles.profilePictureContainer}
                        onClick={handleImageClick}
                    >
                        <img
                            src={musicImage}
                            alt="Profile"
                            className={styles.profilePicture}
                        />
                        <div className={styles.profilePictureOverlay}>
                            <Pen className={styles.penIcon} />
                        </div>
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        style={{ display: "none" }}
                    />
                    <p>{error ? error : "Max 2MB. (.jpg, .png)"}</p>
                </div>
                <div className={styles.nameAndGenre}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="musicName">
                            2. What's the release called ?
                        </label>
                        <input
                            type="text"
                            id="releaseName"
                            name="releaseName"
                            placeholder="Release Name"
                            className={styles.inputBox}
                            value={releaseName}
                            onChange={(e) => setReleaseName(e.target.value)}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="musicGenre">3. Select a genre</label>
                        <select
                            id="musicGenre"
                            name="musicGenre"
                            className={styles.inputBox}
                            value={genre}
                            onChange={(e) => setGenre(e.target.value)}
                        >
                            <option value="">Select a genre</option>
                            <option value="Hip-Hop">Hip Hop</option>
                            <option value="Rap">Rap</option>
                            <option value="Rock">Rock</option>
                            <option value="Pop">Pop</option>
                            <option value="Electronic">Electronic</option>
                            <option value="Country">Country</option>
                        </select>
                    </div>
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="musicFile">4. Mint Price</label>
                    <div className={styles.mintPriceContainer}>
                        <input
                            type="number"
                            id="mintPrice"
                            name="mintPrice"
                            placeholder="Mint Price"
                            className={styles.inputBox}
                            value={mintPrice}
                            onChange={(e) => setMintPrice(e.target.value)}
                        />
                        <span className={styles.currencySymbol}>ETH</span>
                    </div>
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="musicTrack">
                        5. Select your music track
                    </label>
                    <div
                        className={styles.musicTrackContainer}
                        onClick={handleTrackClick}
                    >
                        {selectedTrack ? (
                            <p className={styles.selectedTrackName}>
                                {selectedTrack.name}
                            </p>
                        ) : (
                            <div className={styles.musicTrackPlaceholder}>
                                <Music className={styles.musicIcon} />
                                <p>Click to select a track</p>
                            </div>
                        )}
                    </div>
                    <input
                        type="file"
                        ref={trackInputRef}
                        onChange={handleTrackChange}
                        accept="audio/*"
                        style={{ display: "none" }}
                    />
                    <p>Max 20MB. (.mp3, .wav)</p>
                </div>
                <button
                    type="submit"
                    className={styles.submitButton}
                    onClick={handleSubmit}
                    disabled={isLoading || !isFormValid}
                >
                    {formError ? (
                        <span className={styles.error}>{formError}</span>
                    ) : isLoading ? (
                        "Minting..."
                    ) : (
                        "Create"
                    )}
                </button>
            </form>
        </div>
    )
}

export default Create
