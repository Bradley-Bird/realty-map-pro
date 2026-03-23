import { ExternalLink, Map } from 'lucide-react';
import type { PropertyListing } from '../../types';

interface StreetViewProps {
  listing: PropertyListing;
}

export default function StreetView({ listing }: StreetViewProps) {
  const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${listing.lng - 0.003},${listing.lat - 0.002},${listing.lng + 0.003},${listing.lat + 0.002}&layer=mapnik&marker=${listing.lat},${listing.lng}`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${listing.lat},${listing.lng}`;
  const googleStreetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${listing.lat},${listing.lng}`;

  return (
    <div className="space-y-3">
      <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
        <iframe
          src={osmUrl}
          title={`Map of ${listing.address}`}
          className="w-full h-56 border-0"
          loading="lazy"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <a
          href={googleStreetViewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
        >
          <Map className="h-4 w-4" />
          Street View
        </a>
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 text-sm font-medium py-2.5 rounded-xl transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
          Google Maps
        </a>
      </div>

      <div className="text-xs text-gray-400 text-center">
        Map data © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="underline">OpenStreetMap</a> contributors
      </div>
    </div>
  );
}
