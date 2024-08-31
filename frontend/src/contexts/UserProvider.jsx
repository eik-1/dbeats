import { createContext, useContext } from "react"

const UserContext = createContext()

function UserProvider({ children }) {
    const user = {
        name: "Kanye",
        about: "I'm a music enthusiast and creator passionate about blockchain technology.",
        profilePicture:
            "https://indigo-neighbouring-smelt-221.mypinata.cloud/ipfs/QmUJnx5aRJs9Nks96CoCCFEBXATEfXAUNSnw6SYmbhGSzu",
    }

    return (
        <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
    )
}

function useUser() {
    const context = useContext(UserContext)
    if (!context) throw new Error("useAuth must be used within an AuthProvider")
    return context
}

export { UserProvider, useUser }
