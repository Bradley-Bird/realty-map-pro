import { useState } from 'react';
import { Box, ChevronRight, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import type { RoomTour as RoomTourType } from '../../types';

interface RoomTourProps {
  rooms: RoomTourType[];
  address: string;
}

export default function RoomTour({ rooms, address }: RoomTourProps) {
  const [activeRoom, setActiveRoom] = useState(rooms[0]);

  return (
    <div className="space-y-3">
      {/* Viewer area */}
      <div className="relative rounded-xl overflow-hidden bg-gray-900 aspect-video flex items-center justify-center">
        <img
          src={activeRoom.thumbnail}
          alt={activeRoom.name}
          className="w-full h-full object-cover opacity-70"
        />
        {/* Overlay UI */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-4 text-center max-w-xs">
            <Box className="h-8 w-8 text-white mx-auto mb-2" />
            <p className="text-white font-semibold text-sm">{activeRoom.name}</p>
            <p className="text-gray-300 text-xs mt-1">{activeRoom.description}</p>
            <p className="text-gray-400 text-xs mt-3">3D tour coming soon</p>
          </div>
        </div>

        {/* Controls */}
        <div className="absolute bottom-3 right-3 flex gap-2">
          <button className="bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-lg transition-colors" title="Zoom in">
            <ZoomIn className="h-4 w-4" />
          </button>
          <button className="bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-lg transition-colors" title="Zoom out">
            <ZoomOut className="h-4 w-4" />
          </button>
          <button className="bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-lg transition-colors" title="Reset view">
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>

        <div className="absolute top-3 left-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
          {address}
        </div>
      </div>

      {/* Room list */}
      <div className="space-y-1">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Select Room</p>
        {rooms.map((room) => (
          <button
            key={room.id}
            onClick={() => setActiveRoom(room)}
            className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all text-left ${
              activeRoom.id === room.id
                ? 'bg-blue-50 border border-blue-200'
                : 'bg-white hover:bg-gray-50 border border-transparent'
            }`}
          >
            <img src={room.thumbnail} alt={room.name} className="h-10 w-14 rounded-lg object-cover flex-none" />
            <div className="flex-1 min-w-0">
              <div className={`text-sm font-medium ${activeRoom.id === room.id ? 'text-blue-700' : 'text-gray-800'}`}>
                {room.name}
              </div>
              <div className="text-xs text-gray-400 truncate">{room.description}</div>
            </div>
            <ChevronRight className={`h-4 w-4 flex-none ${activeRoom.id === room.id ? 'text-blue-500' : 'text-gray-300'}`} />
          </button>
        ))}
      </div>
    </div>
  );
}
