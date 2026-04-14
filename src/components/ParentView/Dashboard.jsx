import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import {
  collection, getDocs, orderBy, query,
} from 'firebase/firestore';
import { auth, db } from '../../firebase/config';
import { Flower2, LogOut, Calendar, Image } from 'lucide-react';

export default function ParentView() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('photos');
  const [photos, setPhotos] = useState([]);
  const [events, setEvents] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => { loadPhotos(); loadEvents(); }, []);

  async function loadPhotos() {
    const q = query(collection(db, 'photos'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    setPhotos(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  }

  async function loadEvents() {
    const q = query(collection(db, 'events'), orderBy('date', 'asc'));
    const snap = await getDocs(q);
    setEvents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  }

  async function handleLogout() {
    await signOut(auth);
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-yellow-50">
      {/* Header */}
      <header className="bg-blue-800 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Flower2 className="w-8 h-8 text-yellow-400" fill="currentColor" />
            <div>
              <h1 className="font-bold text-lg leading-tight">Troop 80364</h1>
              <p className="text-blue-200 text-xs">Girl Scout Daisy · New Jersey</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-1 text-blue-200 hover:text-white text-sm">
            <LogOut className="w-4 h-4" /> Salir
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('photos')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${tab === 'photos' ? 'bg-blue-700 text-white' : 'bg-white text-blue-700 border border-blue-200 hover:bg-blue-50'}`}
          >
            <Image className="w-4 h-4" /> Fotos
          </button>
          <button
            onClick={() => setTab('events')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${tab === 'events' ? 'bg-blue-700 text-white' : 'bg-white text-blue-700 border border-blue-200 hover:bg-blue-50'}`}
          >
            <Calendar className="w-4 h-4" /> Eventos
          </button>
        </div>

        {/* Photos Tab */}
        {tab === 'photos' && (
          <>
            {photos.length === 0 ? (
              <div className="text-center py-16">
                <Flower2 className="w-16 h-16 text-blue-200 mx-auto mb-4" fill="currentColor" />
                <p className="text-gray-400">Aún no hay fotos. ¡Vuelve pronto!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {photos.map(photo => (
                  <button
                    key={photo.id}
                    onClick={() => setSelected(photo)}
                    className="rounded-xl overflow-hidden shadow bg-white hover:shadow-md transition text-left"
                  >
                    <img src={photo.url} alt={photo.caption} className="w-full h-40 object-cover" />
                    <div className="p-2">
                      <p className="text-xs text-gray-600 truncate">{photo.caption}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {/* Events Tab */}
        {tab === 'events' && (
          <>
            {events.length === 0 ? (
              <div className="text-center py-16">
                <Calendar className="w-16 h-16 text-blue-200 mx-auto mb-4" />
                <p className="text-gray-400">No hay eventos programados aún.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {events.map(event => (
                  <div key={event.id} className="bg-white rounded-xl shadow p-4">
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded">
                      {new Date(event.date + 'T00:00:00').toLocaleDateString('es-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                    <h3 className="font-semibold text-blue-900 mt-2">{event.title}</h3>
                    {event.description && <p className="text-gray-500 text-sm mt-1">{event.description}</p>}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelected(null)}
        >
          <div className="max-w-2xl w-full" onClick={e => e.stopPropagation()}>
            <img src={selected.url} alt={selected.caption} className="w-full rounded-xl shadow-2xl" />
            <p className="text-white text-center mt-3 text-sm">{selected.caption}</p>
            <button onClick={() => setSelected(null)} className="block mx-auto mt-4 text-gray-300 hover:text-white text-sm">
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
