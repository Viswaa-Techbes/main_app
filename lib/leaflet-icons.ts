import L from "leaflet";

/**
 * Configure default Leaflet marker icons using local assets served from /images/leaflet/
 * with fallback to standard CDN if needed.
 */
export function setupLeafletIcons() {
  if (typeof window === "undefined") return;

  delete (L.Icon.Default.prototype as any)._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "/images/leaflet/marker-icon-2x.png",
    iconUrl: "/images/leaflet/marker-icon.png",
    shadowUrl: "/images/leaflet/marker-shadow.png",
  });
}

export function createCustomMarkerIcon(color: "blue" | "red" | "green" = "blue") {
  return new L.Icon({
    iconUrl: `/images/leaflet/marker-icon.png`,
    iconRetinaUrl: `/images/leaflet/marker-icon-2x.png`,
    shadowUrl: `/images/leaflet/marker-shadow.png`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
}
