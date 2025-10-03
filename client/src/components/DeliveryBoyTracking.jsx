import scooter from "../assets/scooter.png";
import home from "../assets/home.png";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useMap } from "react-leaflet/hooks";
import "../index.css"
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
} from "react-leaflet";

const deliveryBoyIcon = new L.Icon({
  iconUrl: scooter,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});
const customerIcon = new L.Icon({
  iconUrl: home,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

function FitBounds({ deliveryBoyLat, deliveryBoyLon, customerLat, customerLon }) {
  const map = useMap();
  if (deliveryBoyLat && deliveryBoyLon && customerLat && customerLon) {
    const bounds = [
      [deliveryBoyLat, deliveryBoyLon],
      [customerLat, customerLon],
    ];
    map.fitBounds(bounds, { padding: [50, 50] });
  }
  return null;
}

function DeliveryBoyTracking({ data }) {
  const deliveryBoyLat = data?.deliveryBoyLocation?.lat;
  const deliveryBoyLon = data?.deliveryBoyLocation?.lon;
  const customerLat = data?.deliveryAddress?.latitude;
  const customerLon = data?.deliveryAddress?.longitude;

  const path =
    deliveryBoyLat && deliveryBoyLon && customerLat && customerLon
      ? [
          [deliveryBoyLat, deliveryBoyLon],
          [customerLat, customerLon],
        ]
      : [];

  return (
    <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] mt-6 rounded-2xl overflow-hidden shadow-xl border border-gray-200 bg-white">
      {/* Floating Overlay Badge */}
      <div className="absolute top-3 left-3 z-[1000]">
        <span className="px-4 py-1 rounded-full text-white text-xs sm:text-sm font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 backdrop-blur-md bg-opacity-80 shadow-md">
          Live Tracking
        </span>
      </div>

      <MapContainer
        style={{ width: "100%", height: "100%" }}
        zoom={16}
        center={[0, 0]}
        className="rounded-2xl"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds
          deliveryBoyLat={deliveryBoyLat}
          deliveryBoyLon={deliveryBoyLon}
          customerLat={customerLat}
          customerLon={customerLon}
        />

        {/* Delivery Boy Marker */}
        {deliveryBoyLat && deliveryBoyLon && (
          <Marker
            position={[deliveryBoyLat, deliveryBoyLon]}
            icon={deliveryBoyIcon}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-blue-600 text-sm sm:text-base">
                  Delivery Boy
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Currently on route 🚚
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Customer Marker */}
        {customerLat && customerLon && (
          <Marker position={[customerLat, customerLon]} icon={customerIcon}>
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-green-600 text-sm sm:text-base">
                  Customer
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm">
                  {data?.deliveryAddress?.text}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Path Polyline */}
        {path.length > 0 && (
          <Polyline className="leaflet-animated" positions={path} color="blue" weight={4} dashArray="6, 10" />
          
        )}
      </MapContainer>
    </div>
  );
}

export default DeliveryBoyTracking;
