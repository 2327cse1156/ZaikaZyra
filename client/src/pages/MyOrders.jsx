import React, { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import UserOrderCard from "../components/userOrderCard";
import OwnerOrderCard from "../components/ownerOrderCard";

function MyOrders() {
  const { userData, myOrders } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [activeStatus, setActiveStatus] = useState("all");

  const statusTabs = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Preparing", value: "preparing" },
    { label: "Out for Delivery", value: "out for delivery" },
    { label: "Delivered", value: "delivered" },
  ];

  const filteredOrders = myOrders?.filter((order) =>
    activeStatus === "all"
      ? true
      : order.shopOrders.some((s) => s.status === activeStatus)
  );

  const bubbleColors = ["#FBBF24", "#86EFAC", "#22C55E"];

  return (
    <div className="relative min-h-screen bg-[#FFF7ED] py-10 px-4 overflow-hidden">
      {/* Background Bubbles */}
      {bubbleColors.map((color, i) => (
        <div
          key={i}
          className="absolute rounded-full opacity-20 blur-3xl animate-pulse"
          style={{
            backgroundColor: color,
            width: `${10 + i * 6}rem`,
            height: `${10 + i * 6}rem`,
            top: i === 0 ? "-4rem" : i === 1 ? "4rem" : "auto",
            bottom: i === 2 ? "3rem" : "auto",
            left: i === 0 ? "-3rem" : i === 2 ? "20%" : "auto",
            right: i === 1 ? "0" : i === 2 ? "30%" : "auto",
            animationDelay: `${i * 2}s`,
          }}
        ></div>
      ))}

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4">
          <button
            className="flex items-center text-gray-700 hover:text-green-600 transition duration-300"
            onClick={() => navigate("/")}
          >
            <IoIosArrowRoundBack size={28} className="mr-1" />
            <span className="font-medium">Back to Home</span>
          </button>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            My Orders
          </h1>
        </div>

        {/* Status Tabs */}
        <div className="sticky top-0 z-10 bg-[#FFF7ED] py-3 mb-8 shadow-sm rounded-xl flex flex-wrap justify-center sm:justify-start gap-3">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveStatus(tab.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition duration-200 ${
                activeStatus === tab.value
                  ? "bg-green-600 text-white border-green-600 shadow-md"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders?.length > 0 ? (
            filteredOrders.map((order) =>
              userData.role === "user" ? (
                <UserOrderCard key={order._id} data={order} />
              ) : (
                <OwnerOrderCard key={order._id} data={order} />
              )
            )
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mb-4 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m13-9l2 9m-5-9v9m-4-9v9"
                />
              </svg>
              <p className="text-lg font-medium">No orders found</p>
              <p className="text-sm text-gray-400 mt-1">
                Orders you place will show up here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyOrders;
