import React, { useState } from 'react';
import { Brewery, LocationPoint } from '../types';

interface BookingFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    startPoint: LocationPoint;
    endPoint: LocationPoint;
    useDifferentEndPoint: boolean;
    selectedBreweries: Brewery[];
}

const BookingFormModal: React.FC<BookingFormModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    startPoint,
    endPoint,
    useDifferentEndPoint,
    selectedBreweries
}) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        dates: '',
        peopleCount: '1',
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const finalDestination = useDifferentEndPoint ? endPoint : startPoint;
        
        const routeDescription = [
            `Start: ${startPoint.address}`,
            ...selectedBreweries.map((b, i) => `Stop ${i+1}: ${b.name} (${b.address})`),
            `End: ${finalDestination.address}`
        ].join('\n');
        
        const emailBody = `
New Transport Booking Request
-----------------------------
Name: ${formData.name}
Cellphone Number: ${formData.phone}
Email Address: ${formData.email}
Travel Dates: ${formData.dates}
Number of People: ${formData.peopleCount}
-----------------------------
Requested Route:
${routeDescription.trim()}
        `.trim();
        
        const mailtoLink = `mailto:info@beerroute.co.za?subject=${encodeURIComponent('New Brewery Tour Booking Request')}&body=${encodeURIComponent(emailBody)}`;

        // This will open the user's email client.
        window.location.href = mailtoLink;
        
        // We can't know if they actually sent the email, but we proceed with the success flow as requested.
        // A small delay helps ensure the mailto link has time to be handled by the browser
        // before the UI updates.
        setTimeout(() => {
            setIsSubmitting(false);
            onSubmit();
        }, 500);
    };

    if (!isOpen) return null;

    return (
        <div className="absolute inset-0 bg-black bg-opacity-60 flex justify-center items-center z-[1001] p-4" aria-modal="true" role="dialog">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg transform transition-all">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">Book Transport</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input type="text" name="name" id="name" required value={formData.name} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"/>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Cellphone Number</label>
                                <input type="tel" name="phone" id="phone" required value={formData.phone} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"/>
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                                <input type="email" name="email" id="email" required value={formData.email} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"/>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="dates" className="block text-sm font-medium text-gray-700">Dates you wish to travel</label>
                            <input type="text" name="dates" id="dates" required placeholder="e.g., 25-26 December 2024" value={formData.dates} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"/>
                        </div>
                        <div>
                            <label htmlFor="peopleCount" className="block text-sm font-medium text-gray-700">Number of people</label>
                            <input type="number" name="peopleCount" id="peopleCount" required min="1" value={formData.peopleCount} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"/>
                        </div>
                    </div>
                    
                    <div className="p-6 bg-gray-50 rounded-b-lg flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Cancel
                        </button>
                        <button type="submit" disabled={isSubmitting} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-wait">
                            {isSubmitting ? 'Submitting...' : 'Submit Request'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookingFormModal;