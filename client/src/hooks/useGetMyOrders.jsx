import axios from "axios";
import { useEffect } from "react";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setMyOrders } from "../redux/userSlice";

function useGetMyOrders() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (!userData) return; // don't fetch until user is logged in

    const fetchOrders = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/order/my-orders`, {
          withCredentials: true,
        });
        dispatch(setMyOrders(result.data));
        console.log("Current orders:", result.data);
      } catch (error) {
        if (error.response?.status === 404) {
          console.log("No orders found for this user");
          dispatch(setMyOrders(null)); // ✅ clear user orders
        } else {
          console.error("Error fetching orders:", error);
        }
      }
    };

    fetchOrders();
  }, [dispatch, userData]);
}

export default useGetMyOrders;
