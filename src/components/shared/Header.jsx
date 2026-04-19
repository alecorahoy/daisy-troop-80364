import React from 'react';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Flower2, LogOut } from 'lucide-react';
import { auth } from '../../firebase/config';

export default function Header({ subtitle }) {
  const navigate = useNavigate();
  async function handleLogout() {
    await signOut(auth);
    navigate('/login');
  }
  return (
    <header className="bg-gradient-to-r from-blue-800 via-blue-700 to-blue-800 text-white shadow-lg sticky top-0 z-30">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Flower2 className="w-9 h-9 text-yellow-400 drop-shadow" fill="currentColor" />
            <span className="absolute -top-0.5 -right-0.5 text-[9px]">✨</span>
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Troop 80364</h1>
            <p className="text-blue-200 text-[11px]">{subtitle || 'Girl Scout Daisy · New Jersey'}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 text-blue-200 hover:text-white text-xs py-1.5 px-2 rounded-lg hover:bg-white/10 transition"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
