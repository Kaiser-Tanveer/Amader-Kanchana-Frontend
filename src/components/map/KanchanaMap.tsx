import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import { createMarkerIcon, type MapMarkerData } from "./mapMarker";

// Kanchana Union, Satkania, Chattogram approximate center — used only as a
// map viewport default, not asserted as a precise organizational location.
const DEFAULT_CENTER: [number, number] = [22.1783, 92.1];
const DEFAULT_ZOOM = 13;

interface KanchanaMapProps {
  markers: MapMarkerData[];
  height?: string;
}

const KanchanaMap = ({ markers, height = "560px" }: KanchanaMapProps) => {
  return (
    <div style={{ height }} className="overflow-hidden rounded-2xl border border-slate-200">
      <MapContainer center={DEFAULT_CENTER} zoom={DEFAULT_ZOOM} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((marker) => (
          <Marker key={`${marker.type}-${marker.id}`} position={[marker.latitude, marker.longitude]} icon={createMarkerIcon(marker)}>
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">{marker.title}</p>
                {marker.subtitle && <p className="text-slate-500">{marker.subtitle}</p>}
                {marker.href && (
                  <Link to={marker.href} className="mt-1 inline-block font-medium text-forest-700">
                    বিস্তারিত দেখুন →
                  </Link>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default KanchanaMap;
