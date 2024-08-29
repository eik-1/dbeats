import { createBrowserRouter, RouterProvider } from "react-router-dom"
import AppLayout from "./pages/AppLayout"
import LandingPage from "./pages/LandingPage"


const router = createBrowserRouter([
    {
        element: <AppLayout />,
        children: [
            {
                path: "/",
                element: <LandingPage />
            } 
        ]
    }
])

function App() {
    return (
        <RouterProvider router={router} />
    )
}

export default App
