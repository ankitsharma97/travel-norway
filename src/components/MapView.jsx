// src/components/MapView.jsx
import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "@changey/react-leaflet-markercluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-fullscreen/dist/leaflet.fullscreen.css";
import "leaflet-fullscreen";

// Icons for activity types
const activityIcons = {
  camera: "📷",
  food: "🍽️",
  hotel: "🏨",
  hike: "🥾",
  tent: "⛺",
  view: "🏔️",
};

// Marker icon generator
const createIcon = (emoji) =>
  new L.DivIcon({
    html: `<div style="font-size: 24px;">${emoji}</div>`,
    className: "",
    iconSize: [30, 42],
    iconAnchor: [15, 42],
  });

// Marker data
const markerData = [
  { id: 1, position: [60.39299, 5.32415], type: "camera", title: "Bergen Viewpoint" },
  { id: 2, position: [59.9139, 10.7522], type: "food", title: "Oslo Street Food" },
  { id: 3, position: [68.4392, 17.4275], type: "hike", title: "Tromsø Hike Trail" },
  { id: 4, position: [61.1234, 7.1234], type: "hotel", title: "Fjordside Lodge" },
  { id: 5, position: [62.1234, 8.1234], type: "tent", title: "Camping Spot in Geiranger" },
  { id: 6, position: [69.6496, 18.956], type: "view", title: "Northern Lights Viewpoint" },
];

// Fullscreen control component
const FullscreenControl = () => {
  const map = useMap();

  useEffect(() => {
    const fullscreenControl = L.control.fullscreen({
      position: "topright",
      title: "Show Fullscreen",
      titleCancel: "Exit Fullscreen",
      forceSeparateButton: true,
    });
    fullscreenControl.addTo(map);
  }, [map]);

  return null;
};

const MapView = () => {
  return (
    <div className="h-[65vh] w-full  overflow-hidden  relative z-0">
      <MapContainer
        center={[65.0, 15.0]}
        zoom={5}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {/* Enable Fullscreen */}
        <FullscreenControl />

        <MarkerClusterGroup chunkedLoading>
          {markerData.map(({ id, position, type, title }) => (
            <Marker key={id} position={position} icon={createIcon(activityIcons[type])}>
              <Popup>{title}</Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
};

export default MapView;
