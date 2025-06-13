
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Locate, Search } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface LocationPickerProps {
  onLocationSelect: (location: {
    address: string;
    coordinates: { lat: number; lng: number };
    city: string;
    area: string;
  }) => void;
  placeholder?: string;
}

const INDIAN_CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 
  'Pune', 'Ahmedabad', 'Jaipur', 'Surat', 'Lucknow', 'Kanpur',
  'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad'
];

const CITY_AREAS: Record<string, string[]> = {
  'Mumbai': ['Andheri', 'Bandra', 'Malad', 'Borivali', 'Powai', 'Vikhroli', 'Dadar', 'Lower Parel', 'Worli', 'Juhu'],
  'Delhi': ['Connaught Place', 'Karol Bagh', 'Lajpat Nagar', 'Dwarka', 'Rohini', 'Janakpuri', 'Saket', 'Vasant Kunj', 'Green Park', 'Khan Market'],
  'Bangalore': ['Koramangala', 'Indiranagar', 'Whitefield', 'Electronic City', 'JP Nagar', 'BTM Layout', 'HSR Layout', 'Marathahalli', 'Yelahanka', 'Jayanagar'],
  'Pune': ['Kothrud', 'Hinjewadi', 'Wakad', 'Baner', 'Aundh', 'Viman Nagar', 'Koregaon Park', 'Camp', 'Hadapsar', 'Magarpatta'],
  'Chennai': ['T Nagar', 'Anna Nagar', 'Velachery', 'Adyar', 'Nungambakkam', 'OMR', 'Porur', 'Tambaram', 'Mylapore', 'Guindy']
};

const LocationPicker = ({ onLocationSelect, placeholder = "Select delivery location" }: LocationPickerProps) => {
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [landmark, setLandmark] = useState<string>('');
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  
  const { toast } = useToast();

  const detectCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by this browser",
        variant: "destructive"
      });
      return;
    }

    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setCurrentLocation(coords);
        setIsDetecting(false);
        
        // Reverse geocoding simulation (in real app, use Google Maps API)
        const nearestCity = findNearestCity(coords);
        setSelectedCity(nearestCity);
        
        toast({
          title: "Location detected!",
          description: `Found you near ${nearestCity}`,
        });
      },
      (error) => {
        setIsDetecting(false);
        toast({
          title: "Location Error",
          description: "Could not detect your location. Please select manually.",
          variant: "destructive"
        });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const findNearestCity = (coords: { lat: number; lng: number }) => {
    // Simplified city detection based on approximate coordinates
    const cityCoords: Record<string, { lat: number; lng: number }> = {
      'Mumbai': { lat: 19.0760, lng: 72.8777 },
      'Delhi': { lat: 28.6139, lng: 77.2090 },
      'Bangalore': { lat: 12.9716, lng: 77.5946 },
      'Pune': { lat: 18.5204, lng: 73.8567 },
      'Chennai': { lat: 13.0827, lng: 80.2707 }
    };

    let nearest = 'Mumbai';
    let minDistance = Infinity;

    Object.entries(cityCoords).forEach(([city, cityCoord]) => {
      const distance = Math.sqrt(
        Math.pow(coords.lat - cityCoord.lat, 2) + 
        Math.pow(coords.lng - cityCoord.lng, 2)
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearest = city;
      }
    });

    return nearest;
  };

  const handleConfirmLocation = () => {
    if (!selectedCity || !selectedArea) {
      toast({
        title: "Incomplete Selection",
        description: "Please select both city and area",
        variant: "destructive"
      });
      return;
    }

    const address = `${landmark ? landmark + ', ' : ''}${selectedArea}, ${selectedCity}`;
    
    // Generate approximate coordinates based on city/area selection
    const coordinates = generateCoordinates(selectedCity, selectedArea);
    
    onLocationSelect({
      address,
      coordinates,
      city: selectedCity,
      area: selectedArea
    });

    toast({
      title: "Location Selected",
      description: `Selected: ${address}`,
    });
  };

  const generateCoordinates = (city: string, area: string) => {
    const baseCoords: Record<string, { lat: number; lng: number }> = {
      'Mumbai': { lat: 19.0760, lng: 72.8777 },
      'Delhi': { lat: 28.6139, lng: 77.2090 },
      'Bangalore': { lat: 12.9716, lng: 77.5946 },
      'Pune': { lat: 18.5204, lng: 73.8567 },
      'Chennai': { lat: 13.0827, lng: 80.2707 }
    };

    const base = baseCoords[city] || baseCoords['Mumbai'];
    
    // Add small random offset for different areas
    const areaOffset = (area.charCodeAt(0) % 10) * 0.01;
    
    return {
      lat: base.lat + (Math.random() - 0.5) * 0.1 + areaOffset,
      lng: base.lng + (Math.random() - 0.5) * 0.1 + areaOffset
    };
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <MapPin className="w-5 h-5 mr-2" />
          {placeholder}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Button
            onClick={detectCurrentLocation}
            disabled={isDetecting}
            variant="outline"
            className="border-green-500 text-green-400 hover:bg-green-500 hover:text-white"
          >
            <Locate className="w-4 h-4 mr-2" />
            {isDetecting ? 'Detecting...' : 'Use Current Location'}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-slate-300">City *</Label>
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                {INDIAN_CITIES.map(city => (
                  <SelectItem key={city} value={city} className="text-white hover:bg-slate-600">
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-slate-300">Area *</Label>
            <Select 
              value={selectedArea} 
              onValueChange={setSelectedArea}
              disabled={!selectedCity}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Select area" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                {selectedCity && CITY_AREAS[selectedCity]?.map(area => (
                  <SelectItem key={area} value={area} className="text-white hover:bg-slate-600">
                    {area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label className="text-slate-300">Landmark (Optional)</Label>
          <Input
            value={landmark}
            onChange={(e) => setLandmark(e.target.value)}
            placeholder="e.g., Near Metro Station, Mall, etc."
            className="bg-slate-700 border-slate-600 text-white"
          />
        </div>

        {currentLocation && (
          <div className="text-sm text-green-400">
            📍 Current location detected: {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
          </div>
        )}

        <Button
          onClick={handleConfirmLocation}
          disabled={!selectedCity || !selectedArea}
          className="w-full bg-green-500 hover:bg-green-600 text-white"
        >
          <Search className="w-4 h-4 mr-2" />
          Confirm Location
        </Button>
      </CardContent>
    </Card>
  );
};

export default LocationPicker;
