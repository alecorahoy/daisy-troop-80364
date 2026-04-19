import React from 'react';
import { Home, Image, Calendar, Flower2 } from 'lucide-react';

const tabs = [
  { id: 'home',   label: 'Home',   Icon: Home },
  { id: 'photos', label: 'Photos', Icon: Image },
  { id: 'events', label: 'Events', Icon: Calendar },
  { id: 'troop',  label: 'Troop',  Icon: Flower2 },
];

export default function BottomNav({ active, onChange }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-40 safe-bottom">
      <div className="max-w-4xl mx-auto grid grid-cols-4">
        {tabs.map(({ id, label, Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={`flex flex-col items-center justify-center py-2.5 pb-safe relative transition-colors ${
                isActive ? 'text-blue-700' : 'text-gray-400 hover:text-blue-500'
              }`}
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-10 bg-yellow-400 rounded-full" />
              )}
              <Icon
                className={`w-6 h-6 transition-transform ${isActive ? 'scale-110' : ''}`}
                fill={isActive && id === 'troop' ? 'currentColor' : 'none'}
              />
              <span className="text-[10px] font-semibold mt-0.5 tracking-wide uppercase">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
