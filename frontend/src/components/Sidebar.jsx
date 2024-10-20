import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { Home, Music, Compass, User, Plus } from "lucide-react"
import { useWeb3ModalAccount } from "@web3modal/ethers/react"
import logo from "../images/logo.png"
import styles from "./Sidebar.module.css"
import { useUser } from "../contexts/UserProvider"

function Sidebar() {
    const { isConnected } = useWeb3ModalAccount()
    const navigate = useNavigate()
    const { user } = useUser()

    function handleCreateNFT() {
        navigate("/create")
    }

    return (
        <div className={styles.sidebar}>
            <div className={styles.logo}>
                <img src={logo} alt="logo" />
            </div>
            <nav className={styles.navigation}>
                <SidebarItem
                    icon={<Home size={25} strokeWidth={3} />}
                    text="Home"
                    to="/"
                />
                <SidebarItem
                    icon={<Compass size={25} strokeWidth={3} />}
                    text="Explore"
                    to="/market"
                />
                {isConnected && (
                    <>
                        <SidebarItem
                            icon={<Music size={25} strokeWidth={3} />}
                            text="My Music"
                            to="/my-music"
                        />
                        <SidebarItem
                            icon={<User size={25} strokeWidth={3} />}
                            text="Profile"
                            to="/profile"
                        />
                    </>
                )}
            </nav>
            {isConnected && user?.isArtist && (
                <button
                    className={styles.createNFTButton}
                    onClick={handleCreateNFT}
                >
                    <Plus size={23} strokeWidth={3} /> Create NFT
                </button>
            )}
        </div>
    )
}

function SidebarItem({ icon, text, to }) {
    return (
        <Link to={to} className={styles.sidebarLink}>
            {icon}
            <span>{text}</span>
        </Link>
    )
}

export default Sidebar
