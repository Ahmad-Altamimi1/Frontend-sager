import { create } from "zustand";
import type { Drone, DroneId, IncomingDroneMessage } from "~/lib/types";
import { io, Socket } from "socket.io-client";
import { SOCKET_IO_URL } from "~/constants/env";

interface DronePathPoint {
  timestamp: number;
  latitude: number;
  longitude: number;
}

interface DroneState {
  drones: Record<DroneId, Drone>;
  paths: Record<DroneId, DronePathPoint[]>;
  selectedId: DroneId | null;
  highlightedId: DroneId | null;
  numRedDrones: number;
  connect: () => void;
  disconnect: () => void;
  flyTo: (id: DroneId) => void;
  clearSelection: () => void;
  highlight: (id: DroneId | null) => void;
}

const MAX_POINTS_PER_PATH = 2000; // prevent unlimited growth per drone

function isAllowed(registration: string): boolean {
  // Registration numbers that start with letter B can fly (Green)
  // Example: SG-BA is Green (has B after prefix segment)
  const cleaned = registration.trim().toUpperCase();
  // Allow if any segment starts with B
  return cleaned.split(/[-\s]/).some((seg) => seg.startsWith("B"));
}

function toDrone(msg: IncomingDroneMessage): Drone {
  const now = msg.ts ?? Date.now();
  return {
    id: msg.id,
    name: msg.name ?? `Drone ${msg.id}`,
    serial: msg.serial,
    latitude: msg.lat,
    longitude: msg.lng,
    altitude: msg.alt,
    organization: msg.organization,
    pilot: msg.pilot,
    yaw: msg.yaw,
    updatedAt: now,
    createdAt: now,
  };
}

export const useDroneStore = create<DroneState>((set, get) => {
  let socket: Socket | null = null;

  const updateCounts = (drones: Record<DroneId, Drone>) => {
    const numRed = Object.values(drones).reduce(
      (acc, d) => acc + (isAllowed(d.id) ? 0 : 1),
      0
    );
    set({ numRedDrones: numRed });
  };

  const ingest = (msg: IncomingDroneMessage) => {
    set((state) => {
      const existing = state.drones[msg.id];
      const now = msg.ts ?? Date.now();
      const next: Drone = existing
        ? {
            ...existing,
            latitude: msg.lat,
            longitude: msg.lng,
            altitude: msg.alt,
            yaw: msg.yaw,
            updatedAt: now,
          }
        : toDrone(msg);

      const nextDrones = { ...state.drones, [msg.id]: next };
      const prevPath = state.paths[msg.id] ?? [];
      const nextPath = [
        ...prevPath,
        { timestamp: now, latitude: msg.lat, longitude: msg.lng },
      ];
      if (nextPath.length > MAX_POINTS_PER_PATH) {
        nextPath.splice(0, nextPath.length - MAX_POINTS_PER_PATH);
      }

      const nextPaths = { ...state.paths, [msg.id]: nextPath };

      // update red count after set
      setTimeout(() => updateCounts(nextDrones));

      return { drones: nextDrones, paths: nextPaths };
    });
  };

  return {
    drones: {},
    paths: {},
    selectedId: null,
    highlightedId: null,
    numRedDrones: 0,
    connect: () => {
      const url = SOCKET_IO_URL;
      if (!url) return;
      if (socket) return;

      socket = io(url, { transports: ["polling"] });

      socket.on("connect", () => {
        // connected
      });

      socket.on("message", (payload: any) => {
        try {
          // Backend sends a GeoJSON FeatureCollection with one point feature
          // Map it to our IncomingDroneMessage
          if (
            payload &&
            payload.type === "FeatureCollection" &&
            Array.isArray(payload.features)
          ) {
            console.log("payload.features", payload.features);

            for (const f of payload.features) {
              if (!f || f.type !== "Feature" || !f.geometry) continue;
              const props = f.properties || {};
              const coords = f.geometry.coordinates || [];
              const msg: IncomingDroneMessage = {
                id: String(props.registration ?? ""),
                name: String(props.Name ?? "Drone"),
                serial: String(props.serial ?? ""),
                lat: Number(coords[1]),
                lng: Number(coords[0]),
                pilot: String(props.pilot ?? "unknown"),
                alt: Number(props.altitude ?? 0),
                yaw: Number(props.yaw ?? 0),
                organization: String(props.organization ?? "unknown"),
                ts: Date.now(),
              };
              ingest(msg);
            }
          }
        } catch (e) {
          // ignore malformed
        }
      });

      socket.on("disconnect", () => {
        socket = null;
      });
    },
    disconnect: () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    },
    flyTo: (id: DroneId) => set({ selectedId: id }),
    clearSelection: () => set({ selectedId: null }),
    highlight: (id: DroneId | null) => set({ highlightedId: id }),
  };
});

export { isAllowed };
