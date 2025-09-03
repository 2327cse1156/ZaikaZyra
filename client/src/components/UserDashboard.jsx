import { categories } from "../category";
import Nav from "./Nav";
import CategoryCard from "./CategoryCard";
import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useGetCity from "../hooks/useGetCity";

function UserDashboard() {

  const {city} = useSelector(state=>state.user)
  useGetCity();
  const cateScroll = React.useRef();
  const [showLeftCateRef, setShowLeftCateRef] = useState(false);

  const [showRightCateRef, setShowRightCateRef] = useState(false);

  const scrollHandler = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction == "left" ? -250 : 250,
        behavior: "smooth",
      });
    }
  };

  const updateButton = (ref, setLeftButton, setRightButton) => {
    const element = ref.current;
    if (element) {
      // console.log(element);
      setLeftButton(element.scrollLeft > 0);
      setRightButton(
        element.scrollLeft + element.clientWidth < element.scrollWidth
      );
    }
  };

  useEffect(() => {
    if (cateScroll.current) {
      updateButton(cateScroll, setShowLeftCateRef, setShowRightCateRef);
      cateScroll.current.addEventListener("scroll", () => {
        updateButton(cateScroll, setShowLeftCateRef, setShowRightCateRef);
      });
    }

    return ()=>cateScroll.current.removeEventListener("scroll",()=>{
      updateButton(cateScroll,setShowLeftCateRef,setShowRightCateRef)
    })
  }, [categories]);

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-gray-50 via-orange-50 to-green-100 overflow-hidden">
      {/* Navbar */}
      <Nav />
      <div className="absolute w-72 h-72 rounded-full opacity-30 animate-bounce-slow -top-20 -left-10 bg-green-300"></div>
      <div className="absolute w-56 h-56 rounded-full opacity-25 animate-bounce-slower top-10 right-0 bg-yellow-300"></div>
      <div className="absolute w-64 h-64 rounded-full opacity-20 animate-bounce-slow left-1/4 bottom-10 bg-orange-300"></div>

      <div className="relative z-10 px-6 sm:px-10 py-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-800 mb-6 text-center animate-slideDown">
          🍽 Inspiration for your next meal
        </h1>
        <div className="relative flex items-center">
          {showLeftCateRef && (
            <button
              className="absolute left-0 z-20 bg-white shadow-md rounded-full p-3 hover:bg-gray-100 transition-transform hover:scale-110 active:scale-95"
              onClick={() => scrollHandler(cateScroll, "left")}
            >
              <FaArrowLeft className="text-gray-600" />
            </button>
          )}

          <div
            ref={cateScroll}
            className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide px-4 sm:px-8 py-4 scroll-smooth"
          >
            {categories.map((category, index) => (
              <CategoryCard key={index} data={category} />
            ))}
          </div>
          {showRightCateRef && (
            <button
              className="absolute right-0 z-20 bg-white shadow-md rounded-full p-3 hover:bg-gray-100 transition-transform hover:scale-110 active:scale-95"
              onClick={() => scrollHandler(cateScroll, "right")}
            >
              <FaArrowRight className="text-gray-600" />
            </button>
          )}
        </div>

        <h1></h1>
      </div>

      <div className="px-6 sm:px-10 pb-10">
        <h1 className="text-xl font-semibold text-gray-800">🏪 Best Shop in {city || "your area"}</h1>
           <div className="relative flex items-center">
          {showLeftCateRef && (
            <button
              className="absolute left-0 z-20 bg-white shadow-md rounded-full p-3 hover:bg-gray-100 transition-transform hover:scale-110 active:scale-95"
              onClick={() => scrollHandler(cateScroll, "left")}
            >
              <FaArrowLeft className="text-gray-600" />
            </button>
          )}

          <div
            ref={cateScroll}
            className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide px-4 sm:px-8 py-4 scroll-smooth"
          >
            {categories.map((category, index) => (
              <CategoryCard key={index} data={category} />
            ))}
          </div>
          {showRightCateRef && (
            <button
              className="absolute right-0 z-20 bg-white shadow-md rounded-full p-3 hover:bg-gray-100 transition-transform hover:scale-110 active:scale-95"
              onClick={() => scrollHandler(cateScroll, "right")}
            >
              <FaArrowRight className="text-gray-600" />
            </button>
          )}
        </div>
      </div>
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-25px); }
        }
        .animate-bounce-slow { animation: bounce-slow 8s ease-in-out infinite; }
        .animate-bounce-slower { animation: bounce-slow 12s ease-in-out infinite; }

        @keyframes slideDown { from {opacity:0; transform: translateY(-30px);} to {opacity:1; transform: translateY(0);} }
        .animate-slideDown { animation: slideDown 1s ease-in forwards; }

        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

export default UserDashboard;
