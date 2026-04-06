import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapPin, Check, X, Navigation } from "lucide-react";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const LocationMarker = ({ position, setPosition }) => {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, Math.max(map.getZoom(), 10));
    },
  });

  return position === null ? null : <Marker position={position} />;
};

/**
 * MapLocationPicker
 * 
 * Props:
 *  - onLocationSelected(payload: { label: string, lat: number, lng: number })
 *  - onClose()
 */
const MapLocationPicker = ({ onLocationSelected, onClose }) => {
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [placeName, setPlaceName] = useState(null);

  const handleConfirm = async () => {
    if (!position) return;
    setLoading(true);
    let cityLabel = `${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}`;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}`
      );
      const data = await res.json();
      const city =
        data.address?.city ||
        data.address?.town ||
        data.address?.village ||
        data.address?.county ||
        "";
      if (city) {
        cityLabel = `${city} (${position.lat.toFixed(4)},${position.lng.toFixed(4)})`;
      }
    } catch (e) {
      console.warn("Reverse geocoding failed, using raw coords");
    }

    // Pass structured payload with both label and exact coords
    onLocationSelected({
      label: cityLabel,
      lat: position.lat,
      lng: position.lng,
    });
    setLoading(false);
    onClose();
  };

  const handleMapClick = (latlng) => {
    setPosition(latlng);
    setPlaceName(null); // Clear stale name on new click
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col h-[70vh]">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-sky-50">
          <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
            <MapPin className="text-sky-600 w-5 h-5" /> Drop a Pin for Exact Accuracy
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:bg-gray-200 p-2 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Map */}
        <div className="flex-1 w-full bg-gray-100 relative z-0">
          <MapContainer
            center={[22.5937, 78.9629]}
            zoom={4.5}
            style={{ height: "100%", width: "100%", zIndex: 0 }}
          >
            <TileLayer
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker
              position={position}
              setPosition={handleMapClick}
            />
          </MapContainer>

          {!position && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-white/90 backdrop-blur px-5 py-2.5 rounded-full shadow-md text-sm font-medium text-gray-800 pointer-events-none border border-gray-100">
              Tap anywhere on the map to set location
            </div>
          )}

          {position && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] bg-sky-600 text-white px-4 py-1.5 rounded-full shadow-lg text-xs font-semibold pointer-events-none flex items-center gap-1.5">
              <Navigation className="w-3 h-3" />
              {position.lat.toFixed(5)}°N, {position.lng.toFixed(5)}°E
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-white flex justify-between items-center gap-4">
          <p className="text-sm font-medium text-gray-600 truncate">
            {position
              ? `📍 Lat: ${position.lat.toFixed(4)}, Lng: ${position.lng.toFixed(4)}`
              : "Waiting for selection..."}
          </p>
          <button
            onClick={handleConfirm}
            disabled={!position || loading}
            className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all disabled:opacity-50 flex items-center gap-2 shadow-sm shrink-0"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <><Check className="w-4 h-4" /> Confirm Location</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapLocationPicker;
