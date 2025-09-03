function CategoryCard({ data }) {
  return (
    <div className="flex-shrink-0 w-40 sm:w-48 md:w-56 bg-white/90 backdrop-blur-md border border-gray-200 shadow-md rounded-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer animate-fadeIn">
      {/* Image */}
      <div className="w-full h-28 sm:h-32 md:h-36 overflow-hidden">
        <img
          className="w-full h-full object-cover rounded-t-2xl hover:scale-110 duration-500 transition-transform"
          src={data.image}
          alt={data.category}
        />
      </div>

      {/* Text */}
      <div className="p-3 flex flex-col justify-center items-center animate-slideUp">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 tracking-wide text-center">
          {data.category}
        </h3>
        <span className="w-10 sm:w-12 h-1 mt-2 bg-green-500 rounded-full"></span>
      </div>
    </div>
  );
}

export default CategoryCard;
