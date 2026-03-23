export interface PropertyListing {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  type: 'house' | 'condo' | 'townhouse' | 'land';
  lat: number;
  lng: number;
  photos: string[];
  description: string;
  yearBuilt: number;
  garage: number;
  lotSize: number;
  daysOnMarket: number;
  status: 'active' | 'pending' | 'sold';
  realtor: RealtorInfo;
  roomTours: RoomTour[];
}

export interface RealtorInfo {
  name: string;
  phone: string;
  email: string;
  agency: string;
  photo: string;
  rating: number;
  reviews: number;
}

export interface RoomTour {
  id: string;
  name: string;
  thumbnail: string;
  description: string;
}

export interface ModuleConfig {
  photos: boolean;
  streetView: boolean;
  roomTour: boolean;
  contact: boolean;
}

export interface FilterState {
  search: string;
  minPrice: number;
  maxPrice: number;
  minBeds: number;
  type: string;
}
