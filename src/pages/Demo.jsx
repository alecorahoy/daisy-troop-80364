import React, { useState } from 'react';
import {
  Flower2, LogOut, Home, Image as ImageIcon, Calendar, Megaphone, Trash2, Plus,
  Upload, Heart, Cookie, Trophy, Award, UserPlus, Sparkles, Send,
} from 'lucide-react';
import DaisyFlower, { PETALS } from '../components/shared/DaisyFlower';

const sampleAnnouncements = [
  { id: 1, message: 'Reminder: Cookie booth this Saturday at Stop & Shop, 10am–2pm. Please sign up! 🍪', ago: 'just now' },
  { id: 2, message: 'Our troop raised $340 at the bake sale! Thank you all 🌟', ago: '2d ago' },
];

const samplePhotos = [
  { id: 1, url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b40?w=400&q=80', caption: 'Badge ceremony 🌼', hearts: 7 },
  { id: 2, url: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&q=80', caption: 'Cookie sale!', hearts: 12 },
  { id: 3, url: 'https://images.unsplash.com/photo-1472162072942-cd5147eb3902?w=400&q=80', caption: 'Nature walk', hearts: 4 },
  { id: 4, url: 'https://images.unsplash.com/photo-1536337005238-94b997371b40?w=400&q=80', caption: 'Craft day', hearts: 9 },
];

const sampleEvents = [
  { id: 1, date: '2026-04-25', title: 'Cookie Booth Sale', description: 'Stop & Shop, 10am–2pm' },
  { id: 2, date: '2026-04-26', title: 'Badge Workshop', description: 'Community center, Room 4' },
  { id: 3, date: '2026-05-10', title: "Mother's Day Craft", description: 'Make something special!' },
];

const sampleGirls = [
  { id: 1, name: 'Ava',    petals: { yellow: true, springGreen: true, red: true, lightBlue: true }, cookieBoxesSold: 42, birthday: '' },
  { id: 2, name: 'Lily',   petals: { yellow: true, springGreen: true, red: true, lightBlue: true, orange: true, magenta: true, gold: true }, cookieBoxesSold: 58, birthday: '' },
  { id: 3, name: 'Sofia',  petals: { yellow: true, springGreen: true, gold: true }, cookieBoxesSold: 21, birthday: '' },
  { id: 4, name: 'Emma',   petals: { yellow: true, springGreen: true, red: true, orange: true, magenta: true, violet: true, rose: true, skyBlue: true, gold: true, lightBlue: true }, cookieBoxesSold: 73, birthday: '' },
  { id: 5, name: 'Maya',   petals: { yellow: true, gold: true }, cookieBoxesSold: 15, birthday: '' },
  { id: 6, name: 'Zoe',    petals: { yellow: true, springGreen: true, red: true, orange: true, magenta: true }, cookieBoxesSold: 36, birthday: '' },
];

function Header({ subtitle }) {
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
            <p className="text-blue-200 text-[11px]">{subtitle}</p>
          </div>
        </div>
        <button className="flex items-center gap-1 text-blue-200 text-xs py-1.5 px-2 rounded-lg hover:bg-white/10 transition">
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}

function BottomNav({ active, onChange }) {
  const tabs = [
    { id: 'home', label: 'Home', Icon: Home },
    { id: 'photos', label: 'Photos', Icon: ImageIcon },
    { id: 'events', label: 'Events', Icon: Calendar },
    { id: 'troop', label: 'Troop', Icon: Flower2 },
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-40">
      <div className="max-w-4xl mx-auto grid grid-cols-4">
        {tabs.map(({ id, label, Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={`flex flex-col items-center justify-center py-2.5 relative transition-colors ${
                isActive ? 'text-blue-700' : 'text-gray-400'
              }`}
            >
              {isActive && <span className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-10 bg-yellow-400 rounded-full" />}
              <Icon className={`w-6 h-6 ${isActive ? 'scale-110' : ''}`} fill={isActive && id === 'troop' ? 'currentColor' : 'none'} />
              <span className="text-[10px] font-semibold mt-0.5 tracking-wide uppercase">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function HomeDemo({ isLeader, onGoto }) {
  return (
    <div className="space-y-6 pb-4">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-400 p-5 shadow-lg">
        <div className="absolute -top-6 -right-6 text-6xl opacity-30 rotate-12">🌼</div>
        <div className="absolute -bottom-4 -left-4 text-5xl opacity-20">🌸</div>
        <p className="text-blue-900 text-sm font-semibold">Welcome back!</p>
        <h2 className="text-blue-900 text-2xl font-extrabold mt-1 leading-tight">Hello, Daisy family 🌻</h2>
        <p className="text-blue-900/80 text-sm mt-1">Your troop at a glance.</p>
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="bg-white/90 rounded-xl p-2.5 text-center shadow">
            <ImageIcon className="w-4 h-4 mx-auto text-blue-700" />
            <p className="text-xl font-extrabold text-blue-900 mt-0.5">{samplePhotos.length}</p>
            <p className="text-[10px] text-blue-800 font-semibold uppercase">Photos</p>
          </div>
          <div className="bg-white/90 rounded-xl p-2.5 text-center shadow">
            <Calendar className="w-4 h-4 mx-auto text-blue-700" />
            <p className="text-xl font-extrabold text-blue-900 mt-0.5">{sampleEvents.length}</p>
            <p className="text-[10px] text-blue-800 font-semibold uppercase">Upcoming</p>
          </div>
          <div className="bg-white/90 rounded-xl p-2.5 text-center shadow">
            <Sparkles className="w-4 h-4 mx-auto text-blue-700" />
            <p className="text-xl font-extrabold text-blue-900 mt-0.5">🌸</p>
            <p className="text-[10px] text-blue-800 font-semibold uppercase">Troop</p>
          </div>
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="flex items-center gap-2 text-blue-900 font-bold text-lg">
            <Megaphone className="w-5 h-5 text-yellow-500" /> Announcements
          </h3>
          {isLeader && (
            <button className="flex items-center gap-1 bg-yellow-400 text-blue-900 font-bold px-3 py-1.5 rounded-full text-xs shadow">
              <Plus className="w-3.5 h-3.5" /> Post
            </button>
          )}
        </div>
        <ul className="space-y-2">
          {sampleAnnouncements.map(a => (
            <li key={a.id} className="bg-white rounded-2xl shadow p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-white text-sm shadow shrink-0">🌼</div>
                <div className="flex-1">
                  <p className="text-gray-800 text-sm leading-relaxed">{a.message}</p>
                  <p className="text-[11px] text-gray-400 mt-1">{a.ago}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="flex items-center gap-2 text-blue-900 font-bold text-lg mb-3">
          <Calendar className="w-5 h-5 text-yellow-500" /> What's Coming Up
        </h3>
        <div className="space-y-2">
          {sampleEvents.slice(0, 2).map(event => (
            <div key={event.id} className="w-full text-left bg-white rounded-2xl shadow p-3 flex items-center gap-3">
              <div className="flex flex-col items-center bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-xl px-2.5 py-1.5 shadow">
                <span className="text-[10px] uppercase font-bold leading-none">{new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' })}</span>
                <span className="text-xl font-extrabold leading-none mt-0.5">{new Date(event.date + 'T00:00:00').getDate()}</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-blue-900">{event.title}</p>
                <p className="text-xs text-gray-500">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function PhotosDemo({ isLeader }) {
  return (
    <div className="pb-4">
      <div className="bg-white rounded-2xl shadow p-4 mb-5">
        <h2 className="font-bold text-blue-900 mb-2 flex items-center gap-2"><Upload className="w-5 h-5 text-yellow-500" /> Share a Photo</h2>
        <input type="text" placeholder="Caption (optional)" className="w-full border border-gray-200 rounded-xl px-3 py-2 mb-3" />
        <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-amber-400 text-blue-900 font-bold px-5 py-2.5 rounded-xl shadow">
          <Upload className="w-4 h-4" /> Choose a photo
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {samplePhotos.map(photo => (
          <div key={photo.id} className="relative rounded-2xl overflow-hidden shadow bg-white">
            <img src={photo.url} alt={photo.caption} className="w-full h-36 object-cover" />
            <div className="p-2"><p className="text-xs text-gray-600 truncate">{photo.caption}</p></div>
            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-white/90 px-2 py-0.5 rounded-full text-xs font-bold text-gray-600">
              <Heart className="w-3.5 h-3.5" /> {photo.hearts}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EventsDemo({ isLeader }) {
  return (
    <div className="pb-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="flex items-center gap-2 text-blue-900 font-bold text-xl">
          <Calendar className="w-5 h-5 text-yellow-500" /> Events
        </h2>
        {isLeader && (
          <button className="flex items-center gap-1 bg-yellow-400 text-blue-900 font-bold px-3 py-1.5 rounded-full text-xs shadow">
            <Plus className="w-3.5 h-3.5" /> New
          </button>
        )}
      </div>
      <h3 className="text-xs font-bold uppercase text-blue-700 mb-2">Upcoming</h3>
      <div className="space-y-2">
        {sampleEvents.map(event => (
          <div key={event.id} className="bg-white rounded-2xl shadow p-4 flex items-start gap-3">
            <div className="flex flex-col items-center bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-xl px-3 py-2 shadow">
              <span className="text-[10px] uppercase font-bold">{new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' })}</span>
              <span className="text-2xl font-extrabold">{new Date(event.date + 'T00:00:00').getDate()}</span>
            </div>
            <div className="flex-1">
              <p className="text-[11px] text-blue-700 font-semibold uppercase">{new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long' })}</p>
              <h3 className="font-bold text-blue-900">{event.title}</h3>
              <p className="text-sm text-gray-500">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TroopDemo({ isLeader }) {
  const [view, setView] = useState('roster');
  const [selected, setSelected] = useState(null);
  const totalBoxes = sampleGirls.reduce((s, g) => s + g.cookieBoxesSold, 0);
  const goal = 300;
  const leaderboard = [...sampleGirls].sort((a, b) => b.cookieBoxesSold - a.cookieBoxesSold);

  return (
    <div className="pb-4">
      <div className="grid grid-cols-2 gap-2 mb-4 bg-white rounded-2xl shadow p-1">
        <button onClick={() => setView('roster')} className={`py-2 rounded-xl font-semibold text-sm flex items-center justify-center gap-1.5 ${view === 'roster' ? 'bg-gradient-to-r from-yellow-400 to-amber-400 text-blue-900 shadow' : 'text-gray-500'}`}>
          <Award className="w-4 h-4" /> Petals
        </button>
        <button onClick={() => setView('cookies')} className={`py-2 rounded-xl font-semibold text-sm flex items-center justify-center gap-1.5 ${view === 'cookies' ? 'bg-gradient-to-r from-yellow-400 to-amber-400 text-blue-900 shadow' : 'text-gray-500'}`}>
          <Cookie className="w-4 h-4" /> Cookies
        </button>
      </div>

      {view === 'roster' && (
        <>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-blue-900 font-bold text-lg">Our Daisies 🌸</h2>
            {isLeader && (
              <button className="flex items-center gap-1 bg-yellow-400 text-blue-900 font-bold px-3 py-1.5 rounded-full text-xs shadow">
                <UserPlus className="w-3.5 h-3.5" /> Add
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {sampleGirls.map(girl => {
              const earned = Object.keys(girl.petals).filter(k => girl.petals[k]).length;
              return (
                <button key={girl.id} onClick={() => setSelected(girl)} className="bg-white rounded-2xl shadow p-3 text-center hover:shadow-lg transition">
                  <div className="flex justify-center"><DaisyFlower earned={girl.petals} size={100} animatedBloom={false} /></div>
                  <p className="font-bold text-blue-900 mt-1">{girl.name}</p>
                  <p className="text-[11px] text-yellow-600 font-semibold">{earned}/10 petals earned</p>
                </button>
              );
            })}
          </div>
          {selected && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setSelected(null)}>
              <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between">
                  <h3 className="font-bold text-blue-900 text-lg">{selected.name}'s Flower 🌼</h3>
                  <button onClick={() => setSelected(null)}>✕</button>
                </div>
                <div className="p-6 text-center">
                  <div className="flex justify-center mb-3"><DaisyFlower earned={selected.petals} size={220} /></div>
                </div>
                <ul className="divide-y divide-gray-100 px-4 pb-4">
                  {PETALS.map(p => {
                    const e = !!selected.petals[p.key];
                    return (
                      <li key={p.key} className="flex items-center gap-3 py-2.5">
                        <span className="w-5 h-5 rounded-full border-2 border-white shadow-sm" style={{ background: p.color, filter: e ? 'none' : 'grayscale(0.85) opacity(0.35)' }} />
                        <span className={`text-sm flex-1 ${e ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>{p.law}</span>
                        {e && <span className="text-green-500">✓</span>}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          )}
        </>
      )}

      {view === 'cookies' && (
        <>
          <h2 className="text-blue-900 font-bold text-lg mb-3">Cookie Season 🍪</h2>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-400 via-rose-400 to-red-400 p-5 shadow-lg mb-5 text-white">
            <div className="absolute -top-2 -right-2 text-5xl opacity-40">🍪</div>
            <p className="text-white/90 text-xs font-bold uppercase">Troop Progress</p>
            <p className="text-4xl font-extrabold mt-1">{totalBoxes} <span className="text-lg font-semibold">/ {goal}</span></p>
            <p className="text-white/90 text-xs">boxes sold</p>
            <div className="h-3 bg-white/30 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-white rounded-full" style={{ width: `${Math.min(100, Math.round((totalBoxes / goal) * 100))}%` }} />
            </div>
            <p className="text-white/90 text-xs mt-1 font-semibold">{Math.min(100, Math.round((totalBoxes / goal) * 100))}% of goal</p>
          </div>
          <h3 className="flex items-center gap-2 text-blue-900 font-bold mb-2"><Trophy className="w-4 h-4 text-yellow-500" /> Leaderboard</h3>
          <ul className="space-y-2">
            {leaderboard.map((girl, i) => (
              <li key={girl.id} className="bg-white rounded-2xl shadow p-3 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-white shadow ${
                  i === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                  i === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                  i === 2 ? 'bg-gradient-to-br from-amber-700 to-amber-900' :
                  'bg-blue-400'
                }`}>
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-blue-900">{girl.name}</p>
                  <p className="text-xs text-gray-400">{girl.cookieBoxesSold} boxes sold</p>
                </div>
                <span className="font-extrabold text-blue-900 text-lg">{girl.cookieBoxesSold}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default function Demo() {
  const [role, setRole] = useState('parent');
  const [tab, setTab] = useState('home');
  const isLeader = role === 'leader';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50">
      <div className="bg-yellow-400 text-blue-900 text-xs font-bold text-center py-2 flex justify-center gap-4">
        <span>PREVIEW MODE —</span>
        <button onClick={() => setRole('parent')} className={`underline ${role === 'parent' ? 'opacity-100' : 'opacity-60'}`}>As Parent</button>
        <span>|</span>
        <button onClick={() => setRole('leader')} className={`underline ${role === 'leader' ? 'opacity-100' : 'opacity-60'}`}>As Leader</button>
      </div>
      <Header subtitle={isLeader ? 'Leader · New Jersey' : 'Girl Scout Daisy · New Jersey'} />
      <main className="max-w-4xl mx-auto px-4 py-5 pb-24">
        {tab === 'home'   && <HomeDemo isLeader={isLeader} onGoto={setTab} />}
        {tab === 'photos' && <PhotosDemo isLeader={isLeader} />}
        {tab === 'events' && <EventsDemo isLeader={isLeader} />}
        {tab === 'troop'  && <TroopDemo isLeader={isLeader} />}
      </main>
      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}
