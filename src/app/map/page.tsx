"use client";

import dynamic from "next/dynamic";

const MapComponent = dynamic(
  () => import("@/components/map/map-component").then((m) => m.MapComponent),
  { ssr: false }
);

export default function MapPage() {
  return (
    <div className="w-screen h-screen overflow-hidden bg-stone-950">
      <MapComponent />
    </div>
  );
}
