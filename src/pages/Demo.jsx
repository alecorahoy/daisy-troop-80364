import React, { useState } from 'react';
import { Flower2, LogOut, Calendar, Image, Upload, Trash2, Plus } from 'lucide-react';

const samplePhotos = [
  { id: 1, url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b40?w=400&q=80', caption: 'Badge ceremony 🌼' },
  { id: 2, url: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&q=80', caption: 'Cookie sale!' },
  { id: 3, url: 'https://images.unsplash.com/photo-1472162072942-cd5147eb3902?w=400&q=80', caption: 'Nature walk' },
  { id: 4, url: 'https://images.unsplash.com/photo-1536337005238-94b997371b40?w=400&q=80', caption: 'Craft day' },
];

const sampleEvents = [
  { id: 1, date: '2026-04-19', title: 'Cookie Booth Sale', description: 'Stop & Shop, 10am–2pm' },
  { id: 2, date: '2026-04-26', title: 'Badge Workshop', description: 'Community center, Room 4' },
  { id: 3, date: '2026-05-10', title: 'Mother\'s Day Craft', description: 'Make something special!' },
];

function Header({ subtitle }) {
  return (
    <header className="bg-blue-800 text-white shadow-lg">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Flower2 className="w-8 h-8 text-yellow-400" fill="currentColor" />
          <div>
            <h1 className="font-bold text-lg leading-tight">Troop 80364</h1>
            <p className="text-blue-200 text-xs">{subtitle}</p>
          </div>
        </div>
        <button className="flex items-center gap-1 text-blue-200 text-sm">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </header>
  );
}

function TabBar({ tab, setTab }) {
  return (
    <div className="flex gap-2 mb-6">
      <button
        onClick={() => setTab('photos')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${tab === 'photos' ? 'bg-blue-700 text-white' : 'bg-white text-blue-700 border border-blue-200'}`}
      >
        <Image className="w-4 h-4" /> Photos
      </button>
      <button
        onClick={() => setTab('events')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${tab === 'events' ? 'bg-blue-700 text-white' : 'bg-white text-blue-700 border border-blue-200'}`}
      >
        <Calendar className="w-4 h-4" /> Events
      </button>
    </div>
  );
}

function ParentDemo() {
  const [tab, setTab] = useState('photos');
  const [selected, setSelected] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-yellow-50">
      <Header subtitle="Girl Scout Daisy · New Jersey" />
      <div className="max-w-4xl mx-auto px-4 py-6">
        <TabBar tab={tab} setTab={setTab} />
        {tab === 'photos' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {samplePhotos.map(photo => (
              <button key={photo.id} onClick={() => setSelected(photo)}
                className="rounded-xl overflow-hidden shadow bg-white hover:shadow-md transition text-left">
                <img src={photo.url} alt={photo.caption} className="w-full h-40 object-cover" />
                <div className="p-2"><p className="text-xs text-gray-600 truncate">{photo.caption}</p></div>
              </button>
            ))}
          </div>
        )}
        {tab === 'events' && (
          <div className="space-y-3">
            {sampleEvents.map(event => (
              <div key={event.id} className="bg-white rounded-xl shadow p-4">
                <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded">
                  {new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </span>
                <h3 className="font-semibold text-blue-900 mt-2">{event.title}</h3>
                <p className="text-gray-500 text-sm mt-1">{event.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4" onClick={() => setSelected(null)}>
          <div className="max-w-2xl w-full">
            <img src={selected.url} alt={selected.caption} className="w-full rounded-xl shadow-2xl" />
            <p className="text-white text-center mt-3 text-sm">{selected.caption}</p>
            <button onClick={() => setSelected(null)} className="block mx-auto mt-4 text-gray-300 hover:text-white text-sm">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

function LeaderDemo() {
  const [tab, setTab] = useState('photos');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-yellow-50">
      <Header subtitle="Leader Dashboard" />
      <div className="max-w-4xl mx-auto px-4 py-6">
        <TabBar tab={tab} setTab={setTab} />
        {tab === 'photos' && (
          <div>
            <div className="bg-white rounded-xl shadow p-5 mb-6">
              <h2 className="font-bold text-blue-900 mb-3 text-lg">Upload Photo</h2>
              <input type="text" placeholder="Caption (optional)"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3" />
              <button className="flex items-center gap-2 bg-yellow-400 text-blue-900 font-bold px-5 py-2 rounded-lg">
                <Upload className="w-4 h-4" /> Select Photo
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {samplePhotos.map(photo => (
                <div key={photo.id} className="relative group rounded-xl overflow-hidden shadow bg-white">
                  <img src={photo.url} alt={photo.caption} className="w-full h-40 object-cover" />
                  <div className="p-2"><p className="text-xs text-gray-600 truncate">{photo.caption}</p></div>
                  <button className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        {tab === 'events' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-blue-900 text-lg">Upcoming Events</h2>
              <button className="flex items-center gap-1 bg-yellow-400 text-blue-900 font-bold px-4 py-2 rounded-lg text-sm">
                <Plus className="w-4 h-4" /> New Event
              </button>
            </div>
            <div className="space-y-3">
              {sampleEvents.map(event => (
                <div key={event.id} className="bg-white rounded-xl shadow p-4 flex justify-between items-start">
                  <div>
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded">
                      {new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <h3 className="font-semibold text-blue-900 mt-1">{event.title}</h3>
                    <p className="text-gray-500 text-sm mt-1">{event.description}</p>
                  </div>
                  <button className="text-red-400 ml-4"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Demo() {
  const [view, setView] = useState('parent');

  return (
    <div>
      {/* Demo switcher bar */}
      <div className="bg-yellow-400 text-blue-900 text-xs font-bold text-center py-2 flex justify-center gap-4">
        <span>PREVIEW MODE —</span>
        <button onClick={() => setView('parent')} className={`underline ${view === 'parent' ? 'opacity-100' : 'opacity-60'}`}>Parent View</button>
        <span>|</span>
        <button onClick={() => setView('leader')} className={`underline ${view === 'leader' ? 'opacity-100' : 'opacity-60'}`}>Leader View</button>
      </div>
      {view === 'parent' ? <ParentDemo /> : <LeaderDemo />}
    </div>
  );
}
