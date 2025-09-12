// hooks/useGetCity.js
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  setCity,
  setCurrentState,
  setCurrentAddress,
} from "../redux/userSlice";
import { setAddress, setLocation } from "../redux/mapSlice";

function useGetCity() {
  const dispatch = useDispatch();
  const apiKey = import.meta.env.VITE_GEO_API_KEY;

  useEffect(() => {
    const fetchCity = async (latitude, longitude) => {
      try {
        // Save lat/lon to Redux
        dispatch(setLocation({ lat: latitude, lon: longitude }));

        const { data } = await axios.get(
          `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`
        );

        const location = data?.results?.[0] || {};

        // ✅ Prioritize smaller areas before falling back
        const city =
          location.city ||
          location.town ||
          location.village ||
          location.municipality ||
          location.suburb ||
          location.county ||
          location.state_district ||
          "Unknown";

        const state = location.state || "Unknown";

        const address =
          location.formatted ||
          location.address_line2 ||
          location.address_line1 ||
          "Unknown";

        // Dispatch to Redux
        dispatch(setCity(city));
        dispatch(setCurrentState(state));
        dispatch(setCurrentAddress(address));
        dispatch(setAddress(address)); // ✅ fixed here

        // Debug logs
        console.log("City:", city);
        console.log("State:", state);
        console.log("Address:", address);
      } catch (err) {
        console.error("Error fetching city:", err);
        dispatch(setCity("Unknown"));
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
