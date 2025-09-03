import axios from "axios";
import { useEffect } from "react";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import {setShopsInMyCity} from "../redux/userSlice"
function useGetShopByCity() {

    const {city} = useSelector(state=>state.user)
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchShop = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/shop/get-by-city/${city}`, {
          withCredentials: true, 
        });
        dispatch(setShopsInMyCity(result.data));
        console.log("Current user:", result.data);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchShop();
  }, [city]);
}

export default useGetShopByCity;
