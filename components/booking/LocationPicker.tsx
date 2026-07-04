"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Navigation, Search, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";


// Fix default Leaflet icon paths for Next.js / Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface LocationPickerProps {
  onLocationSelected: (data: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    latitude: number;
    longitude: number;
  }) => void;
  initialCoords?: { lat: number; lng: number } | null;
}

// Map helper to center on coordinate changes
function ChangeMapView({ coords }: { coords: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(coords, 16);
  }, [coords, map]);
  return null;
}

export default function LocationPicker({ onLocationSelected, initialCoords }: LocationPickerProps) {
  const { toast } = useToast();
  const defaultCenter: [number, number] = [12.9716, 77.5946]; // Bangalore center
  const [position, setPosition] = useState<[number, number]>(
    initialCoords ? [initialCoords.lat, initialCoords.lng] : defaultCenter
  );

  
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Resolved address states
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  const markerRef = useRef<L.Marker>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Reverse Geocoding via local server proxy
  async function reverseGeocode(lat: number, lng: number) {
    setGeocoding(true);
    try {
      const response = await fetch(
        `/api/geocode?action=reverse&lat=${lat}&lng=${lng}`
      );
      if (!response.ok) throw new Error("Reverse geocoding failed");
      const data = await response.json();
      
      const addrDetails = data.address || {};
      const fullAddr = data.display_name || "";
      const cityVal = addrDetails.city || addrDetails.town || addrDetails.village || addrDetails.county || "";
      const stateVal = addrDetails.state || "";
      const postCode = addrDetails.postcode || "";

      setAddress(fullAddr);
      setCity(cityVal);
      setState(stateVal);
      setPincode(postCode);
    } catch (err) {
      console.error("Reverse geocoding error:", err);
    } finally {
      setGeocoding(false);
    }
  }

  // Handle Autocomplete Search with Debouncing
  async function handleSearch(query: string) {
    setSearchQuery(query);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    setSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/geocode?action=search&q=${encodeURIComponent(query)}`
        );
        if (!response.ok) throw new Error("Search geocoding failed");
        const data = await response.json();
        setSuggestions(data);
        setShowSuggestions(true);
      } catch (err) {
        console.error("Autocomplete search error:", err);
      } finally {
        setSearching(false);
      }
    }, 500);
  }

  // Initialize reverse geocode on load if initial coords exist
  useEffect(() => {
    if (initialCoords) {
      setPosition([initialCoords.lat, initialCoords.lng]);
      reverseGeocode(initialCoords.lat, initialCoords.lng);
    } else {
      reverseGeocode(defaultCenter[0], defaultCenter[1]);
    }
  }, [initialCoords]);

  // Use Current Location (Browser Geolocation API)
  function handleUseCurrentLocation() {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation Unsupported",
        description: "Geolocation is not supported by your browser.",
        variant: "destructive",
      });
      return;
    }
    setGeocoding(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
        reverseGeocode(latitude, longitude);
      },
      (err) => {
        console.error("Geolocation error:", err);
        toast({
          title: "Location Access Failed",
          description: "Failed to fetch location. Please check browser GPS permissions.",
          variant: "destructive",
        });
        setGeocoding(false);
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }


  // Handle Drag End on Leaflet Marker
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const latLng = marker.getLatLng();
          setPosition([latLng.lat, latLng.lng]);
          reverseGeocode(latLng.lat, latLng.lng);
        }
      },
    }),
    []
  );

  // Trigger when a search suggestion is chosen
  function handleSelectSuggestion(suggestion: any) {
    const lat = parseFloat(suggestion.lat);
    const lon = parseFloat(suggestion.lon);
    setPosition([lat, lon]);
    setShowSuggestions(false);
    setSearchQuery(suggestion.display_name);

    const addrDetails = suggestion.address || {};
    setAddress(suggestion.display_name);
    setCity(addrDetails.city || addrDetails.town || addrDetails.village || addrDetails.county || "");
    setState(addrDetails.state || "");
    setPincode(addrDetails.postcode || "");
  }

  // Confirm selection to parent component
  function handleConfirm() {
    onLocationSelected({
      address,
      city,
      state,
      pincode,
      latitude: position[0],
      longitude: position[1],
    });
  }

  return (
    <div className="flex flex-col gap-4 w-full text-slate-900">
      {/* Search Input Box */}
      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search area, landmark, or building name..."
              className="h-10 w-full rounded-md border border-slate-300 pl-9 pr-4 text-sm bg-white"
              onFocus={() => setShowSuggestions(suggestions.length > 0)}
            />
            {searching && <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-slate-400" />}
          </div>
          <Button type="button" onClick={handleUseCurrentLocation} variant="outline" className="flex gap-2 border-emerald-200 hover:bg-emerald-50 text-emerald-700">
            <Navigation className="h-4 w-4" /> Current Location
          </Button>
        </div>

        {/* Suggestion Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-[1000] left-0 right-0 mt-1 max-h-60 overflow-y-auto rounded-md border border-slate-200 bg-white shadow-lg text-sm">
            {suggestions.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSuggestion(item)}
                className="w-full px-4 py-2.5 text-left hover:bg-slate-50 border-b border-slate-100 flex items-start gap-2"
              >
                <MapPin className="h-4 w-4 mt-0.5 text-slate-400 shrink-0" />
                <span>{item.display_name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map Picker Area */}
      <div className="relative h-[300px] w-full rounded-lg overflow-hidden border border-slate-200 shadow-inner z-10">
        <MapContainer center={position} zoom={16} style={{ height: "100%", width: "100%" }} zoomControl={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          <Marker position={position} draggable={true} eventHandlers={eventHandlers} ref={markerRef} />
          <ChangeMapView coords={position} />
        </MapContainer>
      </div>

      {/* Geocoding Info Display Card */}
      <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 space-y-3">
        <div className="flex items-start gap-2.5">
          <MapPin className="h-5 w-5 text-indigo-600 mt-0.5 shrink-0" />
          <div className="flex-1">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Confirm Address Pin</h4>
            {geocoding ? (
              <div className="flex items-center gap-2 text-slate-500 mt-1.5 text-sm">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Fetching address details...</span>
              </div>
            ) : (
              <p className="mt-1 text-sm font-medium text-slate-700 leading-relaxed">
                {address || "Pin not resolved. Drag pin or search above."}
              </p>
            )}
          </div>
        </div>

        {!geocoding && address && (
          <div className="grid grid-cols-2 gap-3 text-xs border-t border-slate-200/60 pt-3 text-slate-500">
            <div><strong className="text-slate-700">City:</strong> {city || "—"}</div>
            <div><strong className="text-slate-700">State:</strong> {state || "—"}</div>
            <div><strong className="text-slate-700">Pincode:</strong> {pincode || "—"}</div>
            <div><strong className="text-slate-700">Coords:</strong> {position[0].toFixed(5)}, {position[1].toFixed(5)}</div>
          </div>
        )}
      </div>

      {/* Confirm Action Button */}
      <Button
        type="button"
        disabled={geocoding || !address}
        onClick={handleConfirm}
        className="w-full bg-indigo-600 text-white hover:bg-indigo-700 flex gap-2 h-11 text-base font-semibold"
      >
        <Check className="h-5 w-5" /> Confirm Location
      </Button>
    </div>
  );
}
