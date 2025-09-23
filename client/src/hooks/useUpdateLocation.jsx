// hooks/useUpdateLocation.js
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  setCity,
  setCurrentState,
  setCurrentAddress,
} from "../redux/userSlice";
import {serverUrl} from "../App";
import { setAddress, setLocation } from "../redux/mapSlice";

function useUpdateLocation() {
  const dispatch = useDispatch();

  useEffect(() => {
    const updateLocation = async (latitude, longitude) => {
      try {
        // Save raw coordinates
        dispatch(setLocation({ lat: latitude, lon: longitude }));

        // Ask backend to reverse geocode
        const { data } = await axios.post(
          `${serverUrl}/api/user/update-location`,
          { lat:latitude, lon:longitude },
          { withCredentials: true }
        );

        // Backend must return city/state/address
        const { city, state, address } = data;

        // Dispatch to Redux
        dispatch(setCity(city || "Unknown"));
        dispatch(setCurrentState(state || "Unknown"));
        dispatch(setCurrentAddress(address || "Unknown"));
        dispatch(setAddress(address || "Unknown"));

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
          updateLocation(pos.coords.latitude, pos.coords.longitude);
        },
        (err) => {
          console.error("Geolocation denied:", err);
          dispatch(setCity("Unknown"));
        }
      );
    } else {
      dispatch(setCity("Unknown"));
    }
  }, [dispatch]);
}

export default useUpdateLocation;
