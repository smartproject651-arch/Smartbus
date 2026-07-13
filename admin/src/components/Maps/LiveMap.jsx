import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { io } from 'socket.io-client';
import L from 'leaflet';

// Custom bus icon
const busIcon = new L.Icon({
  iconUrl: '/bus-icon.png',  // add a bus icon file to public/
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

export default function LiveMap() {
  const [buses, setBuses] = useState([]);

  useEffect(() => {
    const socket = io('/', { transports: ['websocket'] });
    socket.emit('admin-join');
    socket.on('bus-location', (data) => {
      setBuses((prev) => {
        const exists = prev.find((b) => b.tripId === data.tripId);
        if (exists) {
          return prev.map((b) => (b.tripId === data.tripId ? { ...b, ...data } : b));
        }
        return [...prev, data];
      });
    });
    return () => socket.disconnect();
  }, []);

  return (
    <MapContainer center={[12.9716, 77.5946]} zoom={12} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {buses.map((bus) => (
        <Marker key={bus.tripId} position={[bus.lat, bus.lng]} icon={busIcon}>
          <Popup>
            Bus #{bus.busId} <br /> Speed: {bus.speed} km/h
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}