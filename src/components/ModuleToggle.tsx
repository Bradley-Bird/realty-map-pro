import { useState } from 'react';
import { Settings, Camera, MapPin, Box, Phone, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { ModuleConfig } from '../types';

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
}

function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-none ${
        checked ? 'bg-blue-600' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-4' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}

const moduleItems: { key: keyof ModuleConfig; label: string; description: string; icon: React.ReactNode }[] = [
  { key: 'photos', label: 'Photo Gallery', description: 'Image carousel with lightbox', icon: <Camera className="h-4 w-4" /> },
  { key: 'streetView', label: 'Street View', description: 'OpenStreetMap + Google Maps', icon: <MapPin className="h-4 w-4" /> },
  { key: 'roomTour', label: '3D Room Tour', description: 'Interactive room explorer', icon: <Box className="h-4 w-4" /> },
  { key: 'contact', label: 'Contact Realtor', description: 'Inquiry form and realtor card', icon: <Phone className="h-4 w-4" /> },
];

export default function ModuleToggle() {
  const { modules, setModules } = useApp();
  const [open, setOpen] = useState(false);

  const toggle = (key: keyof ModuleConfig, value: boolean) => {
    setModules({ ...modules, [key]: value });
  };

  return (
    <>
      {/* Gear button */}
      <button
        onClick={() => setOpen(true)}
        className="absolute top-4 right-4 z-[999] bg-white shadow-lg border border-gray-100 rounded-full p-2.5 hover:bg-gray-50 transition-colors"
        title="Module Settings"
      >
        <Settings className="h-5 w-5 text-gray-600" />
      </button>

      {/* Drawer */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-[1001] bg-black/30 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="fixed top-4 right-4 z-[1002] w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-semibold text-gray-800">Module Settings</span>
              </div>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-3 space-y-1">
              {moduleItems.map(({ key, label, description, icon }) => (
                <div
                  key={key}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className={`p-1.5 rounded-lg ${modules[key] ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                    {icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-800">{label}</div>
                    <div className="text-xs text-gray-400 truncate">{description}</div>
                  </div>
                  <Toggle checked={modules[key]} onChange={(v) => toggle(key, v)} />
                </div>
              ))}
            </div>
            <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
              <p className="text-xs text-gray-400">Toggle modules to show/hide panel tabs</p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
