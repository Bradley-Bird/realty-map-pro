import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { PropertyListing, ModuleConfig, FilterState, UserProfile } from '../types';
import { sampleListings } from '../data/sample-listings';

interface AppContextType {
  listings: PropertyListing[];
  filteredListings: PropertyListing[];
  selectedListing: PropertyListing | null;
  setSelectedListing: (listing: PropertyListing | null) => void;
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  modules: ModuleConfig;
  setModules: (modules: ModuleConfig) => void;
  isPanelOpen: boolean;
  setIsPanelOpen: (open: boolean) => void;
  // Auth / profile
  user: UserProfile | null;
  showSignInModal: boolean;
  setShowSignInModal: (show: boolean) => void;
  signInAsGuest: (name: string, email: string, phone: string) => void;
  signInWithOAuth: (profile: UserProfile) => void;
  signOut: () => void;
  toggleSavedListing: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultFilters: FilterState = {
  search: '',
  minPrice: 0,
  maxPrice: 5000000,
  minBeds: 0,
  type: 'all',
};

const defaultModules: ModuleConfig = {
  photos: true,
  streetView: true,
  roomTour: true,
  contact: true,
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [selectedListing, setSelectedListingState] = useState<PropertyListing | null>(null);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [modules, setModules] = useState<ModuleConfig>(defaultModules);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [showSignInModal, setShowSignInModal] = useState(true);

  const setSelectedListing = (listing: PropertyListing | null) => {
    setSelectedListingState(listing);
    setIsPanelOpen(listing !== null);
  };

  const signInAsGuest = (name: string, email: string, phone: string) => {
    setUser({
      name,
      email,
      phone,
      authProvider: 'guest',
      savedListings: [],
      contactPreferences: { email: true, phone: false, text: false },
    });
    setShowSignInModal(false);
  };

  const signInWithOAuth = (profile: UserProfile) => {
    setUser(profile);
    setShowSignInModal(false);
  };

  const signOut = () => {
    setUser(null);
    setShowSignInModal(true);
  };

  const toggleSavedListing = (id: string) => {
    if (!user) return;
    setUser({
      ...user,
      savedListings: user.savedListings.includes(id)
        ? user.savedListings.filter((s) => s !== id)
        : [...user.savedListings, id],
    });
  };

  const filteredListings = sampleListings.filter((listing) => {
    const matchSearch =
      !filters.search ||
      listing.address.toLowerCase().includes(filters.search.toLowerCase()) ||
      listing.city.toLowerCase().includes(filters.search.toLowerCase());

    const matchPrice =
      listing.price >= filters.minPrice && listing.price <= filters.maxPrice;

    const matchBeds = listing.beds >= filters.minBeds;

    const matchType = filters.type === 'all' || listing.type === filters.type;

    return matchSearch && matchPrice && matchBeds && matchType;
  });

  return (
    <AppContext.Provider
      value={{
        listings: sampleListings,
        filteredListings,
        selectedListing,
        setSelectedListing,
        filters,
        setFilters,
        modules,
        setModules,
        isPanelOpen,
        setIsPanelOpen,
        user,
        showSignInModal,
        setShowSignInModal,
        signInAsGuest,
        signInWithOAuth,
        signOut,
        toggleSavedListing,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
