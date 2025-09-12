import { FaLocationPin, FaMobileButton } from "react-icons/fa6";
import { IoIosArrowRoundBack, IoIosSearch } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { BiCreditCardFront, BiCurrentLocation } from "react-icons/bi";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { useDispatch, useSelector } from "react-redux";
import { setAddress, setLocation } from "../redux/mapSlice";
import { useEffect, useState } from "react";
import axios from "axios";
import L from "leaflet";
import { MdDeliveryDining } from "react-icons/md";

// ✅ Fix default Leaflet Marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// ✅ Keeps map centered when location updates
function RecenterMap({ location }) {
  const map = useMap();
  useEffect(() => {
    if (location.lat && location.lon) {
      map.setView([location.lat, location.lon], 16, { animate: true });
    }
  }, [location, map]);
  return null;
}

// ✅ Fixes the "half map" rendering issue
function FixMapResize() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 300);
  }, [map]);
  return null;
}

function CheckOut() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { location, address } = useSelector((state) => state.map);

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [addressInput, setAddressInput] = useState("");

  // ✅ Reverse Geocoding
  const getAddressByLatLng = async (lat, lng) => {
    try {
      const apiKey = import.meta.env.VITE_GEO_API_KEY;
      const { data } = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${apiKey}`
      );
      const loc = data?.results?.[0] || {};

      const fetchedAddress =
        loc.formatted || loc.address_line2 || loc.address_line1 || "Unknown";

      dispatch(setAddress(fetchedAddress));
      setAddressInput(fetchedAddress); // ✅ sync input only after reverse geocoding
    } catch (error) {
      console.log("Error fetching address:", error);
    }
  };

  // ✅ Marker drag handler
  const onDragEnd = (e) => {
    const { lat, lng } = e.target._latlng;
    dispatch(setLocation({ lat, lon: lng }));
    getAddressByLatLng(lat, lng);
  };

  // ✅ Fetch address when location updates
  useEffect(() => {
    if (location.lat && location.lon) {
      getAddressByLatLng(location.lat, location.lon);
    }
  }, [location.lat, location.lon]);

  // ✅ Current Location button
  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          dispatch(setLocation({ lat: latitude, lon: longitude }));
          getAddressByLatLng(latitude, longitude);
        },
        (err) => {
          console.error("Geolocation error:", err);
        }
      );
    } else {
      alert("Geolocation not supported in this browser.");
    }
  };

  // ✅ Forward Geocoding (search → lat/lon)
  const getLatLngByAddress = async () => {
    if (!addressInput.trim()) {
      alert("Please enter an address.");
      return;
    }

    try {
      const apiKey = import.meta.env.VITE_GEO_API_KEY;
      const { data } = await axios.get(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
          addressInput
        )}&format=json&apiKey=${apiKey}`
      );

      const loc = data?.results?.[0];
      if (loc) {
        dispatch(setLocation({ lat: loc.lat, lon: loc.lon }));
        dispatch(setAddress(loc.formatted || addressInput));
        setAddressInput(loc.formatted || addressInput); // ✅ only update after success
      } else {
        alert("No results found for the given address.");
      }
    } catch (error) {
      console.error("Error searching address:", error);
      alert("Something went wrong while searching address.");
    }
  };

  const bubbleColors = ["#FBBF24", "#86EFAC", "#22C55E"];

  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden"
      style={{ backgroundColor: "#FFF7ED" }}
    >
      {/* Background Bubbles */}
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

      {/* Checkout Card */}
      <div className="relative w-full max-w-3xl bg-white/90 backdrop-blur-lg border border-white/40 shadow-xl rounded-2xl p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            className="flex items-center text-gray-800 hover:text-green-600 transition duration-300"
            onClick={() => navigate("/")}
          >
            <IoIosArrowRoundBack size={24} className="mr-2" />
            Back to Home
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            ✅ Checkout
          </h1>
        </div>

        {/* Delivery Section */}
        <section>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-4">
            <FaLocationPin className="text-green-600" /> Delivery Location
          </h2>

          {/* Address Input */}
          <div className="flex items-center gap-2 mb-6">
            <input
              type="text"
              value={addressInput || ""}
              placeholder="Enter your Delivery Address..."
              className="flex-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              onChange={(e) => setAddressInput(e.target.value)} // ✅ user always controls input
            />
            <button
              onClick={getLatLngByAddress}
              className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <IoIosSearch size={20} />
            </button>
            <button
              className="p-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              onClick={handleCurrentLocation}
            >
              <BiCurrentLocation size={20} />
            </button>
          </div>

          {/* Map */}
          <div className="h-[350px] w-full rounded-xl overflow-hidden shadow-lg border border-gray-200">
            <MapContainer
              center={[location?.lat || 28.6139, location?.lon || 77.209]}
              zoom={16}
              scrollWheelZoom={true}
              className="w-full h-full z-0"
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <RecenterMap location={location} />
              <FixMapResize />
              <Marker
                position={[location?.lat || 28.6139, location?.lon || 77.209]}
                draggable
                eventHandlers={{ dragend: onDragEnd }}
              />
            </MapContainer>
          </div>
        </section>

        {/* Place Order
        <div className="mt-8 flex justify-end">
          <button className="bg-green-600 text-white px-6 py-3 rounded-xl shadow-md hover:bg-green-700 hover:scale-105 transition-all duration-300">
            Confirm Order
          </button>
        </div> */}

        {/* payment section */}
        <section className="mt-6">
          <h2 className="text-lg font-semibold mb-3">Payment Method</h2>
          <div className="grid gap-4">
            <div
              className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                paymentMethod === "cod"
                  ? "border-[#ff4d2d] bg-orange-50 shadow-md"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setPaymentMethod("cod")}
            >
              <span className="text-2xl text-[#ff4d2d]">
                <MdDeliveryDining />
              </span>
              <div>
                <p className="font-medium">Cash on Delivery</p>
                <p className="text-sm text-gray-500">
                  Pay when your food arrives
                </p>
              </div>
            </div>
            <div
              className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200
        ${
          paymentMethod === "online"
            ? "border-[#ff4d2d] bg-orange-50 shadow-md"
            : "border-gray-200 hover:border-gray-300"
        }`}
              onClick={() => setPaymentMethod("online")} 
            >
              <div className="flex flex-col text-[#ff4d2d] text-xl">
                <FaMobileButton />
                <BiCreditCardFront />
              </div>
              <div>
                <p className="font-medium">UPI / Credit / Debit Card</p>
                <p className="text-sm text-gray-500">Pay Securely Online</p>
              </div>
            </div>
          </div>
        </section>

        {/* order summary */}
        <section>
          <h2>Order Summary</h2>
          
        </section>

      </div>
    </div>
  );
}

export default CheckOut;
