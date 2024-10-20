import banner from "../images/Banner3.jpg"
import { Link } from "react-router-dom"
function LandingPage() {
    return (
        <div className="relative">
            <img className="w-full" src={banner} alt="banner" />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black opacity-50"></div>
            {/* Text content */}
            <h1 className="text-[60px] text-white font-bold absolute left-[10%] top-[20%]">
                Mint the Future of Music with DBeats
            </h1>
            <p className="text-white absolute left-[10%] top-[35%]">
                Empowering artists to own their music, and fans to collect it
            </p>

            <Link to="/market">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded absolute left-[10%] top-[48%]">
                Explore Music NFTs
            </button>
            </Link>
        </div>
    );
}

export default LandingPage;

