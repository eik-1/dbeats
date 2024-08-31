import { ethers } from "ethers"
import { factoryContractAddress, factoryABI } from "../Utils/Config"
import { useWeb3ModalAccount } from "@web3modal/ethers/react"
import { useState, useEffect } from "react"

function AdminPage() {
    const [isAdmin, setIsAdmin] = useState(false)
    const [artistAddress, setArtistAddress] = useState("")
    const [inputValue, setInputValue] = useState("") 
    const { address, isConnected } = useWeb3ModalAccount()

    useEffect(() => {
        if (isConnected) {
            fetchOwner()
        }
    }, [isConnected])

    async function fetchOwner() {
        const provider = new ethers.JsonRpcProvider(
            "https://arb-sepolia.g.alchemy.com/v2/8Fvle8oxVN1L-yOqMAzU78n9jIEx-Ndu",
        )
        const factoryContractInstance = new ethers.Contract(
            factoryContractAddress,
            factoryABI,
            provider,
        )
        const adminRole = await factoryContractInstance.ADMIN_ROLE()
        const hasRole = await factoryContractInstance.hasRole(
            adminRole,
            address,
        )
        if (hasRole) {
            setIsAdmin(true)
        }
        console.log(isAdmin)
    }

    async function addArtist(address) {
        if (!window.ethereum) {
            console.error("MetaMask is not installed!")
            return
        }

        const browserProvider = new ethers.BrowserProvider(window.ethereum)
        await browserProvider.send("eth_requestAccounts", [])
        const signer = await browserProvider.getSigner();
        const factoryContractInstanceWithSigner = new ethers.Contract(
            factoryContractAddress,
            factoryABI,
            signer,
        )

        const tx = await factoryContractInstanceWithSigner.addArtist(address)
        await tx.wait()
        console.log(tx)
        console.log("Artist added to factory")
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        setArtistAddress(inputValue)
        console.log("Artist Address updated to:", inputValue)
        addArtist(inputValue)
        //add artist address to factory as an artist
    }

    return (
        <div className="mt-[200px] ml-[200px]">
            {isAdmin ? (
                <>
                    <h1 className="text-3xl">Admin</h1>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <label>
                            <p>New Artist Wallet Address</p>
                            <input
                            className="w-[400px] h-[30px] border-2 border-black"
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                            />
                        </label>
                        <input className="w-[100px] h-[30px] border-2 border-black cursor-pointer" type="submit" value="Submit" />
                    </form>
                </>
            ) : (
                <h1>You do not have an Admin account!</h1>
            )}
        </div>
    )
}

export default AdminPage
