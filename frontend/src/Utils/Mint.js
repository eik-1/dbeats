import { ethers } from "ethers"
import { factoryContractAddress, factoryABI, platformPercentageFee } from "../Utils/Config"


const mint = async (props) => {

    console.log("mint props: ", props)

    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner();
    try {
        const factoryContractInstanceWithSigner = new ethers.Contract(factoryContractAddress, factoryABI, signer);
        const tx = await factoryContractInstanceWithSigner.createNFT(props.user, props.uri, props.name, props.symbol, props.price, platformPercentageFee, props.genre)
    
        console.log("tx: ", tx)
        return tx
    } catch (error) {
        console.log("error: ", error)
    }
 

}

export default mint


 