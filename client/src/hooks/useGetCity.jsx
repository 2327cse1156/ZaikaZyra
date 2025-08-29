// hooks/useGetCity.js
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCity } from "../redux/userSlice";

function useGetCity() {
  const dispatch = useDispatch();
  const apiKey = import.meta.env.VITE_GEO_API_KEY;

  useEffect(() => {
    const fetchCity = async (latitude, longitude) => {
      try {
        const result = await axios.get(
          `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`
        );
        const city =
          result?.data?.results?.[0]?.city ||
          result?.data?.results?.[0]?.county ||
          "Unknown";
        dispatch(setCity(city));
      } catch (err) {
        console.error("Error fetching city:", err);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetchCity(pos.coords.latitude, pos.coords.longitude);
        },
        (err) => {
          console.error("Geolocation denied:", err);
          dispatch(setCity("Unknown"));
        }
      );
    } else {
      dispatch(setCity("Unknown"));
    }
  }, [apiKey, dispatch]);
}

export default useGetCity;
