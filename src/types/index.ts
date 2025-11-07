export interface POI {
  id: string;
  name: string;
  lat: number;
  lon: number;
  category: string;
  subcategory: string;
  address: string;
  hours: string;
  rating: number;
  phone?: string;
  distance_km?: number;
}

export interface SearchParams {
  query: string;
  userLat: number;
  userLon: number;
  radius: number;
  topK: number;
  category: string;
  mood: string;
}

export interface Location {
  lat: number;
  lon: number;
}
