import { createContext, useContext, useReducer } from "react"

const UserContext = createContext()

const initialState = {
    user: {
        name: "Kanye",
        about: "I'm a music enthusiast and creator passionate about blockchain technology.",
        profilePicture:
            "https://indigo-neighbouring-smelt-221.mypinata.cloud/ipfs/QmUJnx5aRJs9Nks96CoCCFEBXATEfXAUNSnw6SYmbhGSzu",
    },
}

function userReducer(state, action) {
    switch (action.type) {
        case "UPDATE_USER":
            return {
                ...state,
                user: action.payload,
            }
        default:
            return state
    }
}

function UserProvider({ children }) {
    const [state, dispatch] = useReducer(userReducer, initialState)
    const { user } = state

    const updateUser = (user) => {
        dispatch({ type: "UPDATE_USER", payload: user })
    }

    return (
        <UserContext.Provider value={{ user, updateUser }}>
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
