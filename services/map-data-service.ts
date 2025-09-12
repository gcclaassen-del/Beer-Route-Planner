import { Brewery } from '../types';

const KML_URL = 'https://www.google.com/maps/d/kml?mid=1HJtc-6GV8TMTTke3BAdM12QEQA7qHGs-&forcekml=1';
// Using a different CORS proxy to bypass browser restrictions on fetching from Google Maps directly.
const PROXY_URL = `https://corsproxy.io/?${KML_URL}`;


const getFieldFromPlacemark = (placemark: Element, fieldName: string): string => {
    // Google My Maps puts custom data fields in ExtendedData
    const extendedData = placemark.querySelector('ExtendedData');
    if (extendedData) {
        const dataElements = extendedData.querySelectorAll('Data');
        for (const dataEl of Array.from(dataElements)) {
            if (dataEl.getAttribute('name') === fieldName) {
                return dataEl.querySelector('value')?.textContent?.trim() || '';
            }
        }
    }
    // Fallback for address if not in ExtendedData
    if (fieldName.toLowerCase() === 'address') {
       return placemark.querySelector('address')?.textContent?.trim() || placemark.querySelector('description')?.textContent?.trim() || '';
    }
    return '';
};


export const fetchBreweries = async (): Promise<Brewery[]> => {
    try {
        const response = await fetch(PROXY_URL);
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const kmlText = await response.text();

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(kmlText, "application/xml");
        
        const errorNode = xmlDoc.querySelector('parsererror');
        if (errorNode) {
            throw new Error(`Error parsing KML: ${errorNode.textContent}`);
        }

        const placemarks = xmlDoc.querySelectorAll('Placemark');
        const breweries: Brewery[] = [];

        placemarks.forEach((pm, index) => {
            const name = pm.querySelector('name')?.textContent?.trim() || 'Unnamed Place';
            const coordsString = pm.querySelector('Point > coordinates')?.textContent;
            
            if (coordsString) {
                const [lon, lat] = coordsString.split(',').map(parseFloat);
                const address = getFieldFromPlacemark(pm, 'Address');

                breweries.push({
                    id: pm.getAttribute('id') || `brewery-${index}`,
                    name,
                    address,
                    coords: [lat, lon],
                });
            }
        });

        return breweries;

    } catch (error) {
        console.error("Failed to fetch or parse brewery data:", error);
        throw error; // Re-throw the error to be caught by the calling component
    }
};
