import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import "./TrackInfo.modules.css"
import { Play, Pause } from "lucide-react"
import { useMusic } from "../contexts/MusicProvider"
import { fetchNumberOfOwners } from "../Utils/FetchNumberOfOwners"

function TrackInfo() {
    const location = useLocation()
    const { address } = location.state || {} 
    const [nftDetails, setNftDetails] = useState(null)
    const [nftData, setNftData] = useState(null)
    const [tokenURI, setTokenURI] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTrack, setCurrentTrack] = useState(null)
    const [numberOfOwners, setNumberOfOwners] = useState(null)
    const [priceInUSD, setPriceInUSD] = useState(null)

    const { play, pauseTrack } = useMusic()

    useEffect(() => {
        const fetchNftDetails = async () => {
            if (address) {
                try {
                    const response = await fetch(
                        `http://localhost:3000/nft/getOne`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ nftAddress: address }),
                        },
                    )
                    if (!response.ok) {
                        throw new Error("Network response was not ok")
                    }
                    const data = await response.json()
                    setNftDetails(data)
                    setTokenURI(data.nfts[0].tokenURI)
                    console.log("nftDetails: ", data)

                    const owners = await fetchNumberOfOwners(address)
                    setNumberOfOwners(owners)

                    await fetchExchangeRate(data.nfts[0].mintPrice)

                    await fetchNftData(data.nfts[0].tokenURI) 
                } catch (err) {
                    setError(err.message)
                } finally {
                    setLoading(false)
                }
            } else {
                console.error("No address provided.")
                setLoading(false)
            }
        }

        fetchNftDetails()
    }, [address])

    async function fetchExchangeRate(mintPrice) {
        const url =
            "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
        const options = {
            method: "GET",
            headers: {
                accept: "application/json",
                "x-cg-demo-api-key": import.meta.env.VITE_COINGECKO_API,
            },
        }
        try {
            const response = await fetch(url, options)
            const data = await response.json()
            const exchangeRate = data.ethereum.usd
            const usdPrice = parseFloat(mintPrice / 10 ** 18) * exchangeRate 
            setPriceInUSD(usdPrice.toFixed(2))
        } catch (error) {
            console.error("Error fetching exchange rate:", error)
            setPriceInUSD("N/A")
        }
    }

    async function fetchNftData(tokenURI) {
        if (tokenURI) {
            try {
                const response = await fetch(tokenURI)
                const data = await response.json()
                setNftData(data)
                console.log("nftData: ", data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        } else {
            console.error("No tokenURI provided.")
            setLoading(false)
        }
    }

    const handlePlayClick = () => {
        if (
            currentTrack &&
            currentTrack.id === nftDetails.nfts[0].address &&
            isPlaying
        ) {
            pauseTrack()
            setIsPlaying(false)
        } else {
            const trackData = {
                id: nftDetails.nfts[0].address,
                name: nftDetails.nfts[0].name,
                artist: nftDetails.nfts[0].artist.id,
                musicUrl: nftData.animationUrl,
                imageUrl: nftData.imageUrl,
                price: nftDetails.nfts[0].mintPrice,
                genre: nftDetails.nfts[0].genre,
            }
            play(trackData)
            setCurrentTrack(trackData.musicUrl)
            setIsPlaying(true)
        }
    }

    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error}</div>

    return (
        <div>
            <h1 className="title">Track Info</h1>
            {nftData && (
                <>
                    <div className="nft-card">
                        <p className="nft-name">{nftDetails.nfts[0].name}</p>
                        <p>By {nftData.attributes[0].value}</p>
                        <img
                            className="nft-image"
                            src={nftData.imageUrl}
                            alt={nftData.name}
                        />
                        <p>Address: {address}</p>
                        <p>
                            Price: {nftDetails.nfts[0].mintPrice / 10 ** 18} ETH / $ {
                                priceInUSD
                            }
                        </p>
                        <p>Number of copies sold: {numberOfOwners}</p>
                        <button
                            className="playButton"
                            onClick={handlePlayClick}
                        >
                            {currentTrack &&
                            currentTrack.id === nftDetails.nfts[0].artist.id &&
                            isPlaying ? (
                                <Pause size={23} fill="#000" />
                            ) : (
                                <Play size={23} fill="#000" />
                            )}
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}

export default TrackInfo
