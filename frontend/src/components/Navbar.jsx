import ConnectButton from "./ui/ConnectButton"
import styles from "./Navbar.module.css"

function Navbar() {
    return (
        <div className={styles.topNavbar}>
            <ConnectButton />
        </div>
    )
}

export default Navbar
