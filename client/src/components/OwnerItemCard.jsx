import axios from "axios";
import { FaPencilAlt } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import { setMyShopData } from "../redux/ownerSlice";
import { useDispatch } from "react-redux";
function OwnerItemCard({ data }) {
  console.log(data);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleDelete = async () =>{
    try {
      const result = await axios.get(`${serverUrl}/api/item/delete/${data._id}`,{withCredentials:true})
      dispatch(setMyShopData(result.data));
    } catch (error) {
     console.log(error);
      
    }
  }
  return (
    <div className="flex flex-col bg-white/80 backdrop-blur-md border border-white/40 shadow-md overflow-hidden rounded-2xl animate-fadeIn p-4 md:p-6 hover:shadow-lg transition">
      <div className="w-full h-40 sm:h-44 md:h-48 overflow-hidden">
        <img src={data.image} className="w-full h-full object-cover rounded-t-2xl hover:scale-105 transition-transform" alt={data.name} />
      </div>
      <div className="p-4 flex flex-col justify-between flex-grow animate-slideUp">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">{data.name}</h2>
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-medium text-gray-700">Category :</span> {data.category}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium text-gray-700">Food Type: </span>
            {data.foodType}
          </p>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="text-gray-800 font-semibold text-sm sm:text-base">
            <span className="text-gray-600">Price: </span>₹{data.price}
          </div>
          <div className="flex items-center gap-3 text-gray-500">
            <button
              onClick={() => navigate(`/edit-item/${data._id}`)}
              className="p-2 rounded-full hover:bg-gray-100 transition-transform hover:scale-110 active:scale-95"
            >
              <FaPencilAlt size={16} className="text-blue-500" />
            </button>
            <button onClick={handleDelete} className="p-2 rounded-full hover:bg-gray-100 transition-transform hover:scale-110 active:scale-95">
              <FaTrashAlt size={16} className="text-red-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OwnerItemCard;
