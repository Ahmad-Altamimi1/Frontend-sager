import { AnimatePresence, motion } from "framer-motion";

interface HoverOverlayProps {
  name: string;
  altitude: number;
  createdAt: number;
}

export function HoverOverlay({ name, altitude, createdAt }: HoverOverlayProps) {
  const flightTimeSec = Math.max(
    0,
    Math.floor((Date.now() - createdAt) / 1000)
  );
  const mm = String(Math.floor(flightTimeSec / 60)).padStart(2, "0");
  const ss = String(flightTimeSec % 60).padStart(2, "0");
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 6 }}
        className="absolute left-1/2 top-4 -translate-x-1/2 z-10 rounded-md bg-zinc-900/90 text-zinc-100 px-3 py-1 text-xs border border-zinc-800"
      >
        <div className="font-medium">{name}</div>
        <div className="opacity-80">
          Altitude {altitude.toFixed(1)} m • Time {mm}:{ss}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
