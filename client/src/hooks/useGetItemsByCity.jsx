import axios from "axios";
import { useEffect } from "react";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setMyShopData } from "../redux/ownerSlice";
import { setShopsInMyCity } from "../redux/userSlice";
import { setItemsInMyCity } from "../redux/userSlice";
function useGetItemsByCity() {
  const dispatch = useDispatch();
  const {city} = useSelector(state=>state.user)

  useEffect(() => {
    if(!city) return;
    const fetchItems = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/item/get-by-city/${city}`, {
          withCredentials: true,
        });
        dispatch(setItemsInMyCity(result.data));
        console.log("Current items:", result.data);
      } catch (error) {
        if (error.response?.status === 404) {
          console.log("No shop found for this user");
          dispatch(setShopsInMyCity(null));
        } else {
          console.error("Error fetching shop:", error);
        }
      }
    };

    fetchItems();
  }, [dispatch,city]); 
}

export default useGetItemsByCity;
