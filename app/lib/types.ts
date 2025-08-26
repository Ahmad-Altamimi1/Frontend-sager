export type DroneId = string;

export interface Drone {
  id: DroneId;
  name: string;
  serial: string;
  latitude: number;
  longitude: number;
  altitude: number;
  pilot: string;
  organization: string;
  yaw: number; // degrees, 0-360
  updatedAt: number; // epoch ms
  createdAt: number; // epoch ms
}

export interface IncomingDroneMessage {
  id: string;
  name?: string;
  serial: string;
  lat: number;
  lng: number;
  alt: number;
  organization: string;
  yaw: number;
  pilot: string;
  ts?: number;
}

export interface DroneFeatureProps {
  id: DroneId;
  name: string;
  serial: string;
  altitude: number;
  yaw: number;
  isAllowed: boolean;
  startTime: number;
}
