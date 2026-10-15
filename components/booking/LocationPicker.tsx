"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapPin,
  Navigation,
  Search,
  Loader2,
  Home,
  Briefcase,
  MoreHorizontal,
  Landmark,
  Check,
  AlertCircle,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { setupLeafletIcons } from "@/lib/leaflet-icons";

// Initialize Leaflet icons using local assets
setupLeafletIcons();

export interface LocationAddressData {
  addressType?: string;
  label?: string;
  address?: string;
  fullAddress?: string;
  area?: string;
  landmark?: string;
  city?: string;
  state?: string;
  pincode?: string;
  latitude?: number | null;
  longitude?: number | null;
  additionalInstructions?: string;
  manualNotes?: string;
  deliveryInstructions?: string;
  formattedAddress?: string;
  houseNumber?: string;
  street?: string;
  floor?: string;
  apartmentName?: string;
  district?: string;
  country?: string;
}

interface LocationPickerProps {
  onLocationSelected: (data: {
    address: string;
    fullAddress: string;
    area: string;
    landmark: string;
    city: string;
    state: string;
    pincode: string;
    latitude: number;
    longitude: number;
    addressType: string;
    label: string;
    additionalInstructions: string;
    manualNotes: string;
    formattedAddress: string;
    houseNumber: string;
    street: string;
    floor: string;
    apartmentName: string;
    district: string;
    country: string;
    deliveryInstructions: string;
  }) => void;
  initialCoords?: { lat: number; lng: number } | null;
  initialAddressData?: LocationAddressData | null;
  showFormFields?: boolean;
}

// Controller to handle view updates, map clicks, and container resizing
function MapController({
  coords,
  onMapClick,
}: {
  coords: [number, number];
  onMapClick: (lat: number, lng: number) => void;
}) {
  const map = useMap();

  useEffect(() => {
    // Invalidate size on mount and after delay to ensure map renders smoothly in modals/tabs
    map.invalidateSize();
    const t1 = setTimeout(() => map.invalidateSize(), 150);
    const t2 = setTimeout(() => map.invalidateSize(), 400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [map]);

  useEffect(() => {
    if (coords && coords[0] && coords[1]) {
      map.setView(coords, Math.max(map.getZoom(), 15), { animate: true });
    }
  }, [coords, map]);

  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });

  return null;
}

