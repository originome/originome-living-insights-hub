
export interface LocationData {
  lat: number;
  lon: number;
  city: string;
  region: string;
  country: string;
  zipCode?: string;
}

export class LocationService {
  static isUSZipCode(query: string): boolean {
    return /^\d{5}(-\d{4})?$/.test(query.trim());
  }

  static async fetchLocationData(locationQuery: string): Promise<LocationData> {
    try {
      const trimmedQuery = locationQuery.trim();
      
      if (this.isUSZipCode(trimmedQuery)) {
        console.log('Fetching US ZIP code:', trimmedQuery);
        
        // For US ZIP codes, use specialized geocoding
        const zipResponse = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&countrycodes=us&postalcode=${encodeURIComponent(trimmedQuery)}&addressdetails=1&limit=1`
        );
        
        if (zipResponse.ok) {
          const zipData = await zipResponse.json();
          if (zipData.length > 0) {
            const result = zipData[0];
            console.log('ZIP geocoding result:', result);
            
            return {
              lat: parseFloat(result.lat),
              lon: parseFloat(result.lon),
              city: result.address?.city || result.address?.town || result.address?.village || result.address?.suburb || 'Unknown City',
              region: result.address?.state || result.address?.county || '',
              country: 'US',
              zipCode: trimmedQuery
            };
          }
        }
        
        // Fallback for ZIP: try with "USA" appended
        const fallbackResponse = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(trimmedQuery + ' USA')}&addressdetails=1&limit=1`
        );
        
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          if (fallbackData.length > 0) {
            const result = fallbackData[0];
            return {
              lat: parseFloat(result.lat),
              lon: parseFloat(result.lon),
              city: result.address?.city || result.address?.town || result.address?.village || result.address?.suburb || 'Unknown City',
              region: result.address?.state || result.address?.county || '',
              country: 'US',
              zipCode: trimmedQuery
            };
          }
        }
        
        console.warn('ZIP code not found, using Chicago as fallback');
        return {
          lat: 41.8781,
          lon: -87.6298,
          city: 'Chicago',
          region: 'Illinois',
          country: 'US',
          zipCode: trimmedQuery
        };
      } else {
        // For city names or coordinates
        const cityResponse = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(trimmedQuery)}&addressdetails=1&limit=1`
        );
        
        if (cityResponse.ok) {
          const cityData = await cityResponse.json();
          if (cityData.length > 0) {
            const result = cityData[0];
            return {
              lat: parseFloat(result.lat),
              lon: parseFloat(result.lon),
              city: result.address?.city || result.address?.town || result.address?.village || result.display_name.split(',')[0],
              region: result.address?.state || result.address?.county || '',
              country: result.address?.country || 'US',
              zipCode: result.address?.postcode
            };
          }
        }
      }

      // Ultimate fallback
      console.warn('Location not found, using New York as fallback');
      return {
        lat: 40.7128,
        lon: -74.0060,
        city: 'New York',
        region: 'NY',
        country: 'US'
      };
    } catch (err) {
      console.error('Geocoding error:', err);
      return {
        lat: 40.7128,
        lon: -74.0060,
        city: 'New York',
        region: 'NY',
        country: 'US'
      };
    }
  }
}
