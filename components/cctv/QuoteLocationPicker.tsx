"use client";

import React, { useState, useEffect, useRef } from "react";
import { MapPin, Navigation, Search, Loader2, Home, Landmark, Compass, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface QuoteLocationPickerProps {
  onLocationSelected: (data: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    latitude: number;
    longitude: number;
    houseNumber: string;
    street: string;
    area: string;
    landmark: string;
    district: string;
    country: string;
    floor: string;
    apartmentName: string;
    deliveryInstructions: string;
    formattedAddress: string;
  }) => void;
  initialCoords?: { lat: number; lng: number } | null;
  initialAddressData?: {
    houseNumber?: string;
    street?: string;
    area?: string;
    landmark?: string;
    city?: string;
    district?: string;
    state?: string;
    pincode?: string;
    country?: string;
    floor?: string;
    apartmentName?: string;
    deliveryInstructions?: string;
    formattedAddress?: string;
  } | null;
}

export default function QuoteLocationPicker({
  onLocationSelected,
  initialCoords,
  initialAddressData,
}: QuoteLocationPickerProps) {
  const { toast } = useToast();
  const defaultCenter: [number, number] = [12.9716, 77.5946]; // Bangalore center

  const [position, setPosition] = useState<[number, number]>(
    initialCoords && initialCoords.lat && initialCoords.lng
      ? [parseFloat(initialCoords.lat as any), parseFloat(initialCoords.lng as any)]
      : defaultCenter
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Address details state
  const [address, setAddress] = useState(initialAddressData?.formattedAddress || "");
  const [city, setCity] = useState(initialAddressData?.city || "");
  const [state, setState] = useState(initialAddressData?.state || "");
  const [pincode, setPincode] = useState(initialAddressData?.pincode || "");
  
  const [houseNumber, setHouseNumber] = useState(initialAddressData?.houseNumber || "");
  const [street, setStreet] = useState(initialAddressData?.street || "");
  const [area, setArea] = useState(initialAddressData?.area || "");
  const [landmark, setLandmark] = useState(initialAddressData?.landmark || "");
  const [district, setDistrict] = useState(initialAddressData?.district || "");
  const [country, setCountry] = useState(initialAddressData?.country || "");
  
  const [floor, setFloor] = useState(initialAddressData?.floor || "");
  const [apartmentName, setApartmentName] = useState(initialAddressData?.apartmentName || "");
  const [deliveryInstructions, setDeliveryInstructions] = useState(initialAddressData?.deliveryInstructions || "");

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up search timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Safe Leaflet Initialization
  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current) return;

    let active = true;
    let mapInstance: any = null;
    let markerInstance: any = null;

    // Dynamically load leaflet on client-side
    import("leaflet").then((L: any) => {
      if (!active || !mapContainerRef.current) return;

      // Fix default Leaflet icon paths
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      // Avoid double initialization
      const container = mapContainerRef.current;
      if ((container as any)._leaflet_id) {
        return;
      }

      // Initialize map
      mapInstance = L.map(container, {
        center: position,
        zoom: 15,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstance);

      // Create draggable marker
      markerInstance = L.marker(position, { draggable: true }).addTo(mapInstance);

      markerInstance.on("dragend", () => {
        const latLng = markerInstance.getLatLng();
        const newPos: [number, number] = [latLng.lat, latLng.lng];
        setPosition(newPos);
        reverseGeocode(latLng.lat, latLng.lng);
      });

      mapRef.current = mapInstance;
      markerRef.current = markerInstance;
    });

    return () => {
      active = false;
      if (mapInstance) {
        mapInstance.remove();
      }
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  // Update map view and marker when state coordinates change
  useEffect(() => {
    if (mapRef.current && markerRef.current) {
      mapRef.current.setView(position, 16);
      markerRef.current.setLatLng(position);
    }
  }, [position]);

  // Reverse Geocoding via the local geocode proxy endpoint
  async function reverseGeocode(lat: number, lng: number) {
    setGeocoding(true);
    try {
      const response = await fetch(`/api/geocode?action=reverse&lat=${lat}&lng=${lng}`);
      if (!response.ok) throw new Error("Reverse geocoding failed");
      const data = await response.json();
      
      const addrDetails = data.address || {};
      const fullAddr = data.display_name || "";
      
      const houseNum = addrDetails.house_number || addrDetails.building || "";
      const streetVal = addrDetails.road || "";
      const areaVal = addrDetails.suburb || addrDetails.neighbourhood || addrDetails.residential || "";
      const landmarkVal = addrDetails.amenity || addrDetails.shop || addrDetails.tourism || addrDetails.historic || "";
      const cityVal = addrDetails.city || addrDetails.town || addrDetails.village || addrDetails.county || "";
      const districtVal = addrDetails.district || addrDetails.county || "";
      const stateVal = addrDetails.state || "";
      const postCode = addrDetails.postcode || "";
      const countryVal = addrDetails.country || "";

      setAddress(fullAddr);
      setCity(cityVal);
      setState(stateVal);
      setPincode(postCode);

      setHouseNumber(houseNum);
      setStreet(streetVal);
      setArea(areaVal);
      setLandmark(landmarkVal);
      setDistrict(districtVal);
      setCountry(countryVal);
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
        const response = await fetch(`/api/geocode?action=search&q=${encodeURIComponent(query)}`);
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

  function handleSelectSuggestion(suggestion: any) {
    const lat = parseFloat(suggestion.lat);
    const lon = parseFloat(suggestion.lon);
    setPosition([lat, lon]);
    setShowSuggestions(false);
    setSearchQuery(suggestion.display_name);

    const addrDetails = suggestion.address || {};
    setAddress(suggestion.display_name);
    
    const houseNum = addrDetails.house_number || addrDetails.building || "";
    const streetVal = addrDetails.road || "";
    const areaVal = addrDetails.suburb || addrDetails.neighbourhood || addrDetails.residential || "";
    const landmarkVal = addrDetails.amenity || addrDetails.shop || addrDetails.tourism || addrDetails.historic || "";
    const cityVal = addrDetails.city || addrDetails.town || addrDetails.village || addrDetails.county || "";
    const districtVal = addrDetails.district || addrDetails.county || "";
    const stateVal = addrDetails.state || "";
    const postCode = addrDetails.postcode || "";
    const countryVal = addrDetails.country || "";

    setCity(cityVal);
    setState(stateVal);
    setPincode(postCode);

    setHouseNumber(houseNum);
    setStreet(streetVal);
    setArea(areaVal);
    setLandmark(landmarkVal);
    setDistrict(districtVal);
    setCountry(countryVal);
  }

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
          description: "Failed to fetch current location. Check GPS permissions.",
          variant: "destructive",
        });
        setGeocoding(false);
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }

  // Bubble details up to parent form component on change
  useEffect(() => {
    if (address && position[0] && position[1]) {
      const parts = [
        houseNumber,
        apartmentName ? `Apartment: ${apartmentName}` : "",
        floor ? `Floor: ${floor}` : "",
        street,
        area,
        landmark ? `Landmark: ${landmark}` : "",
        city,
        state,
        pincode,
        country
      ].filter(Boolean);

      const compiledAddress = parts.join(", ") || address;

      onLocationSelected({
        address: compiledAddress,
        city,
        state,
        pincode,
        latitude: position[0],
        longitude: position[1],
        houseNumber,
        street,
        area,
        landmark,
        district,
        country,
        floor,
        apartmentName,
        deliveryInstructions,
        formattedAddress: compiledAddress
      });
    }
  }, [
    position,
    address,
    houseNumber,
    street,
    area,
    landmark,
    city,
    state,
    pincode,
    country,
    floor,
    apartmentName,
    deliveryInstructions
  ]);

  // Initial geocoding lookups
  useEffect(() => {
    if (initialCoords && initialCoords.lat && initialCoords.lng) {
      const lat = parseFloat(initialCoords.lat as any);
      const lng = parseFloat(initialCoords.lng as any);
      if (!isNaN(lat) && !isNaN(lng)) {
        setPosition([lat, lng]);
        reverseGeocode(lat, lng);
        return;
      }
    }
    reverseGeocode(defaultCenter[0], defaultCenter[1]);
  }, []);

  return (
    <div className="flex flex-col gap-4 w-full text-slate-900">
      {/* Search Bar & Current Location Button */}
      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search area, landmark, or building name..."
              className="h-10 w-full rounded-xl border border-slate-300 pl-9 pr-4 text-sm bg-white text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              onFocus={() => setShowSuggestions(suggestions.length > 0)}
            />
            {searching && <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-slate-400" />}
          </div>
          <Button
            type="button"
            onClick={handleUseCurrentLocation}
            variant="outline"
            className="flex gap-2 border-emerald-200 hover:bg-emerald-50 text-emerald-700 font-bold rounded-xl h-10 px-4 whitespace-nowrap"
          >
            <Navigation className="h-4 w-4" /> Current Location
          </Button>
        </div>

        {/* Suggestion Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-[1000] left-0 right-0 mt-1 max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg text-sm">
            {suggestions.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSuggestion(item)}
                className="w-full px-4 py-2.5 text-left hover:bg-slate-50 border-b border-slate-100 flex items-start gap-2 text-slate-700 font-medium"
              >
                <MapPin className="h-4 w-4 mt-0.5 text-slate-400 shrink-0" />
                <span>{item.display_name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map Element Container */}
      <div 
        ref={mapContainerRef} 
        style={{ height: "280px" }}
        className="w-full rounded-2xl border border-slate-200 shadow-inner z-10" 
      />

      {/* Structured Address Entry Fields */}
      <div className="bg-slate-50/70 rounded-2xl border border-slate-200/60 p-4 space-y-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-blue-600" />
          <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Address Details</h4>
        </div>

        {geocoding ? (
          <div className="flex items-center gap-2 text-slate-500 py-3 text-xs font-bold">
            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            <span>Resolving coordinates...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {address && (
              <div className="text-xs font-semibold text-slate-600 bg-white border border-slate-100 rounded-xl p-3 leading-relaxed">
                <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider mb-1">Detected Address</span>
                {address}
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-[10px] font-bold text-slate-500 flex items-center gap-1.5 mb-1.5"><Home className="h-3 w-3" /> Flat / House / Office No.</label>
                <input
                  type="text"
                  placeholder="e.g. 549, 1st Floor"
                  value={houseNumber}
                  onChange={(e) => setHouseNumber(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 flex items-center gap-1.5 mb-1.5"><Landmark className="h-3 w-3" /> Building / Apartment Name</label>
                <input
                  type="text"
                  placeholder="e.g. EWS Colony Complex"
                  value={apartmentName}
                  onChange={(e) => setApartmentName(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 flex items-center gap-1.5 mb-1.5"><Compass className="h-3 w-3" /> Floor / Block</label>
                <input
                  type="text"
                  placeholder="e.g. 3rd Floor"
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 flex items-center gap-1.5 mb-1.5"><Landmark className="h-3 w-3" /> Landmark</label>
                <input
                  type="text"
                  placeholder="e.g. Near HDFC Bank ATM"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-[10px] font-bold text-slate-500 mb-1.5 block">Street / Road</label>
                <input
                  type="text"
                  placeholder="Street / Road"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 mb-1.5 block">Area / Locality *</label>
                <input
                  type="text"
                  placeholder="Area / Locality"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  required
                />
              </div>
            </div>

            <div className="grid gap-3 grid-cols-3">
              <div>
                <label className="text-[10px] font-bold text-slate-500 mb-1.5 block">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 mb-1.5 block">State</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 mb-1.5 block">Pincode</label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 flex items-center gap-1.5 mb-1.5"><HelpCircle className="h-3 w-3" /> Delivery / Service Instructions</label>
              <textarea
                placeholder="e.g. Please call before reaching; ring bell next door if not available"
                value={deliveryInstructions}
                onChange={(e) => setDeliveryInstructions(e.target.value)}
                rows={2}
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs font-bold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
