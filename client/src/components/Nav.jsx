import { FaLocationDot } from "react-icons/fa6";
import {
  FaSearch,
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaPlus,
} from "react-icons/fa";
import { MdReceiptLong } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { setUserData } from "../redux/userSlice";
import axios from "axios";
import { serverUrl } from "../App";
import { useNavigate } from "react-router-dom";

function Nav() {
  const navigate = useNavigate();
  const [showInfo, setShowInfo] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
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

  const role = userData?.role?.toLowerCase();

  return (
    <div className="relative min-h-[80px] bg-[#FFF7ED] flex items-center justify-center">
      {/* Background gradient bubbles */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-2 left-5 w-20 h-20 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute top-8 right-10 w-24 h-24 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse [animation-delay:2s]"></div>
        <div className="absolute bottom-2 left-1/3 w-28 h-28 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse [animation-delay:4s]"></div>
      </div>

      {/* Navbar wrapper */}
      <div className="relative w-[95%] max-w-6xl bg-white/80 backdrop-blur-lg border border-white/40 shadow-md rounded-2xl px-6 py-3 flex items-center justify-between z-20">
        {/* Left section */}
        <div className="flex items-center gap-2 text-gray-700">
          <FaLocationDot className="text-green-600" size={20} />
          <span className="font-medium">{city}</span>
        </div>

        {/* Logo */}
        <h1 className="text-xl md:text-2xl font-extrabold text-green-700 tracking-wide drop-shadow-sm">
          ZaikaZyra
        </h1>

        {/* Desktop Middle section */}
        <div className="hidden md:flex items-center gap-6">
          {role === "user" && (
            <>
              {/* Search bar */}
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200 shadow-sm hover:shadow-md transition">
                <FaSearch
                  className="text-gray-500 cursor-pointer hover:text-green-600 transition"
                  onClick={() => setShowSearch((prev) => !prev)}
                />
                {showSearch && (
                  <input
                    type="text"
                    placeholder="Search food..."
                    className="bg-transparent outline-none text-sm text-gray-700 w-40"
                  />
                )}
              </div>

              {/* Cart */}
              <div className="relative cursor-pointer">
                <FaShoppingCart
                  size={22}
                  className="text-gray-600 hover:text-green-600 transition"
                />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 rounded-full shadow">
                  0
                </span>
              </div>
            </>
          )}

          {role === "owner" && (
            <>
              {/* Always visible Add Food button */}
              <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 transition text-white px-4 py-2 rounded-full shadow-md" onClick={() => navigate("/add-item")}>
                <FaPlus size={16} />
                <span>Add Food Item</span>
              </button>

              {/* Orders */}
              <div className="flex items-center gap-2 text-gray-700 font-medium cursor-pointer hover:text-green-600 transition">
                <MdReceiptLong size={20} />
                <span>Orders</span>
                <span className="bg-red-500 text-white text-xs font-bold px-2 rounded-full">
                  0
                </span>
              </div>
            </>
          )}
        </div>

        {/* User avatar & dropdown */}
        <div className="relative hidden md:block">
          <div
            className="cursor-pointer bg-green-600 hover:bg-green-700 transition text-white rounded-full w-10 h-10 flex items-center justify-center font-bold shadow-md"
            onClick={() => setShowInfo((prev) => !prev)}
          >
            {userData?.fullName?.slice(0, 1) || "?"}
          </div>

          {showInfo && userData && (
            <div className="absolute top-12 right-0 z-[9999] bg-white text-gray-800 shadow-xl rounded-lg py-2 w-44 text-sm border border-gray-200 animate-fadeIn">
              <div className="px-4 py-2 font-semibold border-b border-gray-200 text-gray-900">
                {userData.fullName}
              </div>
              {role === "user" && (
                <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded">
                  My Orders
                </div>
              )}
              <div
                className="px-4 py-2 text-red-500 hover:bg-red-50 cursor-pointer rounded"
                onClick={handleLogOut}
              >
                Log Out
              </div>
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden">
          <button
            className="p-2 rounded-lg hover:bg-gray-100 transition"
            onClick={() => setShowMobileMenu((prev) => !prev)}
          >
            {showMobileMenu ? (
              <FaTimes size={22} className="text-gray-700" />
            ) : (
              <FaBars size={22} className="text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {showMobileMenu && (
        <div className="absolute top-[82px] right-2 w-[90%] bg-white text-gray-800 rounded-xl shadow-lg p-4 z-[9999] md:hidden border border-gray-200 animate-slideDown">
          {userData && (
            <div className="mb-3 font-semibold border-b border-gray-200 pb-2 text-gray-900">
              {userData.fullName}
            </div>
          )}

          {/* USER role */}
          {role === "user" && (
            <>
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg mb-3 border">
                <FaSearch className="text-gray-500" />
                <input
                  type="text"
                  placeholder="Search food..."
                  className="bg-transparent outline-none text-sm text-gray-700 w-full"
                />
              </div>
              <div className="flex items-center gap-3 mb-3 cursor-pointer hover:bg-gray-100 rounded px-3 py-2">
                <FaShoppingCart />
                <span>Cart</span>
              </div>
              <div className="mb-3 cursor-pointer hover:bg-gray-100 rounded px-3 py-2">
                My Orders
              </div>
            </>
          )}

          {/* OWNER role */}
          {role === "owner" && (
            <>
              {/* Always visible Add Food button */}
              <button
                className="w-full flex items-center gap-2 justify-center bg-green-600 hover:bg-green-700 transition text-white px-4 py-2 rounded-lg mb-3 shadow"
                onClick={() => navigate("/add-item")}
              >
                <FaPlus size={16} />
                <span>Add Food</span>
              </button>

              <div className="flex items-center gap-2 text-gray-700 font-medium cursor-pointer hover:bg-gray-100 rounded px-3 py-2">
                <MdReceiptLong size={20} />
                <span>Orders</span>
                <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 rounded-full">
                  0
                </span>
              </div>
            </>
          )}

          {/* Logout */}
          <div
            className="text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg cursor-pointer"
            onClick={handleLogOut}
          >
            Log Out
          </div>
        </div>
      )}
    </div>
  );
}

export default Nav;
