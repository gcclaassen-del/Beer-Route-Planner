// v1.2 Definitive Map Fix
import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Brewery, LocationPoint } from '../types';
import { customBreweryIconUrl, customSelectedBreweryIconUrl } from '../assets/custom-images';

// Fix for default icon issue with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const breweryIcon = new L.Icon({
    iconUrl: customBreweryIconUrl,
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -42]
});

const selectedBreweryIcon = new L.Icon({
    iconUrl: customSelectedBreweryIconUrl,
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -42]
});

const startIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#2563eb"><path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clip-rule="evenodd" /></svg>'),
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

const endIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#d97706"><path fill-rule="evenodd" d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z" clip-rule="evenodd" /></svg>'),
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
});

interface MapDisplayProps {
  visibleBreweries: Brewery[];
  selectedBreweries: Brewery[];
  startPoint: LocationPoint;
  endPoint: LocationPoint;
  useDifferentEndPoint: boolean;
  toggleBrewerySelection: (brewery: Brewery) => void;
  className?: string;
}

// This component ensures the map renders correctly after its container is sized, fixing the grey map bug.
const MapResize = () => {
    const map = useMap();
    useEffect(() => {
        const timer = setTimeout(() => {
            map.invalidateSize();
        }, 100);
        return () => clearTimeout(timer);
    }, [map]);
    return null;
};

const RecenterAutomatically:React.FC<{points: L.LatLngTuple[], center: L.LatLngTuple, zoom: number}> = ({ points, center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (points.length > 0) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else {
      map.setView(center, zoom);
    }
  }, [points, center, zoom, map]);
  return null;
}

const MapDisplay: React.FC<MapDisplayProps> = ({ visibleBreweries, selectedBreweries, startPoint, endPoint, useDifferentEndPoint, toggleBrewerySelection, className }) => {
  const center: L.LatLngTuple = [-28.94, 24.55];
  const zoom = 6;

  const routePoints = useMemo(() => {
    const points: L.LatLngTuple[] = [];
    if (startPoint.coords) {
      points.push(startPoint.coords);
    }
    points.push(...selectedBreweries.map(b => b.coords));
    const finalDestination = useDifferentEndPoint ? endPoint : startPoint;
    if (finalDestination.coords && selectedBreweries.length > 0) {
      points.push(finalDestination.coords);
    }
    return points;
  }, [startPoint, endPoint, selectedBreweries, useDifferentEndPoint]);

  const mapBoundsPoints = useMemo(() => {
      const points: L.LatLngTuple[] = [...visibleBreweries.map(b => b.coords), ...routePoints];
      return points.filter(p => p); // Filter out any null coordinates
  }, [visibleBreweries, routePoints]);


  return (
    <div className={`w-full md:w-2/3 relative ${className || ''}`}>
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapResize />
        {visibleBreweries.map((brewery) => {
          const isSelected = selectedBreweries.some(b => b.id === brewery.id);
          return (
            <Marker
              key={brewery.id}
              position={brewery.coords}
              icon={isSelected ? selectedBreweryIcon : breweryIcon}
            >
              <Popup>
                <div className="text-center p-1">
                    <p className="font-bold mb-2">{brewery.name}</p>
                    <button
                        onClick={() => toggleBrewerySelection(brewery)}
                        className={`px-3 py-1 text-xs font-semibold rounded-md text-white transition-colors ${
                            isSelected
                                ? 'bg-red-600 hover:bg-red-700'
                                : 'bg-indigo-600 hover:bg-indigo-700'
                        }`}
                    >
                        {isSelected ? 'Remove' : 'Add to Route'}
                    </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
        {startPoint.coords && (
          <Marker position={startPoint.coords} icon={startIcon}>
            <Popup>Start: {startPoint.address}</Popup>
          </Marker>
        )}
        {useDifferentEndPoint && endPoint.coords && (
          <Marker position={endPoint.coords} icon={endIcon}>
            <Popup>End: {endPoint.address}</Popup>
          </Marker>
        )}
        {routePoints.length > 1 && (
            <Polyline pathOptions={{ color: '#3b82f6', weight: 5 }} positions={routePoints} />
        )}
        <RecenterAutomatically points={mapBoundsPoints} center={center} zoom={zoom} />
      </MapContainer>
    </div>
  );
};

export default MapDisplay;
