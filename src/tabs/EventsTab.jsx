import React, { useEffect, useState } from 'react';
import {
  collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp, orderBy, query,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Calendar, Plus, Trash2, X, Sparkles } from 'lucide-react';

export default function EventsTab({ isLeader }) {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', description: '' });

  useEffect(() => { load(); }, []);

  async function load() {
    const q = query(collection(db, 'events'), orderBy('date', 'asc'));
    const snap = await getDocs(q);
    setEvents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  }

  async function addEvent() {
    if (!newEvent.title || !newEvent.date) return;
    await addDoc(collection(db, 'events'), { ...newEvent, createdAt: serverTimestamp() });
    setNewEvent({ title: '', date: '', description: '' });
    setShowForm(false);
    load();
  }

  async function deleteEvent(id) {
    if (!confirm('Delete this event?')) return;
    await deleteDoc(doc(db, 'events', id));
    setEvents(e => e.filter(x => x.id !== id));
  }

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = events.filter(e => e.date >= today);
  const past = events.filter(e => e.date < today).reverse();

  return (
    <div className="pb-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="flex items-center gap-2 text-blue-900 font-bold text-xl">
          <Calendar className="w-5 h-5 text-yellow-500" /> Events
        </h2>
        {isLeader && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1 bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold px-3 py-1.5 rounded-full text-xs transition shadow"
          >
            {showForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            {showForm ? 'Cancel' : 'New'}
          </button>
        )}
      </div>

      {isLeader && showForm && (
        <div className="bg-white rounded-2xl shadow p-4 mb-5 animate-[fadeIn_0.3s_ease]">
          <input
            type="text"
            placeholder="Event title"
            value={newEvent.title}
            onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 mb-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <input
            type="date"
            value={newEvent.date}
            onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 mb-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <textarea
            placeholder="Description (optional)"
            value={newEvent.description}
            onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 mb-3 focus:ring-2 focus:ring-blue-400 focus:outline-none h-20 resize-none text-sm"
          />
          <button
            onClick={addEvent}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 rounded-xl transition flex items-center justify-center gap-1"
          >
            <Sparkles className="w-4 h-4" /> Create Event
          </button>
        </div>
      )}

      {/* Upcoming */}
      <h3 className="text-xs font-bold uppercase tracking-wide text-blue-700 mb-2">Upcoming</h3>
      {upcoming.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-6 text-center mb-4">
          <div className="text-4xl mb-1">📅</div>
          <p className="text-gray-400 text-sm">No upcoming events.</p>
        </div>
      ) : (
        <div className="space-y-2 mb-5">
          {upcoming.map((event, i) => (
            <div
              key={event.id}
              className="bg-white rounded-2xl shadow p-4 flex items-start gap-3 group hover:shadow-md transition"
              style={{ animation: `fadeIn 0.4s ease ${i * 60}ms both` }}
            >
              <div className="flex flex-col items-center bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-xl px-3 py-2 shadow shrink-0">
                <span className="text-[10px] uppercase font-bold leading-none">
                  {new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' })}
                </span>
                <span className="text-2xl font-extrabold leading-none mt-0.5">
                  {new Date(event.date + 'T00:00:00').getDate()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-blue-700 font-semibold uppercase">
                  {new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long' })}
                </p>
                <h3 className="font-bold text-blue-900">{event.title}</h3>
                {event.description && <p className="text-sm text-gray-500 mt-0.5">{event.description}</p>}
              </div>
              {isLeader && (
                <button
                  onClick={() => deleteEvent(event.id)}
                  className="text-red-400 hover:text-red-600 transition opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Past */}
      {past.length > 0 && (
        <>
          <h3 className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">Past Events</h3>
          <div className="space-y-2 opacity-75">
            {past.map(event => (
              <div key={event.id} className="bg-white/70 rounded-2xl p-3 flex items-center gap-3 group">
                <div className="text-gray-400 text-sm shrink-0 w-14">
                  {new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-600 text-sm truncate">{event.title}</p>
                </div>
                {isLeader && (
                  <button onClick={() => deleteEvent(event.id)} className="text-gray-300 hover:text-red-500 transition">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
