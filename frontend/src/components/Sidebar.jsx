import React from "react"
import { Link } from "react-router-dom"
import { Home, TrendingUp, Globe, User } from "lucide-react"
import { useWeb3ModalAccount } from "@web3modal/ethers/react"

import styles from "./Sidebar.module.css"

function Sidebar() {
    const { isConnected } = useWeb3ModalAccount()
    return (
        <div className={styles.sidebar}>
            <div className={styles.logo}>
                <span>Dbeats</span>
            </div>
            <nav className={styles.navigation}>
                <SidebarItem
                    icon={<Home size={25} strokeWidth={3} />}
                    text="Home"
                    to="/"
                />
                <SidebarItem
                    icon={<TrendingUp size={25} strokeWidth={3} />}
                    text="Viral Sounds"
                    to="/trending"
                />
                <SidebarItem
                    icon={<Globe size={25} strokeWidth={3} />}
                    text="Explore"
                    to="/market"
                />
                {isConnected && (
                    <SidebarItem
                        icon={<User size={25} strokeWidth={3} />}
                        text="Profile"
                        to="/profile"
                    />
                )}
            </nav>
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
