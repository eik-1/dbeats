import { ethers, BrowserProvider  } from "ethers"
import {
    factoryContractAddress,
    factoryABI,
    platformPercentageFee,
} from "../Utils/Config"

const Mint = async (props) => {
    // const { walletProvider } = useWeb3ModalProvider()
    console.log("mint props: ", props)

    const provider = new BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const factoryContractInstanceWithSigner = new ethers.Contract(
        factoryContractAddress,
        factoryABI,
        signer,
    )
    console.log("minting ...")
    try {

        const gasEstimate = await factoryContractInstanceWithSigner.createNFT.estimateGas(
            props.user,
            props.uri,
            props.name,
            props.symbol,
            props.price,
            platformPercentageFee,
            props.genre
        );
        console.log("Estimated Gas: ", gasEstimate.toString());

        const tx = await factoryContractInstanceWithSigner.createNFT(
            props.user,
            props.uri,
            props.name,
            props.symbol,
            props.price,
            platformPercentageFee,
            props.genre,
            {
                gasLimit: gasEstimate,
            }
        )
        
        const receipt = await tx.wait(2)
        console.log("tx: ", receipt)
        return receipt
    } catch (error) {
        console.log("error: ", error)
    }
}

export default Mint
