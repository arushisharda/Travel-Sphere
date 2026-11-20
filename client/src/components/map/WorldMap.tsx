import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const inkDot = (name: string) => L.divIcon({
  className: '',
  html: `<div title="${name}" style="width:10px;height:10px;border-radius:50%;background:#1a1510;border:2px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,.3)"></div>`,
  iconSize: [10, 10],
  iconAnchor: [5, 5],
});

type MapDestination = {
  slug: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
};

type WorldMapProps = {
  destinations: MapDestination[];
  center?: [number, number];
  zoom?: number;
  height?: string;
};

export function WorldMap({ destinations, center = [20, 0], zoom = 2, height = '400px' }: WorldMapProps) {
  const navigate = useNavigate();
  const mapCenter: LatLngExpression = center;
  return (
    <MapContainer
      center={mapCenter}
      zoom={zoom}
      style={{ height, width: '100%', borderRadius: '0.75rem' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution={'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'}
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {destinations.map((d) => (
        <Marker key={d.slug} position={[d.latitude, d.longitude] as LatLngExpression} icon={inkDot(d.name)}>
          <Popup>
            <div className="text-sm">
              <strong>{d.name}</strong><br />
              {d.country}
              <br />
              <button
                onClick={() => navigate(`/destinations/${d.slug}`)}
                style={{ background: 'none', border: 'none', padding: 0, color: '#2563eb', textDecoration: 'underline', fontSize: '12px', cursor: 'pointer' }}
              >
                View destination →
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
