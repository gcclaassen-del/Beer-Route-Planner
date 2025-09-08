import React from 'react';
import { Brewery, LocationPoint } from '../types';
import { StartRouteIcon, WhatsAppIcon, EmailIcon, BusIcon } from './Icons';

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
    if (!destination.coords) return null;

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
    <div className="w-full bg-white p-4 border-t border-gray-200 shadow-up">
      <div className="max-w-4xl mx-auto flex justify-center items-center flex-wrap gap-2 sm:gap-4">
        <button
          onClick={handleStart}
          disabled={!isActionable}
          className="flex-1 sm:flex-initial sm:w-32 inline-flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <StartRouteIcon className="w-5 h-5 mr-2"/>
          Start
        </button>
        <button
          onClick={onBookTransport}
          disabled={!isBookable}
          className="flex-1 sm:flex-initial sm:w-44 inline-flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <BusIcon className="w-5 h-5 mr-2"/>
          Book Transport
        </button>
        <button
          onClick={() => handleShare('whatsapp')}
          disabled={!isActionable}
          className="flex-1 sm:flex-initial sm:w-40 inline-flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <WhatsAppIcon className="w-5 h-5 mr-2"/>
          WhatsApp
        </button>
        <button
          onClick={() => handleShare('email')}
          disabled={!isActionable}
          className="flex-1 sm:flex-initial sm:w-32 inline-flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gray-700 hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <EmailIcon className="w-5 h-5 mr-2"/>
          Email
        </button>
      </div>
    </div>
  );
};

export default ActionButtons;