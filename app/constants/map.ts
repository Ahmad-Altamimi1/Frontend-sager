export const DEFAULT_CENTER: [number, number] = [
  35.93131881204147, 31.94878648036645,
];
export const DEFAULT_ZOOM = 11;
export const MAP_STYLE = "mapbox://styles/mapbox/dark-v11";
export const ARROW_SIZE = 15;

export const DRONE_COLORS = {
  allowed: "#22c55e", // green if allowed
  notAllowed: "#D90915", // red if not allowed
} as const;

export const LAYER_IDS = {
  points: "drone-points-layer",
  yaw: "drone-yaw-layer",
  pointsIcon: "drone-points-icon",
  paths: "drone-path-lines",
  srcPoints: "drone-points",
  srcPaths: "drone-paths",
} as const;
