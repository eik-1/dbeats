import React, { useState, useEffect, useRef } from "react"
import { Search } from "lucide-react"

import styles from "./Navbar.module.css"
import ConnectButton from "./ui/ConnectButton"
import { useUser } from "../contexts/UserProvider"

function Navbar() {
    const [searchResults, setSearchResults] = useState([])
    const [searchQuery, setSearchQuery] = useState("")
    const [showResults, setShowResults] = useState(false)
    const { searchUsers } = useUser()
    const dropdownRef = useRef(null)

    async function handleSearch(e) {
        e.preventDefault()
        setShowResults(false)
        setSearchResults([])

        if (searchQuery.trim() === "") {
            return
        }

        try {
            const results = await searchUsers(searchQuery)
            setSearchResults(results)
            setShowResults(results.length > 0)
        } catch (error) {
            console.error("Error searching users:", error)
        }
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setShowResults(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    return (
        <div className={styles.topNavbar}>
            <form className={styles.searchContainer} onSubmit={handleSearch}>
                <Search size={24} strokeWidth={3} />
                <input
                    type="text"
                    placeholder="Search"
                    className={styles.searchBar}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </form>
            {showResults && searchResults.length > 0 && (
                <div className={styles.searchResults} ref={dropdownRef}>
                    {searchResults.map((user) => (
                        <div key={user.id} className={styles.searchResultItem}>
                            <img
                                src={user.profilePicture}
                                alt={user.name}
                                className={styles.profilePicture}
                            />
                            <span>{user.name}</span>
                        </div>
                    ))}
                </div>
            )}
            <ConnectButton />
        </div>
    )
}

export default Navbar
