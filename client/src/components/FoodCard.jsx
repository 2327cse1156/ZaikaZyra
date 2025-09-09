import { useState } from "react";
import {
  FaLeaf,
  FaMinus,
  FaPlus,
  FaRegStar,
  FaShoppingCart,
  FaStar,
  FaDrumstickBite,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/userSlice";

function FoodCard({ data }) {
  const [quantity, setQuantity] = useState(0);
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.user);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i}>
          {i <= rating ? (
            <FaStar className="text-yellow-500 text-sm sm:text-base inline" />
          ) : (
            <FaRegStar className="text-yellow-500 text-sm sm:text-base inline" />
          )}
        </span>
      );
    }
    return stars;
  };

  const handleIncrease = () => setQuantity((prev) => prev + 1);
  const handleDecrease = () => setQuantity((prev) => (prev > 0 ? prev - 1 : 0));

  return (
    <div className="flex-shrink-0 w-40 sm:w-48 md:w-56 bg-white/90 backdrop-blur-md border border-gray-200 shadow-md rounded-2xl hover:-translate-y-1 transition-all duration-300 animate-fadeIn">
      {/* Image Section */}
      <div className="w-full h-28 sm:h-32 md:h-36 relative overflow-hidden rounded-t-2xl">
        <img
          className="w-full h-full object-cover hover:scale-110 duration-500 transition-transform"
          src={data.image}
          alt={data.name}
        />
        {/* Veg / Non-Veg Icon */}
        <div className="absolute top-2 left-2 bg-white p-1 rounded-full shadow-md">
          {data.foodType?.toLowerCase() === "veg" ? (
            <FaLeaf className="text-green-600 text-lg" />
          ) : (
            <FaDrumstickBite className="text-red-500 text-lg" />
          )}
        </div>
      </div>

      {/* Details Section */}
      <div className="p-3 flex flex-col justify-center items-center animate-slideUp">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 tracking-wide text-center line-clamp-1">
          {data.name}
        </h3>

        {/* Ratings */}
        <div className="flex items-center gap-1 mt-1">
          {renderStars(Math.round(data.rating?.average || 0))}
          <span className="text-gray-600 text-xs">
            ({data.rating?.count || 0})
          </span>
        </div>

        {/* Price */}
        <p className="text-sm sm:text-base text-gray-700 mt-2 font-medium">
          ₹ {data.price}
        </p>
        <span className="w-10 sm:w-12 h-1 mt-2 bg-green-500 rounded-full"></span>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center px-4 py-2 border-t border-gray-200 rounded-b-2xl bg-gray-50">
        {/* Quantity Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDecrease}
            className="p-1 rounded-full border border-gray-300 hover:bg-gray-200 transition"
          >
            <FaMinus className="text-sm" />
          </button>
          <span className="text-sm font-medium">{quantity}</span>
          <button
            onClick={handleIncrease}
            className="p-1 rounded-full border border-gray-300 hover:bg-gray-200 transition"
          >
            <FaPlus className="text-sm" />
          </button>
        </div>

        {/* Cart Button */}
        <button
          className={`${
            cartItems.some((i) => i.id == data._id)
              ? "bg-amber-600"
              : " bg-green-500 hover:bg-green-600"
          } flex items-center gap-1 px-2 py-1 text-white rounded-lg text-sm transition`}
          onClick={() =>
            quantity>0?dispatch(
              addToCart({
                id: data._id,
                name: data.name,
                price: data.price,
                image: data.image,
                shop: data.shop,
                quantity,
                foodType: data.foodType,
              })
            ):null
          }
        >
          <FaShoppingCart />
          <span className="hidden sm:inline">Add</span>
        </button>
      </div>
    </div>
  );
}

export default FoodCard;
