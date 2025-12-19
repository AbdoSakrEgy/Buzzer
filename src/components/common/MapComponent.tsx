"use client";

import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { memo } from "react";

interface MapComponentProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: Array<{ lat: number; lng: number; title?: string }>;
  containerStyle?: React.CSSProperties;
}

const defaultContainerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "1.5rem", // rounded-3xl equivalent
};

const defaultCenter = {
  lat: 24.7136, // Riyadh, Saudi Arabia (default fallback)
  lng: 46.6753,
};

// MapComponent clean up
function MapComponent({
  center = defaultCenter,
  zoom = 12,
  markers = [],
  containerStyle = defaultContainerStyle,
}: MapComponentProps) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "", // Use env var if available
  });

  if (!isLoaded) {
    return (
      <div
        style={containerStyle}
        className="bg-gray-200 animate-pulse flex items-center justify-center rounded-3xl"
      >
        <span className="text-gray-400">Loading Map...</span>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={zoom}
      options={{
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: true,
      }}
    >
      {/* Current Location Marker */}
      <Marker position={center} title="Current Location" />

      {/* Restaurant Markers */}
      {markers.map((marker, index) => (
        <Marker key={index} position={marker} title={marker.title} />
      ))}
    </GoogleMap>
  );
}

export default memo(MapComponent);
