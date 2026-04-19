import React, { useEffect, useState } from 'react';
import {
  collection, addDoc, getDocs, deleteDoc, doc, orderBy, query, serverTimestamp, limit,
} from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { Megaphone, Plus, Trash2, Sparkles, Calendar, Image as ImageIcon, Send, X } from 'lucide-react';

function timeAgo(ts) {
  if (!ts) return '';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  const s = Math.round((Date.now() - d.getTime()) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 2592000) return `${Math.floor(s / 86400)}d ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function HomeTab({ isLeader, onGoto }) {
  const [announcements, setAnnouncements] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [photoCount, setPhotoCount] = useState(0);
  const [newMsg, setNewMsg] = useState('');
  const [posting, setPosting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { refresh(); }, []);

  async function refresh() {
    const [aSnap, eSnap, pSnap] = await Promise.all([
      getDocs(query(collection(db, 'announcements'), orderBy('createdAt', 'desc'), limit(10))),
      getDocs(query(collection(db, 'events'), orderBy('date', 'asc'))),
      getDocs(collection(db, 'photos')),
    ]);
    setAnnouncements(aSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    const today = new Date().toISOString().slice(0, 10);
    setUpcomingEvents(eSnap.docs.map(d => ({ id: d.id, ...d.data() })).filter(e => e.date >= today).slice(0, 3));
    setPhotoCount(pSnap.size);
  }

  async function postAnnouncement() {
    if (!newMsg.trim()) return;
    setPosting(true);
    try {
      await addDoc(collection(db, 'announcements'), {
        message: newMsg.trim(),
        createdAt: serverTimestamp(),
        createdBy: auth.currentUser.uid,
        authorEmail: auth.currentUser.email,
      });
      setNewMsg('');
      setShowForm(false);
      refresh();
    } catch (e) { alert('Error: ' + e.message); }
    setPosting(false);
  }

  async function deleteAnnouncement(id) {
    if (!confirm('Delete this announcement?')) return;
    await deleteDoc(doc(db, 'announcements', id));
    setAnnouncements(a => a.filter(x => x.id !== id));
  }

  return (
    <div className="space-y-6 pb-4">
      {/* Welcome hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-400 p-5 shadow-lg">
        <div className="absolute -top-6 -right-6 text-6xl opacity-30 rotate-12">🌼</div>
        <div className="absolute -bottom-4 -left-4 text-5xl opacity-20">🌸</div>
        <p className="text-blue-900 text-sm font-semibold">Welcome back!</p>
        <h2 className="text-blue-900 text-2xl font-extrabold mt-1 leading-tight">
          Hello, Daisy family 🌻
        </h2>
        <p className="text-blue-900/80 text-sm mt-1">Your troop at a glance.</p>
        <div className="grid grid-cols-3 gap-2 mt-4">
          <button onClick={() => onGoto('photos')} className="bg-white/90 backdrop-blur rounded-xl p-2.5 text-center hover:bg-white transition shadow">
            <ImageIcon className="w-4 h-4 mx-auto text-blue-700" />
            <p className="text-xl font-extrabold text-blue-900 mt-0.5">{photoCount}</p>
            <p className="text-[10px] text-blue-800 font-semibold uppercase tracking-wide">Photos</p>
          </button>
          <button onClick={() => onGoto('events')} className="bg-white/90 backdrop-blur rounded-xl p-2.5 text-center hover:bg-white transition shadow">
            <Calendar className="w-4 h-4 mx-auto text-blue-700" />
            <p className="text-xl font-extrabold text-blue-900 mt-0.5">{upcomingEvents.length}</p>
            <p className="text-[10px] text-blue-800 font-semibold uppercase tracking-wide">Upcoming</p>
          </button>
          <button onClick={() => onGoto('troop')} className="bg-white/90 backdrop-blur rounded-xl p-2.5 text-center hover:bg-white transition shadow">
            <Sparkles className="w-4 h-4 mx-auto text-blue-700" />
            <p className="text-xl font-extrabold text-blue-900 mt-0.5">🌸</p>
            <p className="text-[10px] text-blue-800 font-semibold uppercase tracking-wide">Troop</p>
          </button>
        </div>
      </div>

      {/* Announcements */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="flex items-center gap-2 text-blue-900 font-bold text-lg">
            <Megaphone className="w-5 h-5 text-yellow-500" /> Announcements
          </h3>
          {isLeader && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-1 bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold px-3 py-1.5 rounded-full text-xs transition shadow"
            >
              {showForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              {showForm ? 'Cancel' : 'Post'}
            </button>
          )}
        </div>

        {isLeader && showForm && (
          <div className="bg-white rounded-2xl shadow p-4 mb-3 animate-[fadeIn_0.3s_ease]">
            <textarea
              value={newMsg}
              onChange={e => setNewMsg(e.target.value)}
              placeholder="What would you like to tell the parents?"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 h-24 resize-none focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm"
              maxLength={500}
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-[11px] text-gray-400">{newMsg.length}/500</span>
              <button
                onClick={postAnnouncement}
                disabled={posting || !newMsg.trim()}
                className="flex items-center gap-1 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-bold px-4 py-1.5 rounded-full text-xs transition"
              >
                <Send className="w-3.5 h-3.5" />
                {posting ? 'Posting…' : 'Send to troop'}
              </button>
            </div>
          </div>
        )}

        {announcements.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <Megaphone className="w-10 h-10 text-blue-200 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">No announcements yet. {isLeader && 'Post the first one!'}</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {announcements.map((a, i) => (
              <li
                key={a.id}
                className="bg-white rounded-2xl shadow p-4 relative group hover:shadow-md transition animate-[fadeIn_0.4s_ease]"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-white text-sm shadow shrink-0">
                    🌼
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 text-sm whitespace-pre-wrap leading-relaxed">{a.message}</p>
                    <p className="text-[11px] text-gray-400 mt-1">{timeAgo(a.createdAt)}</p>
                  </div>
                  {isLeader && (
                    <button
                      onClick={() => deleteAnnouncement(a.id)}
                      className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Upcoming events preview */}
      {upcomingEvents.length > 0 && (
        <section>
          <h3 className="flex items-center gap-2 text-blue-900 font-bold text-lg mb-3">
            <Calendar className="w-5 h-5 text-yellow-500" /> What's Coming Up
          </h3>
          <div className="space-y-2">
            {upcomingEvents.map(event => (
              <button
                key={event.id}
                onClick={() => onGoto('events')}
                className="w-full text-left bg-white rounded-2xl shadow p-3 hover:shadow-md transition flex items-center gap-3"
              >
                <div className="flex flex-col items-center bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-xl px-2.5 py-1.5 shadow">
                  <span className="text-[10px] uppercase font-bold leading-none">
                    {new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                  <span className="text-xl font-extrabold leading-none mt-0.5">
                    {new Date(event.date + 'T00:00:00').getDate()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-blue-900 truncate">{event.title}</p>
                  {event.description && <p className="text-xs text-gray-500 truncate">{event.description}</p>}
                </div>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
