import { IoIosArrowRoundBack } from "react-icons/io";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CartItemCard from "../components/CartItemCard";

function CartPage() {
  const navigate = useNavigate();
  const { cartItems,totalAmount } = useSelector((state) => state.user);
  const bubbleColors = ["#FBBF24", "#86EFAC", "#22C55E"];
  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden"
      style={{ backgroundColor: "#FFF7ED" }}
    >
      {/* Background Bubbles */}
      <div
        className="absolute w-72 h-72 rounded-full opacity-30 animate-pulse -top-20 -left-10"
        style={{ backgroundColor: bubbleColors[0] }}
      ></div>
      <div
        className="absolute w-56 h-56 rounded-full opacity-25 animate-pulse top-10 right-0"
        style={{ backgroundColor: bubbleColors[1] }}
      ></div>
      <div
        className="absolute w-64 h-64 rounded-full opacity-20 animate-pulse left-1/4 bottom-10"
        style={{ backgroundColor: bubbleColors[2] }}
      ></div>
      <div
        className="absolute w-48 h-48 rounded-full opacity-25 animate-pulse -bottom-10 right-1/3"
        style={{ backgroundColor: bubbleColors[1] }}
      ></div>
      {/* cart card */}
      <div className="relative w-full max-w-3xl bg-white/90 backdrop-blur-lg border border-white/40 shadow-xl rounded-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <button
            className="flex items-center text-gray-800 hover:text-green-600 transition duration-300"
            onClick={() => navigate("/")}
          >
            <IoIosArrowRoundBack size={24} className="mr-2" />
            Back to Home
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            🛒 Your Food Cart
          </h1>
        </div>
        {cartItems.length == 0 ? (
          <p className="text-center text-gray-600 text-lg mt-10">
            Your Cart is Empty🥲
          </p>
        ) : (
          <>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {cartItems.map((item, index) => (
                <CartItemCard data={item} key={item.id || index} />
              ))}
            </div>
            <div className="mt-6 border-t border-gray-200 pt-4 flex items-center justify-between">
                <h1 className="text-lg font-semibold text-gray-700">Total Amount:</h1>
                <span className="text-xl font-bold text-green-600">₹{totalAmount}</span>
            </div>
            <div className="mt-6 flex justify-end"><button onClick={()=>navigate("/checkout")} className="bg-green-600 text-white px-6 py-3 rounded-xl shadow-md hover:bg-green-700 hover:scale-105 transition-all duration-300">Proceed To Checkout</button></div>
          </>
        )}
      </div>
    </div>
  );
}

export default CartPage;
