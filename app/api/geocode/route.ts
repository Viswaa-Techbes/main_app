import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  try {
    if (action === "reverse") {
      const lat = searchParams.get("lat");
      const lng = searchParams.get("lng");
      if (!lat || !lng) {
        return NextResponse.json({ error: "Missing latitude or longitude" }, { status: 400 });
      }

      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
      const response = await fetch(url, {
        headers: {
          "User-Agent": "TechnicianApp/1.0",
        },
      });

      if (!response.ok) {
        throw new Error(`Nominatim reverse geocode failed with status: ${response.status}`);
      }

      const data = await response.json();
      return NextResponse.json(data);
    } else if (action === "search") {
      const q = searchParams.get("q");
      if (!q) {
        return NextResponse.json({ error: "Missing search query" }, { status: 400 });
      }

      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        q
      )}&countrycodes=in&limit=5&addressdetails=1`;
      const response = await fetch(url, {
        headers: {
          "User-Agent": "TechnicianApp/1.0",
        },
      });

      if (!response.ok) {
        throw new Error(`Nominatim search geocode failed with status: ${response.status}`);
      }

      const data = await response.json();
      return NextResponse.json(data);
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Geocode API proxy error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch geocoding data" },
      { status: 500 }
    );
  }
}
