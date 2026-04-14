import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import {
  collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp, orderBy, query,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { auth, db, storage } from '../../firebase/config';
import { Flower2, Upload, Trash2, LogOut, Calendar, Image, Plus, X } from 'lucide-react';

export default function LeaderDashboard() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [tab, setTab] = useState('photos');
  const [photos, setPhotos] = useState([]);
  const [events, setEvents] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState('');
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', description: '' });
  const [message, setMessage] = useState('');

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

  async function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const storageRef = ref(storage, `photos/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      await addDoc(collection(db, 'photos'), {
        url,
        caption: caption || file.name,
        storagePath: storageRef.fullPath,
        createdAt: serverTimestamp(),
      });
      setCaption('');
      setMessage('Foto subida con éxito.');
      loadPhotos();
    } catch (err) {
      setMessage('Error al subir foto: ' + err.message);
    }
    setUploading(false);
  }

  async function deletePhoto(photo) {
    if (!confirm('¿Eliminar esta foto?')) return;
    try {
      if (photo.storagePath) await deleteObject(ref(storage, photo.storagePath));
      await deleteDoc(doc(db, 'photos', photo.id));
      setPhotos(p => p.filter(x => x.id !== photo.id));
    } catch (err) {
      setMessage('Error al eliminar: ' + err.message);
    }
  }

  async function addEvent() {
    if (!newEvent.title || !newEvent.date) return;
    try {
      await addDoc(collection(db, 'events'), { ...newEvent, createdAt: serverTimestamp() });
      setNewEvent({ title: '', date: '', description: '' });
      setShowEventForm(false);
      loadEvents();
    } catch (err) {
      setMessage('Error al crear evento: ' + err.message);
    }
  }

  async function deleteEvent(id) {
    if (!confirm('¿Eliminar este evento?')) return;
    await deleteDoc(doc(db, 'events', id));
    setEvents(e => e.filter(x => x.id !== id));
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
              <p className="text-blue-200 text-xs">Panel de Líder</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-1 text-blue-200 hover:text-white text-sm">
            <LogOut className="w-4 h-4" /> Salir
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {message && (
          <div className="mb-4 bg-blue-100 border border-blue-300 text-blue-800 px-4 py-2 rounded-lg flex justify-between">
            <span>{message}</span>
            <button onClick={() => setMessage('')}><X className="w-4 h-4" /></button>
          </div>
        )}

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
          <div>
            {/* Upload */}
            <div className="bg-white rounded-xl shadow p-5 mb-6">
              <h2 className="font-bold text-blue-900 mb-3 text-lg">Subir Foto</h2>
              <input
                type="text"
                placeholder="Descripción (opcional)"
                value={caption}
                onChange={e => setCaption(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:ring-2 focus:ring-blue-400"
              />
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
              <button
                onClick={() => fileInputRef.current.click()}
                disabled={uploading}
                className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold px-5 py-2 rounded-lg transition disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                {uploading ? 'Subiendo...' : 'Seleccionar Foto'}
              </button>
            </div>

            {/* Gallery */}
            {photos.length === 0 ? (
              <p className="text-center text-gray-400 py-12">No hay fotos aún. ¡Sube la primera!</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {photos.map(photo => (
                  <div key={photo.id} className="relative group rounded-xl overflow-hidden shadow bg-white">
                    <img src={photo.url} alt={photo.caption} className="w-full h-40 object-cover" />
                    <div className="p-2">
                      <p className="text-xs text-gray-600 truncate">{photo.caption}</p>
                    </div>
                    <button
                      onClick={() => deletePhoto(photo)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Events Tab */}
        {tab === 'events' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-blue-900 text-lg">Próximos Eventos</h2>
              <button
                onClick={() => setShowEventForm(!showEventForm)}
                className="flex items-center gap-1 bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold px-4 py-2 rounded-lg transition text-sm"
              >
                <Plus className="w-4 h-4" /> Nuevo Evento
              </button>
            </div>

            {showEventForm && (
              <div className="bg-white rounded-xl shadow p-5 mb-6">
                <h3 className="font-semibold text-blue-800 mb-3">Crear Evento</h3>
                <input
                  type="text"
                  placeholder="Título del evento"
                  value={newEvent.title}
                  onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:ring-2 focus:ring-blue-400"
                />
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:ring-2 focus:ring-blue-400"
                />
                <textarea
                  placeholder="Descripción (opcional)"
                  value={newEvent.description}
                  onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:ring-2 focus:ring-blue-400 h-24 resize-none"
                />
                <div className="flex gap-2">
                  <button onClick={addEvent} className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-5 py-2 rounded-lg transition">
                    Guardar
                  </button>
                  <button onClick={() => setShowEventForm(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-5 py-2 rounded-lg transition">
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {events.length === 0 ? (
              <p className="text-center text-gray-400 py-12">No hay eventos programados.</p>
            ) : (
              <div className="space-y-3">
                {events.map(event => (
                  <div key={event.id} className="bg-white rounded-xl shadow p-4 flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded">
                          {new Date(event.date + 'T00:00:00').toLocaleDateString('es-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <h3 className="font-semibold text-blue-900 mt-1">{event.title}</h3>
                      {event.description && <p className="text-gray-500 text-sm mt-1">{event.description}</p>}
                    </div>
                    <button onClick={() => deleteEvent(event.id)} className="text-red-400 hover:text-red-600 transition ml-4">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
