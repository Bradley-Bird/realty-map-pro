import { useState } from 'react';
import { Search, SlidersHorizontal, Bed, Bath, Square, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { PropertyListing, FilterState } from '../types';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
}

interface ListingCardProps {
  listing: PropertyListing;
  isSelected: boolean;
  onClick: () => void;
}

function ListingCard({ listing, isSelected, onClick }: ListingCardProps) {
  const statusColor = {
    active: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    sold: 'bg-gray-100 text-gray-600',
  }[listing.status];

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-xl border-2 transition-all duration-200 overflow-hidden hover:shadow-md ${
        isSelected ? 'border-blue-500 shadow-md bg-blue-50' : 'border-transparent bg-white hover:border-gray-200'
      }`}
    >
      <div className="relative h-40 overflow-hidden">
        <img
          src={listing.photos[0]}
          alt={listing.address}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-2 left-2">
          <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${statusColor}`}>
            {listing.status}
          </span>
        </div>
        <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1">
          <span className="text-sm font-bold text-gray-900">{listing.daysOnMarket}d</span>
        </div>
      </div>
      <div className="p-3">
        <div className="text-lg font-bold text-gray-900">{formatPrice(listing.price)}</div>
        <div className="text-sm text-gray-600 mt-0.5 truncate">{listing.address}</div>
        <div className="text-xs text-gray-400">{listing.city}, {listing.state} {listing.zip}</div>
        <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
          <span className="flex items-center gap-1"><Bed className="h-3 w-3" />{listing.beds} bd</span>
          <span className="flex items-center gap-1"><Bath className="h-3 w-3" />{listing.baths} ba</span>
          <span className="flex items-center gap-1"><Square className="h-3 w-3" />{listing.sqft.toLocaleString()} sqft</span>
        </div>
        <div className="flex items-center gap-1 mt-1.5 text-xs text-gray-400">
          <Calendar className="h-3 w-3" />
          <span>Built {listing.yearBuilt} · {listing.type}</span>
        </div>
      </div>
    </div>
  );
}

interface FilterPanelProps {
  filters: FilterState;
  onChange: (f: FilterState) => void;
}

function FilterPanel({ filters, onChange }: FilterPanelProps) {
  return (
    <div className="bg-gray-50 rounded-xl p-3 space-y-3 border border-gray-100">
      <div>
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Property Type</label>
        <select
          value={filters.type}
          onChange={(e) => onChange({ ...filters, type: e.target.value })}
          className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Types</option>
          <option value="house">House</option>
          <option value="condo">Condo</option>
          <option value="townhouse">Townhouse</option>
          <option value="land">Land</option>
        </select>
      </div>
      <div>
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          Max Price: {formatPrice(filters.maxPrice)}
        </label>
        <input
          type="range"
          min={0}
          max={5000000}
          step={50000}
          value={filters.maxPrice}
          onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
          className="mt-1 w-full accent-blue-500"
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>$0</span><span>$5M</span>
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Min Beds</label>
        <div className="flex gap-1.5 mt-1">
          {[0, 1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => onChange({ ...filters, minBeds: n })}
              className={`flex-1 rounded-lg py-1 text-sm font-medium transition-colors ${
                filters.minBeds === n
                  ? 'bg-blue-500 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300'
              }`}
            >
              {n === 0 ? 'Any' : `${n}+`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ListingSidebar() {
  const { filteredListings, selectedListing, setSelectedListing, filters, setFilters } = useApp();
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="p-4 bg-white border-b border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search address or city..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-xl border transition-colors ${
              showFilters ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300'
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>
        {showFilters && (
          <FilterPanel filters={filters} onChange={setFilters} />
        )}
        <div className="text-xs text-gray-500 mt-2">
          {filteredListings.length} {filteredListings.length === 1 ? 'listing' : 'listings'} found
        </div>
      </div>

      {/* Listings */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {filteredListings.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Search className="h-8 w-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No listings match your filters</p>
          </div>
        ) : (
          filteredListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              isSelected={selectedListing?.id === listing.id}
              onClick={() => setSelectedListing(listing)}
            />
          ))
        )}
      </div>
    </div>
  );
}
