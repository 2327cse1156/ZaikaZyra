import { FaLocationPin } from "react-icons/fa6";
import { IoIosArrowRoundBack, IoIosSearch } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { BiCurrentLocation } from "react-icons/bi";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { useDispatch, useSelector } from "react-redux";
import { setLocation } from "../redux/mapSlice";
import { useEffect } from "react";

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
    }, 200);
  }, [map]);
  return null;
}

function CheckOut() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { location, address } = useSelector((state) => state.map);

  // ✅ Only update Redux state, no useMap here
  const onDragEnd = (e) => {
    const { lat, lng } = e.target._latlng;
    dispatch(setLocation({ lat, lon: lng }));
  };

  const getAddressByLatLng = async()=>{}

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
              value={address || ""}
              placeholder="Enter your Delivery Address..."
              className="flex-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              readOnly
            />
            <button className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
              <IoIosSearch size={20} />
            </button>
            <button className="p-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
              <BiCurrentLocation size={20} />
            </button>
          </div>

          {/* Map */}
          <div className="h-[350px] rounded-xl overflow-hidden shadow-lg border border-gray-200">
            <MapContainer
              center={[location?.lat || 28.6139, location?.lon || 77.2090]}
              zoom={16}
              className="w-full h-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <RecenterMap location={location} />
              <FixMapResize />
              <Marker
                position={[location?.lat || 28.6139, location?.lon || 77.2090]}
                draggable
                eventHandlers={{ dragend: onDragEnd }}
              />
            </MapContainer>
          </div>
        </section>

        {/* Place Order */}
        <div className="mt-8 flex justify-end">
          <button className="bg-green-600 text-white px-6 py-3 rounded-xl shadow-md hover:bg-green-700 hover:scale-105 transition-all duration-300">
            Confirm Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default CheckOut;
