
// Utility functions for location-based operations

export interface Location {
  lat: number;
  lng: number;
}

// Calculate distance between two points using Haversine formula
export const calculateDistance = (point1: Location, point2: Location): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (point2.lat - point1.lat) * Math.PI / 180;
  const dLng = (point2.lng - point1.lng) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return distance;
};

// Check if driver is within delivery radius (3km)
export const isWithinDeliveryRadius = (driverLocation: Location, deliveryLocation: Location): boolean => {
  const distance = calculateDistance(driverLocation, deliveryLocation);
  return distance <= 3; // 3km radius
};

// Find nearby drivers within 3km radius
export const findNearbyDrivers = (
  deliveryLocation: Location, 
  allDrivers: Array<{ id: string; location?: Location; is_online: boolean }>
): Array<{ id: string; distance: number }> => {
  return allDrivers
    .filter(driver => driver.is_online && driver.location)
    .map(driver => ({
      id: driver.id,
      distance: calculateDistance(deliveryLocation, driver.location!)
    }))
    .filter(driver => driver.distance <= 3)
    .sort((a, b) => a.distance - b.distance); // Sort by nearest first
};

// Get user's current location
export const getCurrentLocation = (): Promise<Location> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  });
};

// City coordinates for initial map centering
export const CITY_COORDINATES: Record<string, Location> = {
  'Mumbai': { lat: 19.0760, lng: 72.8777 },
  'Delhi': { lat: 28.6139, lng: 77.2090 },
  'Bangalore': { lat: 12.9716, lng: 77.5946 },
  'Hyderabad': { lat: 17.3850, lng: 78.4867 },
  'Chennai': { lat: 13.0827, lng: 80.2707 },
  'Kolkata': { lat: 22.5726, lng: 88.3639 },
  'Pune': { lat: 18.5204, lng: 73.8567 },
  'Ahmedabad': { lat: 23.0225, lng: 72.5714 },
  'Jaipur': { lat: 26.9124, lng: 75.7873 }
};
