import React, { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Pen } from "lucide-react"

import { pinata } from "../Utils/pinataConfig"
import { useUser } from "../contexts/UserProvider"
import styles from "./EditProfile.module.css"

const EditProfile = () => {
    const { user, updateUser } = useUser()
    const [selectedFile, setSelectedFile] = useState()
    const [profPicture, setProfPicture] = useState(user.profilePicture)
    const [name, setName] = useState(user.name)
    const [about, setAbout] = useState(user.about)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const navigate = useNavigate()

    const fileInputRef = useRef(null)

    function handleImageClick() {
        fileInputRef.current.click()
    }

    /*
    cid: "bafybeigl3teghuouu52doxahbcmi7iyyhb354i34fjyezd7bmanvod2uwe"
    id: "0191b911-bf9d-7f31-bc69-3958efbe9348"
    indexed_at: "2024-09-03T18:07:23.841Z"
    mime_type: "image/png"
    name: "Screenshot_4.png"
    number_of_files : 1
    size: 1581842   
    user_id: "a9ac988c-5ac2-4133-b655-19d4b3468328"     
    */

    async function handleSubmit(e) {
        try {
            setIsLoading(true)
            e.preventDefault()
            const upload = await pinata.upload.file(selectedFile)
            const signedUrl = await pinata.gateways.createSignedURL({
                cid: upload.cid,
            })
            const newUser = {
                ...user,
                profilePicture: signedUrl,
                name,
                about,
            }
            updateUser(newUser)
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
            navigate("/profile")
        }
    }

    function handleFileChange(e) {
        const file = e.target.files[0]
        const maxSize = 2 * 1024 * 1024 // 2MB in bytes

        if (file && file.size > maxSize) {
            setError("File size exceeds 2MB.")
            e.target.value = null
            return
        }
        setSelectedFile(file)
        if (file) {
            setError("")
            const reader = new FileReader()
            reader.onloadend = () => {
                setProfPicture(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    return (
        <div className={styles.editProfileContainer}>
            <h2 className={styles.title}>Edit Profile</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                    <div
                        className={styles.profilePictureContainer}
                        onClick={handleImageClick}
                    >
                        <img
                            src={profPicture}
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
                <div className={styles.inputGroup}>
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={styles.input}
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="about">About</label>
                    <textarea
                        id="about"
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                        className={styles.textarea}
                    />
                </div>
                <div className={styles.buttonGroup}>
                    <button
                        type="submit"
                        className={styles.saveButton}
                        disabled={isLoading}
                    >
                        {isLoading ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/profile")}
                        className={styles.cancelButton}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}

export default EditProfile
