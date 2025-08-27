import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import type { Drone } from "~/lib/types";
import "../mapContainer.css";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
  MAP_STYLE,
  LAYER_IDS,
  ARROW_SIZE,
  DRONE_COLORS,
} from "~/constants/map";
import { MAPBOX_ACCESS_TOKEN } from "~/constants/env";
import { isAllowed } from "~/store/droneStore";
import DroneIcon from "~assets/Icon/drone.svg";
import { handleHoverBindings } from "./MapEvents";

type DronePathPoint = {
  timestamp: number;
  latitude: number;
  longitude: number;
};

export interface MapViewProps {
  drones: Record<string, Drone>;
  paths: Record<string, DronePathPoint[]>;
  selectedId: string | null;
  onHover: (id: string | null) => void;
  onClick: (id: string) => void;
  onClearSelection: () => void;
}

/**
 * MapView is responsible for Mapbox map lifecycle and rendering layers/sources.
 * - Initializes the map
 * - Maintains GeoJSON sources for drone points and path lines
 * - Draws yaw arrow icons and handles hover/click interactions
 */
export function MapView({
  drones,
  paths,
  selectedId,
  onClick,
  onHover,
  onClearSelection,
}: MapViewProps) {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const popupRef = useRef<mapboxgl.Popup | null>(null);

  // Initialize Mapbox map on client
  useEffect(() => {
    if (!containerRef.current) return;

    const accessToken = MAPBOX_ACCESS_TOKEN;
    if (!accessToken) {
      console.error("Mapbox access token not found");
      return;
    }
    mapboxgl.accessToken = accessToken;

    mapRef.current = new mapboxgl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      attributionControl: false,
    });
    mapRef.current.addControl(new mapboxgl.NavigationControl());

    // Add click handler for empty space to clear selection
    mapRef.current.on("click", (e) => {
      // Check if the click is on a feature (drone)
      const features = mapRef.current?.queryRenderedFeatures(e.point);
      if (!features || features.length === 0) {
        // Click is on empty space, clear selection
        onClearSelection();
        onHover(null); // Also clear hover state
      }
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // Add sources/layers and update data when drones/paths change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const featureCollection = {
      type: "FeatureCollection",
      features: Object.values(drones).map((d) => ({
        type: "Feature",
        geometry: { type: "Point", coordinates: [d.longitude, d.latitude] },
        properties: {
          id: d.id,
          name: d.name,
          serial: d.serial,
          altitude: d.altitude,
          yaw: d.yaw,
          isAllowed: isAllowed(d.id),
          startTime: d.createdAt,
        },
      })),
    } as any;

    const pathCollection = {
      type: "FeatureCollection",
      features: Object.entries(paths).map(([id, pts]) => ({
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: pts.map((p) => [p.longitude, p.latitude]),
        },
        properties: { id, isAllowed: isAllowed(id) },
      })),
    } as any;

    const ensureSource = (id: string, data: any) => {
      if (map.getSource(id)) {
        (map.getSource(id) as mapboxgl.GeoJSONSource).setData(data);
      } else {
        map.addSource(id, { type: "geojson", data });
      }
    };

    const installLayersIfNeeded = () => {
      if (map.getLayer(LAYER_IDS.paths)) return; // already installed

      const size = ARROW_SIZE;

      // 1️⃣ Create yaw arrow icon from canvas
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d")!;
      ctx.clearRect(0, 0, size, size);
      ctx.translate(size / 2, size / 2);
      ctx.beginPath();
      ctx.moveTo(0, -5);
      ctx.lineTo(12, 14);
      ctx.lineTo(0, 8);
      ctx.lineTo(-12, 14);
      ctx.closePath();
      ctx.fillStyle = "#000";
      ctx.fill();

      //  1️⃣ Add yaw arrow image
      if (!map.hasImage("drone-arrow")) {
        map.addImage(
          "drone-arrow",
          {
            width: size,
            height: size,
            data: ctx.getImageData(0, 0, size, size).data,
          },
          { sdf: true } as any
        );
      }

      // 2️⃣ Add drone paths
      map.addLayer({
        id: LAYER_IDS.paths,
        type: "line",
        source: LAYER_IDS.srcPaths,
        paint: {
          "line-color": [
            "case",
            ["==", ["get", "isAllowed"], true],
            DRONE_COLORS.allowed,
            DRONE_COLORS.notAllowed,
          ],
          "line-width": ["case", ["==", ["get", "id"], selectedId], 3, 2],
        },
      });

      // 3️⃣ Add circle points
      map.addLayer({
        id: LAYER_IDS.points,
        type: "circle",
        source: LAYER_IDS.srcPoints,
        paint: {
          "circle-color": [
            "case",
            ["==", ["get", "isAllowed"], true],
            DRONE_COLORS.allowed,
            DRONE_COLORS.notAllowed,
          ],
          "circle-radius": ["case", ["==", ["get", "id"], selectedId], 8, 6],
          "circle-stroke-width": 9,
          "circle-stroke-color": [
            "case",
            ["==", ["get", "isAllowed"], true],
            DRONE_COLORS.allowed,
            DRONE_COLORS.notAllowed,
          ],
        },
      });

      // 4️⃣ Load drone icon image
      const img = new Image();
      img.src = DroneIcon;
      img.onload = () => {
        if (!map.hasImage("drone-icon")) {
          map.addImage("drone-icon", img);
        }

        // 5️⃣ Add drone icon layer (on top of circles)
        map.addLayer({
          id: LAYER_IDS.pointsIcon,
          type: "symbol",
          source: LAYER_IDS.srcPoints,
          layout: {
            "icon-image": "drone-icon",
            "icon-size": 0.7,
            "icon-allow-overlap": true,
          },
        });

        // 6️⃣ Add yaw arrow layer (on top of icon)
        map.addLayer({
          id: LAYER_IDS.yaw,
          type: "symbol",
          source: LAYER_IDS.srcPoints,
          layout: {
            "icon-image": "drone-arrow",
            "icon-size": 0.7,
            "icon-rotate": ["get", "yaw"],
            "icon-keep-upright": true,
            "icon-allow-overlap": true,
            "icon-offset": [0, -30],
          },
          paint: {
            "icon-color": [
              "case",
              ["==", ["get", "isAllowed"], true],
              DRONE_COLORS.allowed,
              DRONE_COLORS.notAllowed,
            ],
          },
        });
      };

      // Initialize hover bindings for points  layers
      handleHoverBindings({ map, popupRef });

      map.on("click", LAYER_IDS.points, (e) => {
        const f = e.features?.[0];
        if (!f) return;
        const id = f.properties?.id as string;
        onClick(id);
        onHover(id);
      });
    };

    if (!map.isStyleLoaded()) {
      map.once("load", () => {
        ensureSource(LAYER_IDS.srcPoints, featureCollection);
        ensureSource(LAYER_IDS.srcPaths, pathCollection);
        installLayersIfNeeded();
      });
    } else {
      ensureSource(LAYER_IDS.srcPoints, featureCollection);
      ensureSource(LAYER_IDS.srcPaths, pathCollection);
      installLayersIfNeeded();
    }
  }, [drones, paths]);

  // Update per-selection paint expressions when selectedId changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (!map.getLayer(LAYER_IDS.points)) return;
    map.setPaintProperty(LAYER_IDS.points, "circle-radius", [
      "case",
      ["==", ["get", "id"], selectedId],
      20,
      6,
    ]);
    if (map.getLayer(LAYER_IDS.paths)) {
      map.setPaintProperty(LAYER_IDS.paths, "line-width", [
        "case",
        ["==", ["get", "id"], selectedId],
        5,
        1,
      ]);
    }
    if (map.getLayer(LAYER_IDS.pointsIcon)) {
      map.setLayoutProperty(LAYER_IDS.pointsIcon, "icon-size", [
        "case",
        ["==", ["get", "id"], selectedId],
        1.1,
        0.7,
      ]);
      map.setLayoutProperty(LAYER_IDS.yaw, "icon-size", [
        "case",
        ["==", ["get", "id"], selectedId],
        1.5,
        0.7,
      ]);
    }
  }, [selectedId]);

  // // Fly to selected drone when it changes (do not re-fly on every live update)
  useEffect(() => {
    const map = mapRef.current;

    if (!map || !selectedId) return;
    const d = drones[selectedId];
    console.log("Flying to drone:", d);

    if (!d) return;
    map.flyTo({
      center: [d.longitude, d.latitude],
      zoom: Math.max(12, map.getZoom()),
      speed: 0.8,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  return (
    <div id="map-container" ref={containerRef} className="w-full h-full" />
  );
}
