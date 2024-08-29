import ConnectButton from "./ui/ConnectButton"
import { Search } from "lucide-react"

import styles from "./Navbar.module.css"

function Navbar() {
    return (
        <div className={styles.topNavbar}>
            <div className={styles.searchContainer}>
                <Search size={25} strokeWidth={3} />
                <input
                    type="text"
                    placeholder="Search"
                    className={styles.searchBar}
                />
            </div>
            <ConnectButton />
        </div>
    )
}

export default Navbar
