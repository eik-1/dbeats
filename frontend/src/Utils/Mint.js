import { ethers } from "ethers"
import { BrowserProvider } from 'ethers'
import { useWeb3ModalProvider } from '@web3modal/ethers/react'
import { factoryContractAddress, factoryABI, platformPercentageFee } from "../Utils/Config"


const Mint = async (props) => {
    // const { walletProvider } = useWeb3ModalProvider()
    console.log("mint props: ", props)

    const provider = new BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    try {
        const factoryContractInstanceWithSigner = new ethers.Contract(factoryContractAddress, factoryABI, signer);
        const tx = await factoryContractInstanceWithSigner.createNFT(props.user, props.uri, props.name, props.symbol, props.price, platformPercentageFee, props.genre)
        const receipt = await tx.wait()
        console.log("tx: ", receipt)
        return receipt
    } catch (error) {
        console.log("error: ", error)
    }
 

}

export default Mint


 