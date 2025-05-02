import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Dialog } from "@headlessui/react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FiMapPin } from "react-icons/fi";

// Leaflet marker fix
const pipIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -41],
});

// Utility to calculate Haversine distance
const getDistanceKm = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Radius of the Earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Force Leaflet map to resize when shown
const ResizeMap = () => {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 200); // Delay for modal animation
  }, [map]);
  return null;
};

const CountryMapModal = ({ country }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [distance, setDistance] = useState(null);

  const latlng = country?.latlng || [0, 0];
  const countryName = country?.name?.common || "Unknown Country";

  // Get user's location and calculate distance
  const handleOpen = () => {
    setIsOpen(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLon = position.coords.longitude;
          setUserLocation([userLat, userLon]);

          const dist = getDistanceKm(userLat, userLon, latlng[0], latlng[1]);
          setDistance(dist.toFixed(2));
        },
        (error) => {
          console.error("Geolocation error:", error);
          setDistance("Location access denied");
        }
      );
    } else {
      setDistance("Geolocation not supported");
    }
  };

  return (
    <div className="text-center mt-8">
      <button
        onClick={handleOpen}
        className="px-6 py-3 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition-all font-semibold shadow-lg"
      >
        <div className="flex items-center justify-center gap-2">
          Show {countryName} on Map <FiMapPin />
        </div>
      </button>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div className="fixed inset-0 bg-black bg-opacity-30" aria-hidden="true" />

        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 z-50 relative">
          <h2 className="text-xl font-bold mb-2">{countryName}</h2>

          {distance && (
            <p className="mb-4 text-sm text-gray-600">
              🌍 Distance from your location: <strong>{distance}</strong> km
            </p>
          )}

          <MapContainer
            center={latlng}
            zoom={4}
            scrollWheelZoom={false}
            className="h-80 w-full rounded-xl z-0"
          >
            <ResizeMap />
            <TileLayer
              attribution='&copy; <a href="https://osm.org">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={latlng} icon={pipIcon}>
              <Popup>{countryName}</Popup>
            </Marker>
            {userLocation && (
              <Marker position={userLocation}>
                <Popup>Your Location</Popup>
              </Marker>
            )}
          </MapContainer>

          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
          >
            ✕
          </button>
        </div>
      </Dialog>
    </div>
  );
};

export default CountryMapModal;
