
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Car, Store, User } from 'lucide-react';

// Fix default markers in React Leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom dark map style component
const DarkMapStyle = () => {
  const map = useMap();
  
  useEffect(() => {
    // Add dark theme styling to map container
    const mapContainer = map.getContainer();
    mapContainer.style.filter = 'hue-rotate(180deg) invert(90%) contrast(120%)';
    mapContainer.style.background = '#1e293b';
  }, [map]);
  
  return null;
};

interface Location {
  lat: number;
  lng: number;
  name: string;
  type: 'driver' | 'buyer' | 'shop';
  phone?: string;
  address?: string;
}

interface DeliveryMapProps {
  locations: Location[];
  className?: string;
  height?: string;
}

const DeliveryMap = ({ locations, className = "", height = "400px" }: DeliveryMapProps) => {
  const [center, setCenter] = useState<[number, number]>([28.6139, 77.2090]); // Default to Delhi

  useEffect(() => {
    if (locations.length > 0) {
      // Calculate center based on all locations
      const lats = locations.map(loc => loc.lat);
      const lngs = locations.map(loc => loc.lng);
      const centerLat = lats.reduce((a, b) => a + b, 0) / lats.length;
      const centerLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;
      setCenter([centerLat, centerLng]);
    }
  }, [locations]);

  const getMarkerIcon = (type: string) => {
    const iconSize: [number, number] = [30, 30];
    
    switch (type) {
      case 'driver':
        return new Icon({
          iconUrl: 'data:image/svg+xml;base64,' + btoa(`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#10b981" width="24" height="24">
              <circle cx="12" cy="12" r="10" fill="#10b981"/>
              <path fill="white" d="M12 2L13.09 8.26L19 7L17.74 13.09L22 14L15.74 15.91L17 22L10.91 20.74L10 24L8.09 17.74L2 19L3.26 12.91L0 12L6.26 10.09L5 4L11.09 5.26L12 2Z"/>
            </svg>
          `),
          iconSize,
          iconAnchor: [15, 15],
        });
      case 'shop':
        return new Icon({
          iconUrl: 'data:image/svg+xml;base64,' + btoa(`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3b82f6" width="24" height="24">
              <circle cx="12" cy="12" r="10" fill="#3b82f6"/>
              <rect x="6" y="10" width="12" height="8" fill="white" rx="1"/>
              <rect x="8" y="8" width="8" height="4" fill="white" rx="1"/>
            </svg>
          `),
          iconSize,
          iconAnchor: [15, 15],
        });
      case 'buyer':
        return new Icon({
          iconUrl: 'data:image/svg+xml;base64,' + btoa(`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#f59e0b" width="24" height="24">
              <circle cx="12" cy="12" r="10" fill="#f59e0b"/>
              <circle cx="12" cy="8" r="3" fill="white"/>
              <path d="M12 14c-4 0-6 2-6 4v2h12v-2c0-2-2-4-6-4z" fill="white"/>
            </svg>
          `),
          iconSize,
          iconAnchor: [15, 15],
        });
      default:
        return new Icon({
          iconUrl: 'data:image/svg+xml;base64,' + btoa(`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#6b7280" width="24" height="24">
              <circle cx="12" cy="12" r="10" fill="#6b7280"/>
            </svg>
          `),
          iconSize,
          iconAnchor: [15, 15],
        });
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'driver': return <Car className="w-4 h-4" />;
      case 'shop': return <Store className="w-4 h-4" />;
      case 'buyer': return <User className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'driver': return 'text-green-400';
      case 'shop': return 'text-blue-400';
      case 'buyer': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <Card className={`bg-slate-800/50 border-slate-700 ${className}`}>
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <MapPin className="w-5 h-5 mr-2" />
          Delivery Map
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ height }} className="rounded-lg overflow-hidden border border-slate-600">
          <MapContainer
            center={center}
            zoom={12}
            style={{ height: '100%', width: '100%' }}
            zoomControl={true}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <DarkMapStyle />
            
            {locations.map((location, index) => (
              <Marker
                key={index}
                position={[location.lat, location.lng]}
                icon={getMarkerIcon(location.type)}
              >
                <Popup className="dark-popup">
                  <div className="bg-slate-800 text-white p-2 rounded">
                    <div className={`flex items-center mb-1 ${getTypeColor(location.type)}`}>
                      {getTypeIcon(location.type)}
                      <span className="ml-2 font-semibold capitalize">{location.type}</span>
                    </div>
                    <p className="font-medium">{location.name}</p>
                    {location.phone && (
                      <p className="text-sm text-slate-300">📞 {location.phone}</p>
                    )}
                    {location.address && (
                      <p className="text-sm text-slate-300">📍 {location.address}</p>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
        
        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center text-green-400">
            <Car className="w-4 h-4 mr-2" />
            Driver
          </div>
          <div className="flex items-center text-blue-400">
            <Store className="w-4 h-4 mr-2" />
            Shop
          </div>
          <div className="flex items-center text-yellow-400">
            <User className="w-4 h-4 mr-2" />
            Buyer
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeliveryMap;
