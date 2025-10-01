import { useSelector } from "react-redux";
import Nav from "./Nav";
import axios from "axios";
import { serverUrl } from "../App";
import { useEffect } from "react";
import { useState } from "react";
import { FaBiking, FaBox, FaMapMarkedAlt, FaTruck } from "react-icons/fa";

function DeliveryBoy() {
  const { userData } = useSelector((state) => state.user);
  const [availableAssignments, setAvailableAssignments] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const getAssignments = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-assignment`, {
        withCredentials: true,
      });
      setAvailableAssignments(result.data);
    } catch (error) {
      console.error(error);
    }
  };

  const acceptOrder = async (assignmentId) => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/order/accept-order/${assignmentId}`,
        {
          withCredentials: true,
        }
      );
      console.log(result.data);
      setAvailableAssignments((prev) =>
        prev.filter((a) => a.assignmentId !== assignmentId)
      );
    } catch (error) {
      console.error(error);
    }
  };

  const getCurrentOrder = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/order/get-current-order`,
        {
          withCredentials: true,
        }
      );
      setCurrentOrder(result.data);
      await getCurrentOrder();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (userData) {
      getAssignments();
      getCurrentOrder();
    }
  }, [userData]);

  const bubbleColors = ["#FBBF24", "#86EFAC", "#22C55E"];
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FFF7ED]">
      <Nav />
      <div
        className="absolute sm:w-72 w-48 sm:h-72 h-48 rounded-full opacity-30 animate-bounce-slow -top-20 -left-10"
        style={{ backgroundColor: bubbleColors[0] }}
      ></div>
      <div
        className="absolute w-56 h-56 rounded-full opacity-25 animate-bounce-slower top-10 right-0"
        style={{ backgroundColor: bubbleColors[1] }}
      ></div>
      <div
        className="absolute w-64 h-64 rounded-full opacity-20 animate-bounce-slow left-1/4 bottom-10"
        style={{ backgroundColor: bubbleColors[2] }}
      ></div>

      <div className="relative z-10 sm:px-6 px-4 sm:py-12 py-6">
        <div className="text-center mb-10 animate-slideDown">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 flex items-center justify-center gap-3">
            <FaBiking className="text-orange-500" />
            Welcome, {userData?.fullName}
          </h1>
          <p className="text-gray-600 mt-3 text-sm sm:text-base">
            <FaMapMarkedAlt className="inline text-red-500 mr-2" />
            Latitude: {userData.location.coordinates[1]}, Longitude:{" "}
            {userData.location.coordinates[0]}
          </p>
        </div>
        {!currentOrder && (
          <div className="max-w-6xl mx-auto">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 text-center animate-slideLeft">
              Available Assignments
            </h1>

            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {availableAssignments.length > 0 ? (
                availableAssignments.map((a, index) => (
                  <>
                    <div
                      key={index}
                      className="bg-white/90 backdrop-blur-md border border-gray-200 shadow-lg rounded-2xl p-6 animate-fadeIn hover:shadow-xl transition"
                    >
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
                        <FaBox className="text-green-600" /> {a.shopName}
                      </h3>
                      <p className="text-gray-600 mt-2 break-words text-sm sm:text-base">
                        <FaMapMarkedAlt className="inline mr-1 text-red-500" />
                        Delivery Address: {a.deliveryAddress.text}
                      </p>
                      <p className="text-gray-500 mt-1 text-sm sm:text-base">
                        {a.items.length} items | Subtotal:{" "}
                        <span className="font-semibold">₹{a.subtotal}</span>
                      </p>
                      <button
                        onClick={() => acceptOrder(a.assignmentId)}
                        className="mt-4 bg-orange-500 w-full sm:w-auto hover:bg-orange-600 text-white px-6 py-2 rounded-full shadow-md font-semibold transition-transform hover:scale-105 active:scale-95"
                      >
                        Accept Assignment
                      </button>
                    </div>
                  </>
                ))
              ) : (
                <p className="text-center text-gray-500 text-lg animate-fadeIn">
                  No available orders 🚫
                </p>
              )}
            </div>
          </div>
        )}

        {currentOrder && (
          <div className="max-w-2xl mx-auto mt-10">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 text-center">Current Order📦</h2>
            <div className="bg-white/90 backdrop-blur-md border border-gray-200 shadow-lg rounded-2xl p-6 animate-fadeIn">
              <p className="text-lg font-semibold text-gray-800">{currentOrder?.shopOrder.shop.name}</p>
              <p className="text-gray-600 mt-2 break-words text-sm sm:text-base"><FaMapMarkedAlt className="inline mr-1 text-red-500" />
              {currentOrder?.deliveryAddress.text}</p>
              <p className="text-gray-500  mt-1 text-sm sm:text-base">
                {currentOrder.shopOrder.shopOrderItems.length} items |{" "}
               <span className="font-semibold">₹{currentOrder.shopOrder.subtotal}</span>
              </p>
            </div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-25px); }
        }
        .animate-bounce-slow { animation: bounce-slow 8s ease-in-out infinite; }
        .animate-bounce-slower { animation: bounce-slow 12s ease-in-out infinite; }

        @keyframes fadeIn { from {opacity:0} to {opacity:1} }
        .animate-fadeIn { animation: fadeIn 0.8s ease-in forwards; }

        @keyframes slideDown { from {opacity:0; transform: translateY(-20px);} to {opacity:1; transform: translateY(0);} }
        .animate-slideDown { animation: slideDown 0.8s ease-in forwards; }

        @keyframes slideLeft { from {opacity:0; transform: translateX(-20px);} to {opacity:1; transform: translateX(0);} }
        .animate-slideLeft { animation: slideLeft 0.8s ease-in forwards; }
      `}</style>
    </div>
  );
}

export default DeliveryBoy;
