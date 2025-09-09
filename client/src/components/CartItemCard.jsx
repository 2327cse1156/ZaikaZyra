import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { removeItem, updateQuantity } from "../redux/userSlice";

function CartItemCard({ data }) {
  const dispatch = useDispatch();

  const handleDecrease = (id, currentQty) => {
    if (currentQty > 1) dispatch(updateQuantity({ id, quantity: currentQty - 1 }));
  };

  const handleIncrease = (id, currentQty) => {
    dispatch(updateQuantity({ id, quantity: currentQty + 1 }));
  };

  return (
    <div className="flex items-center justify-between bg-white rounded-xl shadow-md p-4 border border-gray-100 
                    hover:shadow-lg hover:bg-gray-50 hover:scale-[1.02] transition-all duration-300 ease-in-out">
      {/* Left: Image + Info */}
      <div className="flex items-center space-x-4">
        <img
          src={data.image}
          alt={data.name}
          className="w-16 h-16 object-cover rounded-lg border"
        />
        <div>
          <h1 className="text-gray-800 font-semibold text-base">{data.name}</h1>
          <p className="text-gray-600 text-sm">
            ₹{data.price} x {data.quantity}
          </p>
          <p className="text-green-600 font-bold text-sm">
            ₹{data.price * data.quantity}
          </p>
        </div>
      </div>

      {/* Right: Quantity Controls + Trash */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-2 py-1">
          <button
            onClick={() => handleDecrease(data.id, data.quantity)}
            className="p-1 rounded-full bg-white border border-gray-300 hover:bg-gray-200 transition"
          >
            <FaMinus className="text-xs" />
          </button>
          <span className="text-sm font-medium">{data.quantity}</span>
          <button
            onClick={() => handleIncrease(data.id, data.quantity)}
            className="p-1 rounded-full bg-white border border-gray-300 hover:bg-gray-200 transition"
          >
            <FaPlus className="text-xs" />
          </button>
        </div>

        <button
          onClick={() => dispatch(removeItem(data.id))}
          className="text-red-500 hover:text-red-700 transition"
        >
          <FaTrash size={16} />
        </button>
      </div>
    </div>
  );
}

export default CartItemCard;
