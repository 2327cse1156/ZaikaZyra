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
    <div className="relative min-h-[80px] bg-[#FFF7ED] flex items-center justify-center">
      {/* Background bubbles */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-2 left-5 w-20 h-20 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
        <div className="absolute top-8 right-10 w-24 h-24 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse [animation-delay:2s]"></div>
        <div className="absolute bottom-2 left-1/3 w-28 h-28 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse [animation-delay:4s]"></div>
      </div>

      {/* Navbar content */}
      <div className="relative w-[95%] max-w-6xl bg-white/60 backdrop-blur-md border border-white/40 shadow-lg rounded-2xl px-6 py-3 flex items-center justify-between z-20">
        {/* Left section */}
        <div className="flex items-center gap-3">
          <FaLocationDot className="text-green-600" size={22} />
          <span className="text-gray-800 font-medium">{city}</span>
        </div>

        {/* Logo */}
        <h1 className="text-2xl font-extrabold text-green-700">ZaikaZyra</h1>

        {/* Search + Cart */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white/70 px-3 py-1 rounded-full border border-gray-200">
            <FaSearch
              className="text-gray-500 cursor-pointer"
              onClick={() => setShowSearch((prev) => !prev)}
            />
            {showSearch && (
              <input
                type="text"
                placeholder="Search food..."
                className="bg-transparent outline-none text-sm text-gray-700"
              />
            )}
          </div>

          <div className="relative">
            <FaShoppingCart size={22} className="text-gray-700" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 rounded-full">
              0
            </span>
          </div>
        </div>

        {/* User menu */}
        <div className="relative">
          <div
            className="cursor-pointer bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold"
            onClick={() => setShowInfo((prev) => !prev)}
          >
            {userData?.fullName?.slice(0, 1) || "?"}
          </div>

          {/* Dropdown */}
          {showInfo && userData && (
            <div className="absolute top-12 right-0 z-[9999] bg-gray-900 text-white shadow-2xl rounded-lg py-2 w-44 text-sm border border-gray-700">
              <div className="px-4 py-2 font-semibold border-b border-gray-700">
                {userData.fullName}
              </div>
              <div className="px-4 py-2 hover:bg-gray-800 cursor-pointer">
                My Orders
              </div>
              <div
                className="px-4 py-2 text-red-400 hover:bg-gray-800 cursor-pointer"
                onClick={handleLogOut}
              >
                Log Out
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Nav;
