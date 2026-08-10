"use client";

import { useEffect, useRef } from "react";
import type L from "leaflet";

interface SignupMapProps {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
}

export function SignupMap({ lat, lng, onChange }: SignupMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const isMountedRef = useRef<boolean>(true);
  const latLngRef = useRef<{ lat: number; lng: number }>({ lat, lng });

  // Keep track of coordinates to avoid stale closures in async leaflet initialization
  useEffect(() => {
    latLngRef.current = { lat, lng };
  }, [lat, lng]);

  useEffect(() => {
    isMountedRef.current = true;

    if (typeof window === "undefined" || !mapRef.current) return;
    if (mapInstanceRef.current) return; // Already initialized

    // Dynamically import leaflet to avoid SSR issues
    import("leaflet").then((L) => {
      if (!isMountedRef.current) return;

      // Before calling L.map(), check whether the map container already has an initialized Leaflet instance
      const container = mapRef.current;
      if (!container) return;

      if ((container as any)._leaflet_map) {
        mapInstanceRef.current = (container as any)._leaflet_map;
        return;
      }

      // If the container has a leaflet ID but no active map instance reference, clean it up to re-initialize safely
      if ((container as any)._leaflet_id) {
        (container as any)._leaflet_id = null;
        container.innerHTML = "";
        container.className = container.className.replace(/\bleaflet-container\b/g, "");
      }

      // Fix default icon paths broken by webpack
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const currentLat = latLngRef.current.lat;
      const currentLng = latLngRef.current.lng;

      const map = L.map(container, {
        center: [currentLat, currentLng],
        zoom: 15,
        zoomControl: true,
        scrollWheelZoom: false,
      });

      // Attach map instance to DOM container for robust tracking/re-use
      (container as any)._leaflet_map = map;
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      const marker = L.marker([currentLat, currentLng], { draggable: true }).addTo(map);
      markerRef.current = marker;

      marker.on("dragend", (e: any) => {
        const pos = marker.getLatLng();
        onChange(pos.lat, pos.lng);
      });

      map.on("click", (e: any) => {
        marker.setLatLng(e.latlng);
        onChange(e.latlng.lat, e.latlng.lng);
      });
    });

    return () => {
      isMountedRef.current = false;

      if (markerRef.current) {
        markerRef.current.off("dragend");
        markerRef.current.remove();
        markerRef.current = null;
      }

      if (mapInstanceRef.current) {
        mapInstanceRef.current.off("click");
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      if (mapRef.current) {
        delete (mapRef.current as any)._leaflet_map;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update marker position when lat/lng props change
  useEffect(() => {
    if (!mapInstanceRef.current || !markerRef.current) return;
    const newLatLng = [lat, lng] as [number, number];
    markerRef.current.setLatLng(newLatLng);
    mapInstanceRef.current.setView(newLatLng, 15, { animate: true });
  }, [lat, lng]);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />
      <div
        ref={mapRef}
        className="h-52 w-full rounded-xl overflow-hidden border border-slate-200 z-0"
        style={{ zIndex: 0 }}
      />
    </>
  );
}
