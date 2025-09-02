import { useNavigate, useParams } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { FaUtensils } from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { setMyShopData } from "../redux/ownerSlice";

function EditItem() {
  const navigate = useNavigate();
  const { myShopData } = useSelector((state) => state.owner);
  const { itemId } = useParams();
  const [currentItem, setCurrentItem] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [frontendImage, setFrontendImage] = useState("");
  const [backendImage, setBackendImage] = useState(null);
  const [category, setCategory] = useState("");
  const [foodType, setFoodType] = useState("Veg");
  const [loading, setLoading] = useState(false);
  const categories = [
    "Snacks",
    "Main Course",
    "Desserts",
    "Pizza",
    "Burgers",
    "Sandwiches",
    "South Indian",
    "North Indian",
    "Chinese",
    "Fast Food",
    "Others",
  ];

  const dispatch = useDispatch();

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("foodType", foodType);
      if (backendImage) {
        formData.append("image", backendImage);
      }

      const result = await axios.post(
        `${serverUrl}/api/item/edit-item/${itemId}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (result.status !== 200) {
        throw new Error("Failed to save shop");
      }
      dispatch(setMyShopData(result.data));
      setLoading(false);
      navigate("/");
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleGetItemById = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/item/get-by-id/${itemId}`,
          { withCredentials: true }
        );
        setCurrentItem(result.data);
        setFrontendImage(result.data.image);
      } catch (error) {
        console.error(error);
      }
    };
    handleGetItemById();
  }, [itemId]);

  useEffect(() => {
    setName(currentItem?.name || "");
    setPrice(currentItem?.price || 0);
    setCategory(currentItem?.category || "");
    setFoodType(currentItem?.foodType || "Veg");
  }, [currentItem]);

  const bubbleColors = ["#FBBF24", "#86EFAC", "#22C55E"];

  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden"
      style={{ backgroundColor: "#FFF7ED" }}
    >
      {/* Floating Bubbles */}
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

      {/* Card */}
      <div className="relative w-full max-w-2xl bg-white/90 backdrop-blur-lg border border-white/40 shadow-xl rounded-2xl p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center text-gray-600 hover:text-green-600 transition duration-300"
          >
            <IoMdArrowRoundBack size={24} className="mr-2" />
            Back
          </button>
          <FaUtensils className="text-green-600 text-2xl " />
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-6">
          Edit Food
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Item Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter Item Name"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Food Image
            </label>
            <input
              onChange={handleImage}
              type="file"
              accept="image/*"
              className="w-full text-sm text-gray-600 cursor-pointer"
            />
            {(frontendImage || currentItem?.image) && (
              <div className="mt-3">
                <img
                  src={frontendImage || currentItem?.image}
                  alt="Food Preview"
                  className="w-full h-48 object-cover rounded-xl border shadow-md"
                />
              </div>
            )}
          </div>
          {/* price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price
            </label>
            <input
              type="number"
              placeholder="0"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              required
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* category */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              onChange={(e) => setCategory(e.target.value)}
              value={category}
              required
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="">Select Category</option>
              {categories.map((cate, index) => (
                <option key={index} value={cate}>
                  {cate}
                </option>
              ))}
            </select>
          </div>

          {/* food type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Food Type
            </label>
            <select
              onChange={(e) => setFoodType(e.target.value)}
              value={foodType}
              required
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="Veg">Veg</option>
              <option value="Non-Veg">Non-Veg</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98]"
            disabled={loading}
          >
            {loading ? "Saving..." : "💾 Save"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditItem;
