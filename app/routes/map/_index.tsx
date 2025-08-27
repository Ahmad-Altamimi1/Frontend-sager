import { useEffect, useMemo, useState } from "react";
import { useDroneStore } from "~/store/droneStore";
import { MapView } from "./components/MapView";
import { DronePanel } from "./components/DronePanel";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import type { Route } from "./+types/_index";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "sager Drone Map" },
    { name: "description", content: "Welcome to sager Drone Map!" },
  ];
}
const MapContainer = () => {
  const [isClient, setIsClient] = useState(false);
  const connect = useDroneStore((s) => s.connect);
  const disconnect = useDroneStore((s) => s.disconnect);
  const drones = useDroneStore((s) => s.drones);
  const paths = useDroneStore((s) => s.paths);
  const selectedId = useDroneStore((s) => s.selectedId);
  const highlight = useDroneStore((s) => s.highlight);
  const flyToStore = useDroneStore((s) => s.flyTo);
  const clearSelection = useDroneStore((s) => s.clearSelection);
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
      <div className="w-full h-[calc(100vh-90px)] lg:h-[calc(100vh-90px)] bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[calc(100vh-90px)] lg:h-[calc(100vh-90px)]">
      <MapView
        drones={drones}
        paths={paths}
        selectedId={selectedId}
        onHover={highlight}
        onClick={flyToStore}
        onClearSelection={clearSelection}
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

      {/* notAllowed drones counter - repositioned for mobile */}
      <div className="absolute bottom-[103%] right-1 md:bottom-4 md:right-4 z-10">
        <motion.div
          key={numRed}
          className="flex items-center gap-2 rounded-xl bg-[#D9D9D9] backdrop-blur p-1 md:px-3 md:py-2 text-[#3C4248]"
        >
          <motion.span
            className=" text-sm font-semibold bg-[#1F2327] rounded-full text-white w-6 h-6 flex items-center justify-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            {numRed}
          </motion.span>
          <span className=" text-sm md:text-[16px]">Drone Flying</span>
        </motion.div>
      </div>

      {/* Mobile: Quick open button when panel is closed */}
      {!panelOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:hidden absolute bottom-20 left-4 z-10"
        >
          <button
            onClick={() => setPanelOpen(true)}
            className="p-3 rounded-full bg-[#111111] border border-zinc-800 shadow-lg hover:bg-zinc-800 transition-colors"
          >
            <ChevronLeft size={20} className="text-white rotate-90" />
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default MapContainer;
