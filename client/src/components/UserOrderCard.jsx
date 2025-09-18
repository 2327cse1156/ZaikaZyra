import { useState } from "react";
import {
  FaBox,
  FaTruck,
  FaCheckCircle,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

function UserOrderCard({ data }) {
  const [expanded, setExpanded] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "shipped":
      case "out for delivery":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const steps = [
    { label: "Pending", icon: <FaBox /> },
    { label: "Shipped", icon: <FaTruck /> },
    { label: "Delivered", icon: <FaCheckCircle /> },
  ];

  const currentStep = (() => {
    const status = data?.shopOrders?.[0]?.status?.toLowerCase();
    if (status === "pending") return 1;
    if (status === "shipped" || status === "out for delivery") return 2;
    if (status === "delivered") return 3;
    return 0;
  })();

  const progressPercent = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="relative w-full bg-white/80 backdrop-blur-md border border-gray-100 shadow-xl rounded-2xl p-6 animate-fadeIn">
      {/* Header */}
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setExpanded((prev) => !prev)}
      >
        <div>
          <p className="text-sm text-gray-500">Order #{data._id.slice(-6)}</p>
          <p className="text-sm text-gray-400">
            Date: {formatDate(data.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
              data.shopOrders[0]?.status
            )}`}
          >
            {data.shopOrders[0]?.status}
          </span>
          {/* Show Total in header */}
          <p className="font-semibold text-gray-800">
            Total: ₹{data.totalAmount}
          </p>
          {expanded ? <FaChevronUp /> : <FaChevronDown />}
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="mt-6 space-y-6">
          {/* Progress Tracker */}
          <div className="relative flex justify-between items-center mb-6">
            {steps.map((step, index) => {
              const isCompleted = currentStep >= index + 1;
              return (
                <div
                  key={step.label}
                  className="flex flex-col items-center w-1/3 relative z-10"
                >
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-full border-2 text-lg transition-all ${
                      isCompleted
                        ? "bg-orange-500 border-orange-500 text-white animate-bounce"
                        : "bg-white border-gray-300 text-gray-400"
                    }`}
                  >
                    {step.icon}
                  </div>
                  <p className="text-xs mt-2 text-gray-600">{step.label}</p>
                </div>
              );
            })}
            <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded">
              <div
                className="h-1 bg-orange-500 rounded transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Shop Orders */}
          {data?.shopOrders?.map((shopOrder) => (
            <div
              key={shopOrder._id}
              className="border border-gray-100 rounded-xl p-4"
            >
              <p className="font-semibold mb-2 text-gray-700">
                {shopOrder?.shop?.name}
              </p>
              <div className="space-y-3">
                {shopOrder?.shopOrderItems?.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-4 border-b pb-2"
                  >
                    <img
                      src={item?.item?.image}
                      alt={item?.item?.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{item?.item?.name}</p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity} × ₹{item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-4 text-sm">
                <span className="font-medium">
                  Subtotal: ₹{shopOrder.subtotal}
                </span>
                <span className="text-gray-600">Status: {shopOrder.status}</span>
              </div>
            </div>
          ))}

          {/* Grand Total */}
          <div className="flex justify-end mt-6 border-t pt-4">
            <p className="text-lg font-semibold text-gray-800">
              Total: ₹{data.totalAmount}
            </p>
          </div>

          {/* Track Order Button */}
          <div className="flex justify-end mt-4">
            <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded-lg shadow">
              Track Order
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out forwards; }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce { animation: bounce 1.2s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

export default UserOrderCard;
