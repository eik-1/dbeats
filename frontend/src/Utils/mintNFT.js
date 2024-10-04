import { ethers } from "ethers"
import { dbeatsNftABI } from "./Config"

async function mintNFT(nftAddress, quantity, price) {
    if (!window.ethereum) {
        throw new Error("MetaMask is not installed!")
    }
    try {
        await window.ethereum.request({ method: "eth_requestAccounts" })
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = provider.getSigner()

        const nftContract = new ethers.Contract(
            nftAddress,
            dbeatsNftABI,
            signer,
        )

        const tx = await nftContract.mint(await signer.getAddress(), 1, {
            value: price,
        })
        const receipt = await tx.wait(1)
        console.log("NFT minted successfully: ", receipt)
        return receipt
    } catch (err) {
        throw new Error("Error connecting to MetaMask!")
    }
}

export default mintNFT
