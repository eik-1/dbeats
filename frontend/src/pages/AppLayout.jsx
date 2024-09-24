import { Outlet } from "react-router-dom"

import Sidebar from "../components/Sidebar"
import Navbar from "../components/Navbar"
import MusicPlayer from "../components/MusicPlayer"
import styles from "./AppLayout.module.css"

function AppLayout() {
    return (
        <div className={styles.appLayout}>
            <Sidebar />
            <Navbar />
            <div className={styles.mainContent}>
                <Outlet />
            </div>
            <MusicPlayer />
        </div>
    )
}

export default AppLayout
