import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../context/AppContext';
import type { PropertyListing } from '../types';

function formatPrice(price: number): string {
  if (price >= 1000000) return `$${(price / 1000000).toFixed(1)}M`;
  return `$${Math.round(price / 1000)}K`;
}

function createPriceIcon(price: number, isSelected: boolean) {
  return L.divIcon({
    className: '',
    html: `<div class="price-marker ${isSelected ? 'price-marker--selected' : ''}">${formatPrice(price)}</div>`,
    iconAnchor: [40, 20],
    iconSize: [80, 32],
  });
}

interface MarkersProps {
  listings: PropertyListing[];
  selectedId: string | null;
  onSelect: (listing: PropertyListing) => void;
}

function Markers({ listings, selectedId, onSelect }: MarkersProps) {
  const map = useMap();
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    listings.forEach((listing) => {
      const isSelected = listing.id === selectedId;
      const icon = createPriceIcon(listing.price, isSelected);
      const marker = L.marker([listing.lat, listing.lng], { icon, zIndexOffset: isSelected ? 1000 : 0 });

      marker.on('click', () => onSelect(listing));

      const popup = L.popup({ closeButton: false, offset: [0, -12] }).setContent(`
        <div class="map-popup">
          <div class="map-popup__address">${listing.address}</div>
          <div class="map-popup__details">${listing.beds} bd · ${listing.baths} ba · ${listing.sqft.toLocaleString()} sqft</div>
        </div>
      `);
      marker.bindPopup(popup);

      marker.addTo(map);
      markersRef.current.push(marker);
    });

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
    };
  }, [listings, selectedId, map, onSelect]);

  return null;
}

function FlyToSelected({ listing }: { listing: PropertyListing | null }) {
  const map = useMap();
  useEffect(() => {
    if (listing) {
      map.flyTo([listing.lat, listing.lng], 15, { duration: 1 });
    }
  }, [listing, map]);
  return null;
}

export default function PropertyMap() {
  const { filteredListings, selectedListing, setSelectedListing } = useApp();

  return (
    <div className="h-full w-full">
      <MapContainer
        center={[30.2672, -97.7431]}
        zoom={12}
        className="h-full w-full"
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={20}
        />
        <Markers
          listings={filteredListings}
          selectedId={selectedListing?.id ?? null}
          onSelect={setSelectedListing}
        />
        <FlyToSelected listing={selectedListing} />
      </MapContainer>
    </div>
  );
}
