import { useSelector } from "react-redux";
import { FaUtensils } from "react-icons/fa";
import { FaPen } from "react-icons/fa";
import Nav from "./Nav";
import { useNavigate } from "react-router-dom";

function OwnerDashboard() {
  const { myShopData } = useSelector((state) => state.owner);

  const navigate = useNavigate();

  const bubbleColors = ["#FBBF24", "#86EFAC", "#22C55E"];

  return (
    <div className="relative overflow-hidden min-h-screen bg-[#FFF7ED]">
      <Nav />
      <div
        className="absolute w-72 h-72 rounded-full opacity-30 animate-bounce-slow -top-20 -left-10"
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
      <div
        className="absolute w-48 h-48 rounded-full opacity-25 animate-bounce-slower -bottom-10 right-1/3"
        style={{ backgroundColor: bubbleColors[1] }}
      ></div>

      {!myShopData && (
        <div className="relative flex items-center justify-center px-4 py-20 sm:py-28 z-10">
          <div className="relative w-full max-w-3xl bg-white/80 backdrop-blur-md border border-white/40 shadow-2xl rounded-2xl p-8 md:p-12 animate-fadeIn text-center">
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-green-100 text-green-600 rounded-full shadow-lg">
              <FaUtensils size={36} />
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4 animate-slideDown">
              Add Your Restaurant
            </h2>
            <p className="font-semibold text-gray-600 max-w-lg mx-auto mb-8 text-base md:text-lg leading-relaxed animate-slideUp">
              Join{" "}
              <span className="font-semibold text-green-600">ZaikaZyra</span>{" "}
              and showcase your{" "}
              <span className="text-yellow-500">delicious menu</span> to
              thousands of hungry customers. Grow your food business
              effortlessly
            </p>
            <button
              onClick={() => navigate("/create-edit-shop")}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full shadow-lg font-semibold transition-transform hover:scale-105 active:scale-95 w-full sm:w-auto animate-slideUp"
            >
              🍴 Get Started
            </button>
          </div>
        </div>
      )}

      {myShopData && (
        <div className="relative z-10 px-4 sm:px-8 py-10">
          <h1 className="flex items-center justify-center gap-3 text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-800 mb-6 animate-slideDown">
            <FaUtensils className="text-green-600" />
            Welcome to {myShopData.name}
          </h1>
          <div className="relative max-w-md mx-auto mb-8">
            <div
              className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 cursor-pointer transition-transform hover:scale-110 active:scale-95 z-20"
              onClick={() => navigate("/create-edit-shop")}
            >
              <FaPen size={20} className="text-gray-700" />
            </div>
            <img
              className="w-full h-60 sm:h-72 md:h-80 object-cover rounded-2xl shadow-lg animate-fadeIn"
              src={myShopData.image}
              alt="shop image"
            />
          </div>
          <div className="text-center mb-10 animate-slideUp">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {myShopData.name}
            </h1>
            <p className="text-gray-600 font-medium text-base sm:text-lg">
              {myShopData.city},{myShopData.state}
            </p>
            <p className="text-gray-500 text-sm sm:text-base">
              {myShopData.address}
            </p>
          </div>

          {myShopData.items.length == 0 && (
            <div className="flex items-center justify-center">
              <div className="bg-white/80 backdrop-blur-md border border-white/40 shadow-xl rounded-2xl p-8 md:p-10 text-center animate-fadeIn max-w-lg">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-5 bg-green-100 text-green-600 rounded-full shadow-lg">
                  <FaUtensils size={28} />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">Your Food Item</h2>
                <p className="text-gray-600 text-sm sm:text-base mb-6">Add your delicious food items to the menu</p>
                <button className="bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full shadow-lg font-semibold transition-transform hover:scale-105 active:scale-95" onClick={() => navigate("/add-food")}>➕Add Food</button>
              </div>
            </div>
          )}
        </div>
      )}
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-25px); }
        }
        .animate-bounce-slow { animation: bounce-slow 8s ease-in-out infinite; }
        .animate-bounce-slower { animation: bounce-slow 12s ease-in-out infinite; }

        @keyframes fadeIn { from {opacity:0} to {opacity:1} }
        .animate-fadeIn { animation: fadeIn 1s ease-in forwards; }

        @keyframes slideDown { from {opacity:0; transform: translateY(-30px);} to {opacity:1; transform: translateY(0);} }
        .animate-slideDown { animation: slideDown 1s ease-in forwards; }

        @keyframes slideLeft { from {opacity:0; transform: translateX(-20px);} to {opacity:1; transform: translateX(0);} }
        .animate-slideLeft { animation: slideLeft 0.8s ease-in forwards; }

        @keyframes slideUp { from {opacity:0; transform: translateY(20px);} to {opacity:1; transform: translateY(0);} }
        .animate-slideUp { animation: slideUp 0.8s ease-in forwards; }
      `}</style>
    </div>
  );
}

export default OwnerDashboard;
