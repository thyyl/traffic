export enum Steps {
  LOCATION = "location",
  DATE = "date",
  DETAILS = "details",
}

export interface TrafficLocation {
  location: string;
  latitude: number;
  longitude: number;
  weatherForecast: string;
}

export interface LocationDetails {
  latitude: number;
  longitude: number;
  image: string;
}

export interface RecentSearches {
  id: string;
  createdAt: string;
  location: string;
  dateSearched: string;
  latitude: number;
  longitude: number;
}
