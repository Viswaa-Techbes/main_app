"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default leaflet icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom Icons for Client and Technician
const clientIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const technicianIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function RecenterMap({ clientCoords, technicianCoords }: { clientCoords: [number, number]; technicianCoords?: [number, number] | null }) {
  const map = useMap();

  useEffect(() => {
    if (clientCoords) {
      if (technicianCoords) {
        // Fit both positions in view
        const bounds = L.latLngBounds([clientCoords, technicianCoords]);
        map.fitBounds(bounds, { padding: [50, 50] });
      } else {
        map.setView(clientCoords, 15);
      }
    }
  }, [clientCoords, technicianCoords, map]);

  return null;
}

interface TrackingMapProps {
  clientLat: number;
  clientLng: number;
  techLat?: number | null;
  techLng?: number | null;
}

export default function TrackingMap({ clientLat, clientLng, techLat, techLng }: TrackingMapProps) {
  const clientCoords: [number, number] = [clientLat || 12.9716, clientLng || 77.5946];
  const techCoords: [number, number] | null = techLat && techLng ? [techLat, techLng] : null;

  return (
    <MapContainer center={clientCoords} zoom={14} className="h-full w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={clientCoords} icon={clientIcon}>
        <Popup>Your Service Location</Popup>
      </Marker>
      {techCoords && (
        <Marker position={techCoords} icon={technicianIcon}>
          <Popup>Technician Live Position</Popup>
        </Marker>
      )}
      <RecenterMap clientCoords={clientCoords} technicianCoords={techCoords} />
    </MapContainer>
  );
}
