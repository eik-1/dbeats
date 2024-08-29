import { useWeb3Modal } from "@web3modal/ethers/react"

import styles from "./ConnectButton.module.css"

export default function ConnectButton() {
    const { open } = useWeb3Modal()

    return (
        <div className={styles.connectButton}>
            <button onClick={() => open()}>Connect</button>
        </div>
    )
}
