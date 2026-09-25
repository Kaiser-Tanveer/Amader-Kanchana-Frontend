import L from "leaflet";
import { getIssueCategory } from "@/utils/categories";

export type MapMarkerType = "issue" | "institution" | "project" | "facility";

export interface MapMarkerData {
  id: string;
  type: MapMarkerType;
  latitude: number;
  longitude: number;
  title: string;
  subtitle?: string;
  categoryKey?: string;
  href?: string;
}

const TYPE_COLORS: Record<MapMarkerType, string> = {
  issue: "#dc2626",
  institution: "#2c8256",
  project: "#2f71b0",
  facility: "#a16207",
};

// Reusable divIcon factory. Issue markers pick up their category color;
// other marker types use a fixed color per type. This keeps the map
// rendering decoupled from any single data model, per the GIS extensibility
// requirement (polygons/roads/layers can be added later without a rewrite).
export const createMarkerIcon = (marker: Pick<MapMarkerData, "type" | "categoryKey">) => {
  const color =
    marker.type === "issue" && marker.categoryKey
      ? getIssueCategory(marker.categoryKey).color
      : TYPE_COLORS[marker.type];

  return L.divIcon({
    className: "kanchana-marker",
    html: `<span style="
      display:block;width:16px;height:16px;border-radius:50%;
      background:${color};border:2px solid white;
      box-shadow:0 1px 4px rgba(0,0,0,0.35);
    "></span>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -8],
  });
};
