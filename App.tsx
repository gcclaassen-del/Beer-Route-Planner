import React, { useState, useMemo, useEffect } from 'react';
import ControlsPanel from './components/ControlsPanel';
import MapDisplay from './components/MapDisplay';
import ActionButtons from './components/ActionButtons';
import { Brewery, LocationPoint } from './types';
import { fetchBreweries } from './services/map-data-service';
import BookingFormModal from './components/BookingFormModal';

const App: React.FC = () => {
  // This is the new line to force a build change
  console.log('App component rendered with latest changes');

  const [breweries, setBreweries] = useState<Brewery[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [startPoint, setStartPoint] = useState<LocationPoint>({ address: '', coords: null });
  const [endPoint, setEndPoint] = useState<LocationPoint>({ address: '', coords: null });
  const [useDifferentEndPoint, setUseDifferentEndPoint] = useState(false);
  const [selectedBreweries, setSelectedBreweries] = useState<Brewery[]>([]);

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const fetchedBreweries = await fetchBreweries();
        setBreweries(fetchedBreweries);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load brewery data from the map. Please ensure the map is public and accessible.");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000); // Hide notification after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const toggleBrewerySelection = (brewery: Brewery) => {
    setSelectedBreweries((prevSelected) => {
      const isSelected = prevSelected.some((b) => b.id === brewery.id);
      if (isSelected) {
        return prevSelected.filter((b) => b.id !== brewery.id);
      } else {
        return [...prevSelected, brewery];
      }
    });
  };
  
  const handleBookingSubmit = () => {
    setIsBookingModalOpen(false);
    setNotification("Thank you for your request, we will get back to you as soon as possible by whatsapp.");
  }

  return (
    <div className="w-full min-h-screen md:h-screen bg-gray-100 flex flex-col font-sans md:overflow-hidden">
      <main className="flex-1 flex flex-col md:flex-row relative md:overflow-hidden">
        <ControlsPanel
          className="order-2 md:order-1 md:h-full"
          startPoint={startPoint}
          setStartPoint={setStartPoint}
          endPoint={endPoint}
          setEndPoint={setEndPoint}
          useDifferentEndPoint={useDifferentEndPoint}
          setUseDifferentEndPoint={setUseDifferentEndPoint}
          selectedBreweries={selectedBreweries}
          toggleBrewerySelection={toggleBrewerySelection}
        />
        <MapDisplay
          className="order-1 md:order-2 h-[60vh] md:h-full"
          visibleBreweries={breweries}
          selectedBreweries={selectedBreweries}
          startPoint={startPoint}
          endPoint={endPoint}
          useDifferentEndPoint={useDifferentEndPoint}
          toggleBrewerySelection={toggleBrewerySelection}
        />
        {isBookingModalOpen && (
          <BookingFormModal
            isOpen={isBookingModalOpen}
            onClose={() => setIsBookingModalOpen(false)}
            onSubmit={handleBookingSubmit}
            startPoint={startPoint}
            endPoint={endPoint}
            useDifferentEndPoint={useDifferentEndPoint}
            selectedBreweries={selectedBreweries}
          />
        )}
      </main>
      <footer className="z-10">
        <ActionButtons
            startPoint={startPoint}
            endPoint={endPoint}
            useDifferentEndPoint={useDifferentEndPoint}
            selectedBreweries={selectedBreweries}
            onBookTransport={() => setIsBookingModalOpen(true)}
        />
      </footer>
      {notification && (
          <div className="fixed bottom-24 right-5 bg-green-600 text-white py-3 px-5 rounded-lg shadow-xl z-20 transition-opacity duration-300" role="alert">
              {notification}
          </div>
      )}
    </div>
  );
};

export default App;