export default function LocationPicker({
  onLocationSelected,
  initialCoords,
  initialAddressData,
  showFormFields = true,
}: LocationPickerProps) {
  const { toast } = useToast();
  const defaultCenter: [number, number] = [12.9716, 77.5946]; // Bangalore center

  const [position, setPosition] = useState<[number, number]>(() => {
    if (initialCoords && initialCoords.lat && initialCoords.lng) {
      return [parseFloat(initialCoords.lat as any), parseFloat(initialCoords.lng as any)];
    }
    return defaultCenter;
  });

  // Search & Geocoding States
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [tileError, setTileError] = useState(false);

  // Simplified Clean Form States
  const [addressType, setAddressType] = useState<string>(() => {
    const raw = initialAddressData?.addressType || initialAddressData?.label || "Home";
    const cap = raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
    return ["Home", "Office", "Other"].includes(cap) ? cap : "Home";
  });

  const [fullAddress, setFullAddress] = useState<string>(() => {
    return (
      initialAddressData?.fullAddress ||
      initialAddressData?.address ||
      initialAddressData?.formattedAddress ||
      ""
    );
  });

  const [area, setArea] = useState<string>(() => initialAddressData?.area || "");
  const [landmark, setLandmark] = useState<string>(() => initialAddressData?.landmark || "");
  const [city, setCity] = useState<string>(() => initialAddressData?.city || "Bangalore");
  const [state, setState] = useState<string>(() => initialAddressData?.state || "Karnataka");
  const [pincode, setPincode] = useState<string>(() => initialAddressData?.pincode || "");
  const [additionalInstructions, setAdditionalInstructions] = useState<string>(() => {
    return (
      initialAddressData?.additionalInstructions ||
      initialAddressData?.manualNotes ||
      initialAddressData?.deliveryInstructions ||
      ""
    );
  });

  const markerRef = useRef<any>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clean search timeout
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, []);

  // Sync position if initialCoords changes
  useEffect(() => {
    if (initialCoords && initialCoords.lat && initialCoords.lng) {
      setPosition([parseFloat(initialCoords.lat as any), parseFloat(initialCoords.lng as any)]);
    }
  }, [initialCoords?.lat, initialCoords?.lng]);

  // Reverse Geocoding with reliable local proxy
  const reverseGeocode = useCallback(
    async (lat: number, lng: number) => {
      setGeocoding(true);
      try {
        const response = await fetch(`/api/geocode?action=reverse&lat=${lat}&lng=${lng}`);
        if (!response.ok) throw new Error("Reverse geocoding failed");
        const data = await response.json();

        const addrDetails = data.address || {};
        const road = addrDetails.road || addrDetails.pedestrian || addrDetails.street || "";
        const houseNo = addrDetails.house_number || addrDetails.building || "";
        const detectedArea =
          addrDetails.suburb ||
          addrDetails.neighbourhood ||
          addrDetails.residential ||
          addrDetails.subdistrict ||
          "";
        const detectedCity =
          addrDetails.city ||
          addrDetails.town ||
          addrDetails.village ||
          addrDetails.county ||
          "Bangalore";
        const detectedState = addrDetails.state || "Karnataka";
        const detectedPostcode = addrDetails.postcode || "";
        const detectedLandmark =
          addrDetails.amenity ||
          addrDetails.shop ||
          addrDetails.tourism ||
          addrDetails.historic ||
          "";

        // Build a readable full address from detected components
        const streetLine = [houseNo, road].filter(Boolean).join(", ");
        const suggestedFull =
          streetLine ||
          (data.display_name ? data.display_name.split(",").slice(0, 3).join(",").trim() : "");

        setFullAddress((prev) => (prev.trim() ? prev : suggestedFull || data.display_name || ""));
        if (detectedArea) setArea((prev) => (prev.trim() ? prev : detectedArea));
        if (detectedCity) setCity(detectedCity);
        if (detectedState) setState(detectedState);
        if (detectedPostcode) setPincode((prev) => (prev.trim() ? prev : detectedPostcode));
        if (detectedLandmark) setLandmark((prev) => (prev.trim() ? prev : detectedLandmark));
      } catch (err) {
        console.warn("Reverse geocode warning:", err);
      } finally {
        setGeocoding(false);
      }
    },
    []
  );

  // Propagate to parent component whenever coordinates or clean form fields change
  useEffect(() => {
    const compiledFormatted = [
      fullAddress.trim(),
      area.trim(),
      landmark.trim() ? `Near ${landmark.trim()}` : "",
      `${city.trim() || "Bangalore"}${pincode.trim() ? ` - ${pincode.trim()}` : ""}`,
      state.trim() || "Karnataka",
    ]
      .filter(Boolean)
      .join(", ");

    onLocationSelected({
      address: fullAddress.trim() || compiledFormatted,
      fullAddress: fullAddress.trim(),
      area: area.trim(),
      landmark: landmark.trim(),
      city: city.trim() || "Bangalore",
      state: state.trim() || "Karnataka",
      pincode: pincode.trim(),
      latitude: position[0],
      longitude: position[1],
      addressType,
      label: addressType,
      additionalInstructions: additionalInstructions.trim(),
      manualNotes: additionalInstructions.trim(),
      formattedAddress: compiledFormatted,
      // Backward compatibility fields
      houseNumber: "",
      street: area.trim(),
      floor: "",
      apartmentName: "",
      district: city.trim() || "Bangalore",
      country: "India",
      deliveryInstructions: additionalInstructions.trim(),
    });
  }, [
    position,
    addressType,
    fullAddress,
    area,
    landmark,
    city,
    state,
    pincode,
    additionalInstructions,
    onLocationSelected,
  ]);

  // Handle address search with debouncing
  function handleSearch(val: string) {
    setSearchQuery(val);
    if (!val || val.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    searchTimeoutRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const response = await fetch(`/api/geocode?action=search&q=${encodeURIComponent(val)}`);
        if (!response.ok) throw new Error("Search geocoding failed");
        const data = await response.json();
        setSuggestions(Array.isArray(data) ? data : []);
        setShowSuggestions(true);
      } catch (err) {
        console.warn("Location search error:", err);
        setSuggestions([]);
      } finally {
        setSearching(false);
      }
    }, 400);
  }

  // Handle selection of suggestion
  function handleSelectSuggestion(suggestion: any) {
    const lat = parseFloat(suggestion.lat);
    const lon = parseFloat(suggestion.lon);
    if (!isNaN(lat) && !isNaN(lon)) {
      setPosition([lat, lon]);
      setShowSuggestions(false);
      setSearchQuery(suggestion.display_name || "");

      const addr = suggestion.address || {};
      const road = addr.road || addr.pedestrian || addr.street || "";
      const houseNo = addr.house_number || addr.building || "";
      const detectedArea =
        addr.suburb || addr.neighbourhood || addr.residential || addr.subdistrict || "";
      const detectedCity = addr.city || addr.town || addr.village || addr.county || "Bangalore";
      const detectedState = addr.state || "Karnataka";
      const detectedPostcode = addr.postcode || "";

      const primaryLine = [houseNo, road].filter(Boolean).join(", ");
      setFullAddress(primaryLine || suggestion.display_name || "");
      if (detectedArea) setArea(detectedArea);
      if (detectedCity) setCity(detectedCity);
      if (detectedState) setState(detectedState);
      if (detectedPostcode) setPincode(detectedPostcode);
    }
  }

  // Handle map click
  function handleMapClick(lat: number, lng: number) {
    setPosition([lat, lng]);
    reverseGeocode(lat, lng);
  }

  // Handle marker drag
  const markerEventHandlers = useMemo(
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
    [reverseGeocode]
  );

  // Handle Use Current Location with robust permission and error handling
  function handleUseCurrentLocation() {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation Unsupported",
        description: "Your browser does not support GPS location services.",
        variant: "destructive",
      });
      return;
    }

    setGeocoding(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setPosition([lat, lng]);
        reverseGeocode(lat, lng);
        toast({
          title: "Location Detected",
          description: "Pinned to your current GPS position.",
        });
      },
      (err) => {
        setGeocoding(false);
        let msg = "Could not fetch your location. Please check browser GPS permissions.";
        if (err.code === 1) {
          msg = "Location permission denied. Please allow location access or select on map.";
        } else if (err.code === 2) {
          msg = "Position unavailable. Please search for your area or drag the map pin.";
        } else if (err.code === 3) {
          msg = "Location request timed out. Please try again or search your area.";
        }
        toast({
          title: "GPS Location Notice",
          description: msg,
          variant: "destructive",
        });
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 }
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full text-slate-900">
      {/* ── MAP LOCATION SECTION ── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
            <MapPin className="h-3.5 w-3.5 text-blue-600" />
            Select Location on Map <span className="text-rose-500">*</span>
          </label>
          <span className="text-[11px] text-slate-500 font-medium">Click or drag pin to position</span>
        </div>

        {/* Search & Current Location Controls */}
        <div className="relative">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search area, landmark, or street in Bangalore..."
                className="h-10 w-full rounded-xl border border-slate-300 pl-9 pr-8 text-xs bg-white text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                onFocus={() => setShowSuggestions(suggestions.length > 0)}
              />
              {searching && (
                <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-slate-400" />
              )}
            </div>
            <Button
              type="button"
              onClick={handleUseCurrentLocation}
              variant="outline"
              className="flex items-center gap-1.5 border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/60 text-emerald-800 font-bold rounded-xl h-10 px-3.5 text-xs shrink-0"
            >
              <Navigation className="h-3.5 w-3.5" />
              <span>Current Location</span>
            </Button>
          </div>

          {/* Autocomplete Suggestion Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-[1000] left-0 right-0 mt-1 max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl text-xs">
              {suggestions.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSuggestion(item)}
                  className="w-full px-4 py-2.5 text-left hover:bg-slate-50 border-b border-slate-100 flex items-start gap-2.5 text-slate-700 font-medium transition"
                >
                  <MapPin className="h-4 w-4 mt-0.5 text-blue-600 shrink-0" />
                  <span className="line-clamp-2">{item.display_name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Leaflet Map Canvas */}
        <div className="relative h-[240px] sm:h-[280px] w-full rounded-2xl overflow-hidden border border-slate-200 shadow-xs z-10 bg-slate-100">
          <MapContainer
            center={position}
            zoom={15}
            style={{ height: "100%", width: "100%" }}
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              eventHandlers={{
                tileerror: () => setTileError(true),
              }}
            />
            <Marker
              position={position}
              draggable={true}
              eventHandlers={markerEventHandlers}
              ref={markerRef}
            />
            <MapController coords={position} onMapClick={handleMapClick} />
          </MapContainer>

          {/* Geocoding indicator overlay */}
          {geocoding && (
            <div className="absolute top-3 right-3 z-[1000] bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-full shadow-md border border-slate-200 flex items-center gap-2 text-[11px] font-bold text-slate-700">
              <Loader2 className="h-3 w-3 animate-spin text-blue-600" />
              <span>Detecting address...</span>
            </div>
          )}

          {/* Fallback alert if tiles fail */}
          {tileError && (
            <div className="absolute bottom-2 left-2 right-2 z-[1000] bg-amber-50/90 border border-amber-200 px-3 py-1.5 rounded-xl text-[11px] font-medium text-amber-800 flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5 shrink-0 text-amber-600" />
              <span>OpenStreetMap tiles loading slowly or offline. Pinned coordinates are recorded accurately.</span>
            </div>
          )}
        </div>
      </div>

      {/* ── SIMPLIFIED ADDRESS FORM ── */}
      {showFormFields && (
        <div className="bg-slate-50/80 rounded-2xl border border-slate-200/80 p-4 sm:p-5 space-y-4">
          {/* Address Type Selector */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-2">
              Address Type <span className="text-rose-500">*</span>
            </label>
            <div className="flex gap-2">
              {[
                { type: "Home", icon: Home },
                { type: "Office", icon: Briefcase },
                { type: "Other", icon: MoreHorizontal },
              ].map(({ type, icon: Icon }) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setAddressType(type)}
                  className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition ${
                    addressType === type
                      ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{type}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Full Address (Multiline) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                Full Address <span className="text-rose-500">*</span>
              </label>
              <span className="text-[10px] text-slate-400">Flat / House / Building, Street / Road</span>
            </div>
            <textarea
              rows={2}
              required
              value={fullAddress}
              onChange={(e) => setFullAddress(e.target.value)}
              placeholder="e.g. Flat 302, Green Glen Apartments, 1st Cross, Outer Ring Road"
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none shadow-2xs"
            />
          </div>

          {/* Area / Locality & Landmark */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                Area / Locality <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="e.g. HSR Layout Sector 2, Indiranagar"
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                Landmark <span className="text-slate-400 text-[10px] font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="e.g. Near BDA Complex / Opp. Axis Bank"
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* City, State, Pincode */}
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                City <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Bangalore"
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                State <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="Karnataka"
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                Pincode <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                placeholder="560102"
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Additional Instructions (Optional) */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
              Additional Instructions <span className="text-slate-400 text-[10px] font-normal">(Optional)</span>
            </label>
            <textarea
              rows={2}
              value={additionalInstructions}
              onChange={(e) => setAdditionalInstructions(e.target.value)}
              placeholder="e.g. Call upon arrival; gate code #4412; enter through South Wing"
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none shadow-2xs"
            />
          </div>
        </div>
      )}
    </div>
  );
}
