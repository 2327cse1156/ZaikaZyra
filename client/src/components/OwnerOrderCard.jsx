import { useState } from "react";
import { MdPhone } from "react-icons/md";
import {
  FaBox,
  FaConciergeBell,
  FaTruck,
  FaCheckCircle,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { updateOrderStatus } from "../redux/userSlice";
import axios from "axios";

function OwnerOrderCard({ data }) {
  const [availableBoys, setAvailableBoys] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const dispatch = useDispatch();

  // Handle status update
  const handleUpdateStatus = async (orderId, shopId, status) => {
    const normalizedStatus = status.toLowerCase();
    try {
      dispatch(
        updateOrderStatus({ orderId, shopId, status: normalizedStatus })
      );

      const result = await axios.post(
        `${serverUrl}/api/order/update-status/${orderId}/${shopId}`,
        { status: normalizedStatus },
        { withCredentials: true }
      );
      console.log("API Response:", result.data);
      
      setAvailableBoys(result.data.availableBoys);
      console.log(result.data);
    } catch (error) {
      console.error(error);
    }
  };

  const steps = [
    { label: "Pending", icon: <FaBox /> },
    { label: "Preparing", icon: <FaConciergeBell /> },
    { label: "Out for Delivery", icon: <FaTruck /> },
    { label: "Delivered", icon: <FaCheckCircle /> },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "preparing":
        return "bg-blue-100 text-blue-800";
      case "out for delivery":
        return "bg-indigo-100 text-indigo-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const currentStatus = data.shopOrders.status.toLowerCase();
  const currentStep =
    steps.findIndex((s) => s.label.toLowerCase() === currentStatus) + 1;
  const progressPercent = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="relative w-full bg-white/90 border border-gray-200 shadow-md rounded-2xl p-6 flex flex-col animate-fadeIn hover:shadow-xl transition-shadow duration-300 backdrop-blur-sm">
      {/* Header */}
      <div
        className="flex justify-between items-start cursor-pointer"
        onClick={() => setExpanded((prev) => !prev)}
      >
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            {data.user.fullName}
          </h2>
          <p className="text-sm text-gray-500">{data.user.email}</p>
          <p className="flex items-center gap-2 text-sm text-gray-500">
            <MdPhone className="text-orange-500"/> {data.user.mobile}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span
            className={`shadow-sm transition-colors duration-300 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
              currentStatus
            )}`}
          >
            {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
          </span>
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
              const isCurrent = currentStep === index + 1;
              return (
                <div
                  key={step.label}
                  className="flex flex-col items-center w-1/4 relative z-10"
                >
                  <div
                    className={`shadow-md ring-4 ring-orange-200 w-10 h-10 flex items-center justify-center rounded-full border-2 text-lg transition-all ${
                      isCompleted
                        ? isCurrent
                          ? "bg-orange-500 border-orange-500 text-white animate-bounce"
                          : "bg-orange-500 border-orange-500 text-white"
                        : "bg-white border-gray-300 text-gray-400"
                    }`}
                  >
                    {step.icon}
                  </div>
                  <p className="text-xs mt-2 text-gray-600 text-center">
                    {step.label}
                  </p>
                </div>
              );
            })}
            <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded">
              <div
                className="h-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Delivery Address */}
          <div className="border border-gray-100 rounded-xl p-4">
            <p className="font-medium text-gray-700 mb-2">Delivery Address</p>
            <p className="text-sm text-gray-500">
              {data?.deliveryAddress?.text}
            </p>
            <p className="text-sm text-gray-500">
              Lat: {data?.deliveryAddress?.latitude}, Lon:{" "}
              {data?.deliveryAddress?.longitude}
            </p>
          </div>

          {/* Items */}
          <div className="border border-gray-100 rounded-xl p-4">
            <p className="font-medium text-gray-700 mb-3">Items</p>
            <div className="space-y-3">
              {data.shopOrders.shopOrderItems.map((item) => (
                <div
                  key={item._id}
                  className="hover:bg-gray-50 rounded-lg transition flex items-center gap-4 border-b pb-3 last:border-b-0"
                >
                  <img
                    src={item.item.image}
                    alt={item.item.name}
                    className="w-16 h-16 object-cover rounded-lg hover:scale-105 transition-transform"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">
                      {item.item.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity} × ₹{item.price}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    ₹{item.quantity * item.price}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Status Update */}
          <div className="flex justify-between items-center border border-gray-100 rounded-xl p-4">
            <span className="font-medium text-gray-700">
              Status:{" "}
              <span className="text-gray-800">
                {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
              </span>
            </span>
            <select
              value={currentStatus}
              onChange={(e) =>
                handleUpdateStatus(
                  data._id,
                  data.shopOrders.shop._id,
                  e.target.value
                )
              }
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
            >
              <option value="pending">Pending</option>
              <option value="preparing">Preparing</option>
              <option value="out for delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>

          {data.shopOrders.status === "out for delivery" && 
          <div>
            <p>Available Delivery Boys:</p>
            {availableBoys.length>0?(availableBoys.map((b,index)=>(
              <div key={index} className="flex items-center justify-between bg-orange-50 border-orange-200 px-3 py-2 rounded-lg"><span className="font-medium text-gray-800">{b.fullName} ({b.mobile})</span>
              <MdPhone className="text-orange-500"/>{b.mobile}</div>
            ))):<div>Waiting for Delivery Boys Available</div>}</div>}

          {/* Total */}
          <div className="flex justify-end text-lg font-semibold text-gray-800 border-t pt-4">
            Total: ₹{data.shopOrders.subtotal}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out forwards; }
        .animate-bounce { animation: bounce 1.2s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

export default OwnerOrderCard;
