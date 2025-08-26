import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { useDroneStore } from "~/store/droneStore";
import { Button } from "~/components/ui/button";
import { MapView } from "./components/MapView";
import { DronePanel } from "./components/DronePanel";
import { HoverOverlay } from "./components/HoverOverlay";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";

const MapContainer = () => {
  const [isClient, setIsClient] = useState(false);
  const connect = useDroneStore((s) => s.connect);
  const disconnect = useDroneStore((s) => s.disconnect);
  const drones = useDroneStore((s) => s.drones);
  const paths = useDroneStore((s) => s.paths);
  const selectedId = useDroneStore((s) => s.selectedId);
  const highlight = useDroneStore((s) => s.highlight);
  const flyToStore = useDroneStore((s) => s.flyTo);
  const numRed = useDroneStore((s) => s.numRedDrones);
  const highlightedId = useDroneStore((s) => s.highlightedId);
  const list = useMemo(() => Object.values(drones), [drones]);
  const [panelOpen, setPanelOpen] = useState(true);
  console.log("paths", paths);

  useEffect(() => setIsClient(true), []);

  useEffect(() => {
    if (!isClient) return;
    connect();
    return () => disconnect();
  }, [isClient, connect, disconnect]);

  // MapView handles map lifecycle and layers; this page wires the store

  // Don't render the map container until we're on the client
  if (!isClient) {
    return (
      <div className="w-full h-[calc(100vh-72px)] bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[calc(100vh-72px)] ">
      <MapView
        drones={drones}
        paths={paths}
        selectedId={selectedId}
        onHover={highlight}
        onClick={flyToStore}
      />

      <DronePanel
        open={panelOpen}
        drones={list.map((d) => ({
          id: d.id,
          organization: d.organization,
          pilot: d.pilot,
          name: d.name,
          serial: d.serial,
        }))}
        highlightedId={highlightedId}
        onClose={() => setPanelOpen(false)}
        onOpen={() => setPanelOpen(true)}
        onSelect={(id) => {
          flyToStore(id);
          highlight(id);
        }}
      />

      {/* Hover tooltip on highlight: render simple overlay */}
      {highlightedId && (
        <HoverOverlay
          name={drones[highlightedId]?.name ?? ""}
          altitude={drones[highlightedId]?.altitude ?? 0}
          createdAt={drones[highlightedId]?.createdAt ?? Date.now()}
        />
      )}

      {/* Red drones counter */}
      <div className="absolute bottom-4 right-4 z-10">
        <motion.div
          key={numRed}
          className="flex items-center gap-2 rounded-full bg-zinc-900/90 backdrop-blur px-3 py-2 text-zinc-100 border border-zinc-800"
        >
          <span className="text-xs">Red drones</span>
          <motion.span
            className="text-sm font-semibold"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            {numRed}
          </motion.span>
        </motion.div>
      </div>
    </div>
  );
};

export default MapContainer;
