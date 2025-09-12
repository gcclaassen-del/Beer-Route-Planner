import React, { useState, useEffect } from 'react';
import { LocationPoint, Brewery } from '../types';
import { LocationMarkerIcon } from './Icons';

interface ControlsPanelProps {
  startPoint: LocationPoint;
  setStartPoint: React.Dispatch<React.SetStateAction<LocationPoint>>;
  endPoint: LocationPoint;
  setEndPoint: React.Dispatch<React.SetStateAction<LocationPoint>>;
  useDifferentEndPoint: boolean;
  setUseDifferentEndPoint: React.Dispatch<React.SetStateAction<boolean>>;
  selectedBreweries: Brewery[];
  toggleBrewerySelection: (brewery: Brewery) => void;
  className?: string;
}

type NominatimSuggestion = {
    place_id: string;
    display_name: string;
    lat: string;
    lon: string;
}

const ControlsPanel: React.FC<ControlsPanelProps> = ({
  startPoint,
  setStartPoint,
  endPoint,
  setEndPoint,
  useDifferentEndPoint,
  setUseDifferentEndPoint,
  selectedBreweries,
  toggleBrewerySelection,
  className,
}) => {
  const [isLocating, setIsLocating] = useState(false);

  const [startSuggestions, setStartSuggestions] = useState<NominatimSuggestion[]>([]);
  const [isSearchingStart, setIsSearchingStart] = useState(false);
  const [endSuggestions, setEndSuggestions] = useState<NominatimSuggestion[]>([]);
  const [isSearchingEnd, setIsSearchingEnd] = useState(false);

  // Debounced search for start point
  useEffect(() => {
    const address = startPoint.address;
    if (address.length < 3 || address === 'My Current Location') {
      setStartSuggestions([]);
      return;
    }

    const handler = setTimeout(async () => {
      setIsSearchingStart(true);
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&countrycodes=za&limit=5`);
        const data = await response.json();
        setStartSuggestions(data);
      } catch (error) {
        console.error("Failed to fetch start address suggestions:", error);
      } finally {
        setIsSearchingStart(false);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [startPoint.address]);
  
  // Debounced search for end point
  useEffect(() => {
    const address = endPoint.address;
    if (address.length < 3) {
      setEndSuggestions([]);
      return;
    }
    
    const handler = setTimeout(async () => {
      setIsSearchingEnd(true);
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&countrycodes=za&limit=5`);
        const data = await response.json();
        setEndSuggestions(data);
      } catch (error) {
        console.error("Failed to fetch end address suggestions:", error);
      } finally {
        setIsSearchingEnd(false);
      }
    }, 500);
    
    return () => clearTimeout(handler);
  }, [endPoint.address]);


  const handleUseMyLocation = () => {
    setIsLocating(true);
    setStartSuggestions([]);
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser. Please enter an address manually.");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setStartPoint({
          address: 'My Current Location',
          coords: [latitude, longitude],
        });
        setIsLocating(false);
      },
      (error: GeolocationPositionError) => {
        console.error("Error getting location", error);
        
        let message = "Could not get your location. Please enter an address manually.";
        switch (error.code) {
            case error.PERMISSION_DENIED:
                message = "Location permission denied. Please enable location services in your browser settings.";
                break;
            case error.POSITION_UNAVAILABLE:
                message = "Location information is unavailable. Please check your network connection and try again.";
                break;
            case error.TIMEOUT:
                message = "The request to get user location timed out. Please try again.";
                break;
        }
        
        alert(message);
        setIsLocating(false);
      }
    );
  };
  
  const handleAddressChange = (address: string, setter: React.Dispatch<React.SetStateAction<LocationPoint>>) => {
      setter({ address, coords: null });
  }

  const handleSuggestionSelect = (suggestion: NominatimSuggestion, setter: React.Dispatch<React.SetStateAction<LocationPoint>>, suggestionSetter: React.Dispatch<React.SetStateAction<any[]>>) => {
    setter({
        address: suggestion.display_name,
        coords: [parseFloat(suggestion.lat), parseFloat(suggestion.lon)]
    });
    suggestionSetter([]);
  }

  return (
    <div className={`w-full md:w-1/3 bg-gray-50 p-4 overflow-y-auto flex flex-col space-y-6 ${className || ''}`}>
      <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Plan Your Route</h2>
        
        <div className="space-y-4">
          <div className="relative">
            <label htmlFor="start" className="block text-sm font-medium text-gray-700">Start Point</label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="text"
                id="start"
                value={startPoint.address}
                onChange={(e) => handleAddressChange(e.target.value, setStartPoint)}
                onBlur={() => setTimeout(() => setStartSuggestions([]), 150)}
                placeholder="Enter a start address"
                className="block w-full flex-1 rounded-none rounded-l-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3"
                autoComplete="off"
              />
              <button
                onClick={handleUseMyLocation}
                disabled={isLocating}
                className="relative inline-flex items-center space-x-2 rounded-r-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-200 disabled:cursor-not-allowed"
              >
                <LocationMarkerIcon className="h-5 w-5 text-gray-500" />
                <span>{isLocating ? 'Locating...' : 'Me'}</span>
              </button>
            </div>
            {isSearchingStart && <p className="text-xs text-gray-500 mt-1">Searching...</p>}
            {startSuggestions.length > 0 && (
                <ul className="absolute z-20 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-48 overflow-auto shadow-lg">
                    {startSuggestions.map(s => (
                        <li key={s.place_id} onMouseDown={() => handleSuggestionSelect(s, setStartPoint, setStartSuggestions)} className="p-2 text-sm hover:bg-indigo-100 cursor-pointer">
                            {s.display_name}
                        </li>
                    ))}
                </ul>
            )}
          </div>

          <div className="relative flex items-start">
            <div className="flex h-5 items-center">
              <input
                id="different-endpoint"
                type="checkbox"
                checked={useDifferentEndPoint}
                onChange={(e) => setUseDifferentEndPoint(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="different-endpoint" className="font-medium text-gray-700">Different end point?</label>
            </div>
          </div>

          {useDifferentEndPoint && (
            <div className="relative">
              <label htmlFor="end" className="block text-sm font-medium text-gray-700">End Point</label>
              <div className="mt-1">
                <input
                  type="text"
                  id="end"
                  value={endPoint.address}
                  onChange={(e) => handleAddressChange(e.target.value, setEndPoint)}
                  onBlur={() => setTimeout(() => setEndSuggestions([]), 150)}
                  placeholder="Enter an end address"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
                  autoComplete="off"
                />
              </div>
              {isSearchingEnd && <p className="text-xs text-gray-500 mt-1">Searching...</p>}
              {endSuggestions.length > 0 && (
                <ul className="absolute z-20 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-48 overflow-auto shadow-lg">
                    {endSuggestions.map(s => (
                        <li key={s.place_id} onMouseDown={() => handleSuggestionSelect(s, setEndPoint, setEndSuggestions)} className="p-2 text-sm hover:bg-indigo-100 cursor-pointer">
                            {s.display_name}
                        </li>
                    ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm flex-shrink-0">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Your Route</h2>
        {selectedBreweries.length > 0 ? (
          <ol className="space-y-3">
            {selectedBreweries.map((brewery, index) => (
              <li key={brewery.id} className="p-3 bg-gray-50 rounded-md flex justify-between items-start text-sm">
                <div className="flex items-start flex-1">
                  <span className="mr-3 text-lg font-bold text-indigo-600 w-6 text-center">{index + 1}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{brewery.name}</p>
                    <p className="text-xs text-gray-600 mt-1">{brewery.address}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleBrewerySelection(brewery)}
                  className="ml-2 p-1 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors"
                  aria-label={`Remove ${brewery.name} from your route`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-sm text-gray-500 italic">
            Click on a brewery on the map to add it to your route.
          </p>
        )}
      </div>
    </div>
  );
};

export default ControlsPanel;
