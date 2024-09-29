import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import AppLayout from "./pages/AppLayout"
import LandingPage from "./pages/LandingPage"
import Profile from "./pages/Profile"
import Admin from "./pages/Admin"
import Create from "./pages/Create"
import UsersProfile from "./pages/UsersProfile"
import Market from "./pages/Market"

import EditProfile from "./components/EditProfile"
import Error from "./components/ui/Error"
import { UserProvider } from "./contexts/UserProvider"
import { MusicProvider } from "./contexts/MusicProvider"

const projectId = import.meta.env.VITE_WALLETCONNECT_ID

const mainnet = {
    chainId: 1,
    name: "Ethereum",
    currency: "ETH",
    explorerUrl: "https://etherscan.io",
    rpcUrl: import.meta.env.VITE_ETH_MAINNET_RPC,
}

const base = {
    chainId: 8453,
    name: "Base",
    currency: "ETH",
    rpcUrl: import.meta.env.VITE_BASE_RPC,
}
const arbitrumSepolia = {
    chainId: 421614,
    name: "Arbitrum Sepolia",
    currency: "ETH",
    rpcUrl: import.meta.env.VITE_ARB_SEPOLIA_RPC,
}

const metadata = {
    name: "DBeats",
    description: "NFT Marketplace For Music",
    url: "https://dbeats.xyz", // origin must match your domain & subdomain
    icons: [],
}

const ethersConfig = defaultConfig({
    metadata,
    enableEIP6963: true, // true by default
    enableInjected: true, // true by default
    enableCoinbase: true, // true by default
    defaultChainId: 1, // used for the Coinbase SDK
    auth: {
        email: true,
        socials: ["google", "x", "apple", "farcaster"],
        showWallets: true,
        walletFeatures: true,
    },
})

createWeb3Modal({
    ethersConfig,
    chains: [arbitrumSepolia, mainnet, base],
    projectId,
    enableAnalytics: true,
    themeMode: "light",
})

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60 * 1000,
        },
    },
})

const router = createBrowserRouter([
    {
        element: <AppLayout />,
        errorElement: <Error />,
        children: [
            {
                path: "/",
                element: <LandingPage />,
                errorElement: <Error />,
            },
            {
                path: "/profile",
                element: (
                    <QueryClientProvider client={queryClient}>
                        <Profile />
                    </QueryClientProvider>
                ),
                errorElement: <Error />,
            },
            {
                path: "/profile/edit",
                element: <EditProfile />,
                errorElement: <Error />,
            },
            {
                path: "/admin",
                element: <Admin />,
                errorElement: <Error />,
            },
            {
                path: "/create",
                element: <Create />,
                errorElement: <Error />,
            },
            {
                path: "/:name",
                element: <UsersProfile />,
                errorElement: <Error />,
            },
            {
                path: "/market",
                element: (
                    <QueryClientProvider client={queryClient}>
                        <Market />
                    </QueryClientProvider>
                ),
                errorElement: <Error />,
            },
        ],
    },
])

function App() {
    return (
        <UserProvider>
            <MusicProvider>
                <RouterProvider router={router} />
            </MusicProvider>
        </UserProvider>
    )
}

export default App
