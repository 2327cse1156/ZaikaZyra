import React, { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";

function OrderPlaced() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showConfetti, setShowConfetti] = useState(true);
  const { width, height } = useWindowSize();

  const totalAmount = location.state?.totalAmount || 0;

  // ⛔️ Auto-redirect removed

  // ✅ Stop confetti after 5 seconds
  useEffect(() => {
    const confettiTimer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
    return () => clearTimeout(confettiTimer);
  }, []);

  const bubbleColors = ["#FBBF24", "#86EFAC", "#22C55E"];

  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden"
      style={{ backgroundColor: "#FFF7ED" }}
    >
      {/* Background bubbles */}
      {bubbleColors.map((color, i) => (
        <div
          key={i}
          className={`absolute rounded-full opacity-25 animate-pulse ${
            i === 0
              ? "w-72 h-72 -top-20 -left-10"
              : i === 1
              ? "w-56 h-56 top-10 right-0"
              : i === 2
              ? "w-64 h-64 left-1/4 bottom-10"
              : "w-48 h-48 -bottom-10 right-1/3"
          }`}
          style={{ backgroundColor: color }}
        ></div>
      ))}

      {/* Confetti */}
      {showConfetti && (
        <Confetti width={width} height={height} recycle={false} />
      )}

      {/* Order Confirmation Card */}
      <div className="relative max-w-lg w-full bg-white/90 backdrop-blur-lg border border-white/40 shadow-xl rounded-2xl p-8 text-center z-10">
        <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          Order Placed Successfully!
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order is being prepared. You can
          track your order status in the <strong>"My Orders"</strong> section.
        </p>

        {/* ✅ Only Total Amount Shown */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-left mb-4">
          <p className="text-sm text-gray-600">
            <strong>Total Amount:</strong> ₹{totalAmount}
          </p>
        </div>

        <button
          className="mt-4 w-full bg-[#ff4d2d] text-white py-3 rounded-xl font-semibold shadow-md hover:bg-[#e63e20] transition-all duration-300"
          onClick={() => navigate("/my-orders")}
        >
          Go to My Orders
        </button>
      </div>
    </div>
  );
}

export default OrderPlaced;
