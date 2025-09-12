// v1.1 Force Rebuild
import React from 'react';
import { Brewery, LocationPoint } from '../types';
import { StartRouteIcon, PhoneIcon, EmailIcon, BusIcon } from './Icons';

interface ActionButtonsProps {
  startPoint: LocationPoint;
  endPoint: LocationPoint;
  useDifferentEndPoint: boolean;
  selectedBreweries: Brewery[];
  onBookTransport: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  startPoint,
  endPoint,
  useDifferentEndPoint,
  selectedBreweries,
  onBookTransport,
}) => {
  const getGoogleMapsUrl = () => {
    if (!startPoint.coords) return null;

    const destination = useDifferentEndPoint ? endPoint : startPoint;
    if (selectedBreweries.length > 0 && !destination.coords) return null;
    // If no breweries, we still need a destination
    if (selectedBreweries.length === 0 && !destination.coords) return null;


    const originParam = startPoint.coords.join(',');
    const destinationParam = destination.coords.join(',');

    const waypointsParam = selectedBreweries
      .map(b => b.coords.join(','))
      .join('|');

    let url = `https://www.google.com/maps/dir/?api=1&origin=${originParam}&destination=${destinationParam}`;
    if (waypointsParam) {
      url += `&waypoints=${waypointsParam}`;
    }
    
    url += '&travelmode=driving';

    return url;
  };

  const routeUrl = getGoogleMapsUrl();
  const isActionable = !!routeUrl;
  const isBookable = startPoint.coords && selectedBreweries.length > 0 && (useDifferentEndPoint ? !!endPoint.coords : true);

  const handleShare = (platform: 'whatsapp' | 'email') => {
    if (!routeUrl) return;
    const message = encodeURIComponent(`Check out this awesome brewery tour I planned: ${routeUrl}`);
    if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${message}`, '_blank');
    } else {
      const subject = encodeURIComponent("My Brewery Tour Plan");
      window.location.href = `mailto:?subject=${subject}&body=${message}`;
    }
  };

  const handleStart = () => {
    if (routeUrl) {
      window.open(routeUrl, '_blank');
    }
  };

  return (
    <div className="w-full bg-white p-3 border-t border-gray-200 shadow-up">
      <div className="max-w-4xl mx-auto flex flex-wrap justify-center items-center gap-3">
        <button
          onClick={handleStart}
          disabled={!isActionable}
          title={!isActionable ? "Add a start point & breweries to enable" : "Open route in Google Maps"}
          className="flex-initial inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          <StartRouteIcon className="w-5 h-5 mr-2"/>
          Start Route
        </button>
        <button
          onClick={onBookTransport}
          disabled={!isBookable}
          title={!isBookable ? "Add a start point & breweries to book transport" : "Get a quote for transport"}
          className="flex-initial inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          <BusIcon className="w-5 h-5 mr-2"/>
          Book Transport
        </button>
        <button
          onClick={() => handleShare('whatsapp')}
          disabled={!isActionable}
          title={!isActionable ? "Plan a route to share it" : "Share route via WhatsApp"}
          className="flex-initial inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          <PhoneIcon className="w-5 h-5 mr-2"/>
          Share
        </button>
        <button
          onClick={() => handleShare('email')}
          disabled={!isActionable}
          title={!isActionable ? "Plan a route to share it" : "Share route via Email"}
          className="flex-initial inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gray-700 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          <EmailIcon className="w-5 h-5 mr-2"/>
          Email
        </button>
      </div>
    </div>
  );
};

export default ActionButtons;
