import { useState } from 'react';
import { X, Home, Camera, MapPin, Box, Phone, Bed, Bath, Square, Calendar, Tag } from 'lucide-react';
import { useApp } from '../context/AppContext';
import PhotoGallery from './modules/PhotoGallery';
import ContactRealtor from './modules/ContactRealtor';
import StreetView from './modules/StreetView';
import RoomTour from './modules/RoomTour';

type Tab = 'details' | 'photos' | 'street' | 'tour' | 'contact';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
}

export default function PropertyPanel() {
  const { selectedListing, setSelectedListing, isPanelOpen, modules } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>('details');

  if (!selectedListing) return null;

  const tabs: { id: Tab; label: string; icon: React.ReactNode; enabled: boolean }[] = (
    [
      { id: 'details' as Tab, label: 'Details', icon: <Home className="h-3.5 w-3.5" />, enabled: true },
      { id: 'photos' as Tab, label: 'Photos', icon: <Camera className="h-3.5 w-3.5" />, enabled: modules.photos },
      { id: 'street' as Tab, label: 'Street View', icon: <MapPin className="h-3.5 w-3.5" />, enabled: modules.streetView },
      { id: 'tour' as Tab, label: '3D Tour', icon: <Box className="h-3.5 w-3.5" />, enabled: modules.roomTour },
      { id: 'contact' as Tab, label: 'Contact', icon: <Phone className="h-3.5 w-3.5" />, enabled: modules.contact },
    ] as { id: Tab; label: string; icon: React.ReactNode; enabled: boolean }[]
  ).filter((t) => t.enabled);

  const listing = selectedListing;

  const statusColor = {
    active: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    sold: 'bg-gray-100 text-gray-600',
  }[listing.status];

  return (
    <div
      className={`fixed right-0 top-0 h-full w-full sm:w-[420px] bg-white shadow-2xl z-[1000] transform transition-transform duration-300 ease-in-out flex flex-col ${
        isPanelOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Header with hero image */}
      <div className="relative h-44 flex-none overflow-hidden">
        <img
          src={listing.photos[0]}
          alt={listing.address}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <button
          onClick={() => setSelectedListing(null)}
          className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-2xl font-bold text-white">{formatPrice(listing.price)}</div>
              <div className="text-white/90 text-sm">{listing.address}</div>
              <div className="text-white/70 text-xs">{listing.city}, {listing.state} {listing.zip}</div>
            </div>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${statusColor}`}>
              {listing.status}
            </span>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="flex border-b border-gray-100 bg-gray-50 flex-none">
        {[
          { icon: <Bed className="h-3.5 w-3.5" />, value: listing.beds, label: 'Beds' },
          { icon: <Bath className="h-3.5 w-3.5" />, value: listing.baths, label: 'Baths' },
          { icon: <Square className="h-3.5 w-3.5" />, value: listing.sqft.toLocaleString(), label: 'Sqft' },
          { icon: <Calendar className="h-3.5 w-3.5" />, value: listing.yearBuilt, label: 'Year' },
        ].map((stat) => (
          <div key={stat.label} className="flex-1 text-center py-2.5">
            <div className="flex items-center justify-center gap-1 text-gray-500 mb-0.5">
              {stat.icon}
            </div>
            <div className="text-sm font-bold text-gray-900">{stat.value}</div>
            <div className="text-xs text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-gray-100 flex-none bg-white">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'details' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 leading-relaxed">{listing.description}</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Type', value: listing.type },
                { label: 'Garage', value: `${listing.garage} car` },
                { label: 'Lot Size', value: listing.lotSize > 0 ? `${listing.lotSize.toLocaleString()} sqft` : 'N/A' },
                { label: 'Days on Market', value: listing.daysOnMarket },
                { label: 'Price/sqft', value: `$${Math.round(listing.price / listing.sqft)}/sqft` },
                { label: 'Year Built', value: listing.yearBuilt },
              ].map(({ label, value }) => (
                <div key={label} className="bg-gray-50 rounded-xl p-3">
                  <div className="text-xs text-gray-400 uppercase tracking-wide">{label}</div>
                  <div className="text-sm font-semibold text-gray-800 mt-0.5 capitalize">{value}</div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl">
              <Tag className="h-4 w-4 text-blue-500 flex-none" />
              <div>
                <div className="text-xs text-blue-600 font-medium">Listed by {listing.realtor.agency}</div>
                <div className="text-xs text-gray-500">{listing.realtor.name} · {listing.realtor.phone}</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'photos' && modules.photos && (
          <PhotoGallery photos={listing.photos} address={listing.address} />
        )}

        {activeTab === 'street' && modules.streetView && (
          <StreetView listing={listing} />
        )}

        {activeTab === 'tour' && modules.roomTour && (
          <RoomTour rooms={listing.roomTours} address={listing.address} />
        )}

        {activeTab === 'contact' && modules.contact && (
          <ContactRealtor realtor={listing.realtor} address={listing.address} />
        )}
      </div>
    </div>
  );
}
