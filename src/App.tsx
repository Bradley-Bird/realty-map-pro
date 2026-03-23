import { useState } from 'react';
import { MapPin, Menu, X } from 'lucide-react';
import { AppProvider } from './context/AppContext';
import PropertyMap from './components/PropertyMap';
import ListingSidebar from './components/ListingSidebar';
import PropertyPanel from './components/PropertyPanel';
import ModuleToggle from './components/ModuleToggle';
import SignInModal from './components/SignInModal';

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-[998] bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:relative z-[999] lg:z-auto
          h-full w-80 flex-none
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          shadow-xl lg:shadow-none
        `}
      >
        <ListingSidebar />
      </div>

      {/* Map area */}
      <div className="relative flex-1 h-full">
        {/* Mobile top bar */}
        <div className="absolute top-0 left-0 right-0 z-[997] lg:hidden flex items-center gap-2 p-3 bg-white/90 backdrop-blur-sm border-b border-gray-100">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl bg-white border border-gray-200 shadow-sm"
          >
            {sidebarOpen ? <X className="h-5 w-5 text-gray-600" /> : <Menu className="h-5 w-5 text-gray-600" />}
          </button>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-5 w-5 text-blue-600" />
            <span className="font-bold text-gray-900">RealtyMap Pro</span>
          </div>
        </div>

        {/* Desktop logo */}
        <div className="absolute top-4 left-4 z-[997] hidden lg:flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-md border border-gray-100">
          <MapPin className="h-5 w-5 text-blue-600" />
          <span className="font-bold text-gray-900 text-sm">RealtyMap Pro</span>
          <span className="text-xs text-gray-400 ml-1">Austin, TX</span>
        </div>

        <PropertyMap />
        <ModuleToggle />
        <PropertyPanel />
      </div>
      <SignInModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppLayout />
    </AppProvider>
  );
}
