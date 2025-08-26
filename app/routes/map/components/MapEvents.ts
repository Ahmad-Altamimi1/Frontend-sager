import { LAYER_IDS } from "~/constants/map";
import mapboxgl from "mapbox-gl";
import type { DroneFeatureProps } from "~/lib/types";
import { getFlightTime } from "../utils/getFlightTime";

interface MapEvents {
  map: mapboxgl.Map;
  popupRef: React.RefObject<mapboxgl.Popup | null>;
}

export const handleHoverBindings = ({ map, popupRef }: MapEvents) => {
  const layerId = LAYER_IDS.pointsIcon;
  let updateTimer: NodeJS.Timeout | null = null;
  let currentFeature: any = null;

  const updatePopupContent = (feature: any) => {
    if (!feature || !feature.properties || !popupRef.current) return;

    const activeDrone: DroneFeatureProps = feature.properties;
    const id = activeDrone.id;
    const name = activeDrone.name;
    const altitude = activeDrone.altitude;
    const flightTime = getFlightTime(activeDrone.startTime);

    const html = `
  <div style="
    background-color:#000;
    color:#fff;
    font-family:Inter, sans-serif;
    font-size:12px;
    line-height:1.4;
    min-width:180px;
    border-radius:6px;
    position:relative;
    padding:8px 10px;
  ">
    <!-- Title -->
    <div style="font-weight:600; font-size:13px; margin-bottom:6px;">
      ${name}
    </div>

    <!-- Two-column info -->
    <div style="display:flex; justify-content:space-between; gap:12px;">
      ${
        typeof altitude === "number"
          ? `<div>
             <div style="font-size:11px; color:#aaa;margin-bottom:4px;">Altitude</div>
             <div style="font-size:12px;">${altitude} m</div>
           </div>`
          : ""
      }
      <div>
        <div style="font-size:11px; color:#aaa; margin-bottom:4px;">Flight Time</div>
        <div style="font-size:12px;">${flightTime}</div>
      </div>
    </div>


  </div>
`;

    popupRef.current.setHTML(html);
  };

  map.on("mousemove", layerId, (e: any) => {
    map.getCanvas().style.cursor = "pointer";
    const feature = e.features?.[0];
    if (!feature || !feature.properties) return;

    currentFeature = feature;
    const activeDrone: DroneFeatureProps = feature.properties;
    console.log("activeDrone", activeDrone);

    if (!popupRef.current) {
      popupRef.current = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 20,
      });
    }

    popupRef.current
      .setLngLat(feature.geometry.coordinates ?? e.lngLat)
      .addTo(map);

    // Initial popup content
    updatePopupContent(feature);

    // Clear existing timer
    if (updateTimer) {
      clearInterval(updateTimer);
    }

    // Set up timer to update popup every second
    updateTimer = setInterval(() => {
      if (currentFeature && popupRef.current) {
        updatePopupContent(currentFeature);
      }
    }, 1000);
  });

  map.on("mouseleave", layerId, () => {
    map.getCanvas().style.cursor = "";

    // Clear the update timer
    if (updateTimer) {
      clearInterval(updateTimer);
      updateTimer = null;
    }

    popupRef.current?.remove();
    popupRef.current = null;
    currentFeature = null;
  });
};
