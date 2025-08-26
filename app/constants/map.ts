export const DEFAULT_CENTER: [number, number] = [
  35.93131881204147, 31.94878648036645,
];
export const DEFAULT_ZOOM = 11;
export const MAP_STYLE = "mapbox://styles/mapbox/standard-satellite";

export const LAYER_IDS = {
  points: "drone-points-layer",
  yaw: "drone-yaw-layer",
  pointsIcon: "drone-points-icon",
  paths: "drone-path-lines",
  srcPoints: "drone-points",
  srcPaths: "drone-paths",
} as const;
