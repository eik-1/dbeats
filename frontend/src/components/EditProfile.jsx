import React, { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Pen } from "lucide-react"

import { useUser } from "../contexts/UserProvider"
import styles from "./EditProfile.module.css"

const EditProfile = () => {
    const { user, updateUser } = useUser()
    const [profilePicture, setProfilePicture] = useState(user.profilePicture)
    const [name, setName] = useState(user.name)
    const [about, setAbout] = useState(user.about)
    const navigate = useNavigate()

    const fileInputRef = useRef(null)

    function handleImageClick() {
        fileInputRef.current.click()
    }

    function handleSubmit(e) {
        e.preventDefault()
        const newUser = {
            ...user,
            profilePicture,
            name,
            about,
        }
        updateUser(newUser)
        navigate("/profile")
    }

    function handleFileChange(e) {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setProfilePicture(reader.result)
            }
            reader.readAsDataURL(file)
        }
        console.log(profilePicture)
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
                            src={profilePicture}
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
                    <p>Max 2MB. (.jpg, .png)</p>
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
                    <button type="submit" className={styles.saveButton}>
                        Save Changes
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
