import {
    createContext,
    useContext,
    useReducer,
    useState,
    useEffect,
} from "react"
import axios from "axios"
import { useWeb3ModalAccount } from "@web3modal/ethers/react"

const API_BASE_URL = "http://localhost:3000"

const UserContext = createContext()

// const initialState = {
//     user: {
//         name: "Kanye",
//         about: "I'm a music enthusiast and creator passionate about blockchain technology.",
//         profilePicture:
//             "https://indigo-neighbouring-smelt-221.mypinata.cloud/ipfs/QmUJnx5aRJs9Nks96CoCCFEBXATEfXAUNSnw6SYmbhGSzu",
//         twitterUsername: "",
//         isArtist: false,
//     },
// }

// function userReducer(state, action) {
//     switch (action.type) {
//         case "UPDATE_USER":
//             return {
//                 ...state,
//                 user: action.payload,
//             }
//         case "CONNECT_TWITTER":
//             return {
//                 ...state,
//                 user: {
//                     ...state.user,
//                     twitterUsername: action.payload,
//                 },
//             }
//         default:
//             return state
//     }
// }

function UserProvider({ children }) {
    // const [state, dispatch] = useReducer(userReducer, initialState)
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const { address, isConnected } = useWeb3ModalAccount()

    async function fetchUser(walletAddress) {
        if (isConnected && address) {
            try {
                setLoading(true)
                const response = await axios.get(
                    `${API_BASE_URL}/user/${walletAddress}`,
                )
                setUser(response.data)
                return response.data
            } catch (error) {
                console.error("Error fetching user:", error)
                setUser(null)
            } finally {
                setLoading(false)
            }
        }
    }

    async function createUser(userData) {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/user/create`,
                userData,
            )
            console.log(response.data)
            setUser(response.data)
        } catch (error) {
            console.error("Error creating user:", error)
        }
    }

    async function updateUser(userData) {
        try {
            const response = await axios.put(
                `${API_BASE_URL}/user/${userData.walletAddress}`,
                userData,
            )
            setUser(response.data)
        } catch (error) {
            console.error("Error updating user:", error)
        }
    }

    // function connectTwitter(twitterUsername) {
    //     dispatch({ type: "CONNECT_TWITTER", payload: twitterUsername })
    // }

    return (
        <UserContext.Provider
            value={{
                user,
                loading,
                updateUser,
                createUser,
                fetchUser,
            }}
        >
            {children}
        </UserContext.Provider>
    )
}

function useUser() {
    const context = useContext(UserContext)
    if (!context) throw new Error("useAuth must be used within an AuthProvider")
    return context
}

export { UserProvider, useUser }
