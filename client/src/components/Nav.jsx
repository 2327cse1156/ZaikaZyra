// Nav.jsx
import { FaLocationDot } from "react-icons/fa6";
import { FaSearch, FaShoppingCart } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { setUserData } from "../redux/userSlice";
import axios from "axios";
import { serverUrl } from "../App";

function Nav() {
  const [showInfo, setShowInfo] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.userData);
  const city = useSelector((state) => state.user.city) || "Unknown";

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/signout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <header className="relative bg-white shadow-md z-50">
      {/* Background bubbles */}
      <div
        className="absolute w-40 h-40 rounded-full opacity-20 animate-bounce-slow -top-10 -left-10"
        style={{ backgroundColor: "#86EFAC" }}
      />
      <div
        className="absolute w-32 h-32 rounded-full opacity-20 animate-bounce-slower top-0 right-0"
        style={{ backgroundColor: "#22C55E" }}
      />

      {/* Navbar */}
      <nav className="relative container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-green-600 animate-slideDown">
          ZaikaZyra
        </h1>

        {/* Search / Location / Cart */}
        <div className="hidden md:flex items-center gap-6">
          {/* Location */}
          <div className="flex items-center gap-2 text-gray-700 animate-slideLeft">
            <FaLocationDot size={20} className="text-green-500" />
            <span className="font-medium">{city}</span>
          </div>

          {/* Search */}
          <div className="relative animate-slideLeft delay-100">
            <FaSearch
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search delicious food..."
              className="pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 w-64 shadow-sm hover:shadow-md transition"
            />
          </div>

          {/* Cart */}
          <div className="relative animate-slideLeft delay-200">
            <FaShoppingCart
              size={22}
              className="text-gray-700 cursor-pointer hover:text-green-600 transition"
            />
            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full shadow">
              0
            </span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Orders */}
          <button className="hidden sm:block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full shadow-md transition animate-slideUp">
            My Orders
          </button>

          {/* User Avatar */}
          <div
            className="w-10 h-10 flex items-center justify-center bg-green-100 rounded-full cursor-pointer font-bold text-green-600 shadow-sm hover:shadow-md transition"
            onClick={() => setShowInfo((prev) => !prev)}
          >
            {userData?.fullName?.slice(0, 1) || "U"}
          </div>

          {/* Dropdown */}
          {showInfo && userData && (
            <div className="absolute top-16 right-4 bg-white shadow-lg rounded-xl p-4 w-52 animate-fadeIn">
              <div className="font-semibold text-gray-800 mb-2">
                {userData.fullName}
              </div>
              <div className="text-gray-600 cursor-pointer hover:text-green-600 transition">
                My Orders
              </div>
              <div
                onClick={handleLogOut}
                className="text-gray-600 mt-2 cursor-pointer hover:text-green-600 transition"
              >
                Log Out
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Search + Icons */}
      {showSearch && (
        <div className="md:hidden px-4 pb-4">
          <div className="relative">
            <FaSearch
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search delicious food..."
              className="pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 w-full shadow-sm hover:shadow-md transition"
            />
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .animate-bounce-slow { animation: bounce-slow 10s ease-in-out infinite; }
        .animate-bounce-slower { animation: bounce-slow 14s ease-in-out infinite; }

        @keyframes fadeIn { from {opacity:0} to {opacity:1} }
        .animate-fadeIn { animation: fadeIn 0.4s ease-in forwards; }

        @keyframes slideDown { from {opacity:0; transform: translateY(-10px);} to {opacity:1; transform: translateY(0);} }
        .animate-slideDown { animation: slideDown 0.5s ease-in forwards; }

        @keyframes slideLeft { from {opacity:0; transform: translateX(-10px);} to {opacity:1; transform: translateX(0);} }
        .animate-slideLeft { animation: slideLeft 0.6s ease-in forwards; }

        @keyframes slideUp { from {opacity:0; transform: translateY(10px);} to {opacity:1; transform: translateY(0);} }
        .animate-slideUp { animation: slideUp 0.6s ease-in forwards; }
      `}</style>
    </header>
  );
}

export default Nav;
