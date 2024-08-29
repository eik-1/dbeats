import { Outlet } from "react-router-dom"

import Sidebar from "../components/Sidebar"
import Navbar from "../components/Navbar"
import styles from "./AppLayout.module.css"

function AppLayout() {
    return (
        <div className={styles.appLayout}>
            <Sidebar />
            <Navbar />
            <Outlet />
        </div>
    )
}

export default AppLayout
