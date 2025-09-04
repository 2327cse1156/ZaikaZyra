import axios from "axios";
import { useEffect } from "react";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setMyShopData } from "../redux/ownerSlice";

function useGetMyShop() {
  const dispatch = useDispatch();
  const {userData} = useSelector(state=>state.user)
  useEffect(() => {
    const fetchShop = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/shop/get-my`, {
          withCredentials: true,
        });
        dispatch(setMyShopData(result.data));
        console.log("Current shop:", result.data);
      } catch (error) {
        if (error.response?.status === 404) {
          console.log("No shop found for this user");
          dispatch(setMyShopData(null));
        } else {
          console.error("Error fetching shop:", error);
        }
      }
    };

    fetchShop();
  }, [dispatch]); 
}

export default useGetMyShop;
