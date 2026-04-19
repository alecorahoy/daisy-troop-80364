import React, { useEffect, useState } from 'react';
import {
  collection, addDoc, getDocs, deleteDoc, doc, setDoc, updateDoc, getDoc,
  serverTimestamp, orderBy, query,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import DaisyFlower, { PETALS } from '../components/shared/DaisyFlower';
import { Plus, Trash2, X, Cookie, Trophy, Award, UserPlus, Sparkles, ChevronRight } from 'lucide-react';

function todayStr() { return new Date().toISOString().slice(0, 10); }

export default function TroopTab({ isLeader }) {
  const [girls, setGirls] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newGirl, setNewGirl] = useState({ name: '', birthday: '' });
  const [selected, setSelected] = useState(null);
  const [cookieGoal, setCookieGoal] = useState(500);
  const [view, setView] = useState('roster'); // 'roster' | 'cookies'
  const [editingGoal, setEditingGoal] = useState(false);
  const [goalDraft, setGoalDraft] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    const snap = await getDocs(query(collection(db, 'girls'), orderBy('name', 'asc')));
    setGirls(snap.docs.map(d => ({ id: d.id, petals: {}, cookieBoxesSold: 0, ...d.data() })));
    const settings = await getDoc(doc(db, 'troopSettings', 'main'));
    if (settings.exists()) setCookieGoal(settings.data().cookieGoal || 500);
  }

  async function addGirl() {
    if (!newGirl.name.trim()) return;
    await addDoc(collection(db, 'girls'), {
      name: newGirl.name.trim(),
      birthday: newGirl.birthday || '',
      petals: {},
      cookieBoxesSold: 0,
      createdAt: serverTimestamp(),
    });
    setNewGirl({ name: '', birthday: '' });
    setShowForm(false);
    load();
  }

  async function deleteGirl(id) {
    if (!confirm('Remove this Daisy from the troop?')) return;
    await deleteDoc(doc(db, 'girls', id));
    setGirls(g => g.filter(x => x.id !== id));
    if (selected?.id === id) setSelected(null);
  }

  async function togglePetal(girlId, petalKey) {
    const girl = girls.find(g => g.id === girlId);
    if (!girl) return;
    const petals = { ...(girl.petals || {}), [petalKey]: !girl.petals?.[petalKey] };
    if (!petals[petalKey]) delete petals[petalKey];
    await updateDoc(doc(db, 'girls', girlId), { petals });
    setGirls(gs => gs.map(g => g.id === girlId ? { ...g, petals } : g));
    if (selected?.id === girlId) setSelected(s => ({ ...s, petals }));
  }

  async function updateCookies(girlId, delta) {
    const girl = girls.find(g => g.id === girlId);
    if (!girl) return;
    const newCount = Math.max(0, (girl.cookieBoxesSold || 0) + delta);
    await updateDoc(doc(db, 'girls', girlId), { cookieBoxesSold: newCount });
    setGirls(gs => gs.map(g => g.id === girlId ? { ...g, cookieBoxesSold: newCount } : g));
  }

  async function saveGoal() {
    const n = parseInt(goalDraft, 10);
    if (isNaN(n) || n < 0) return;
    await setDoc(doc(db, 'troopSettings', 'main'), { cookieGoal: n }, { merge: true });
    setCookieGoal(n);
    setEditingGoal(false);
  }

  const totalBoxes = girls.reduce((s, g) => s + (g.cookieBoxesSold || 0), 0);
  const goalPct = Math.min(100, Math.round((totalBoxes / Math.max(1, cookieGoal)) * 100));
  const leaderboard = [...girls].sort((a, b) => (b.cookieBoxesSold || 0) - (a.cookieBoxesSold || 0));
  const today = todayStr();
  const isBirthdayWeek = (bday) => {
    if (!bday) return false;
    const [_y, m, d] = bday.split('-').map(Number);
    const now = new Date();
    const bd = new Date(now.getFullYear(), m - 1, d);
    const diff = Math.abs(bd - now) / (1000 * 60 * 60 * 24);
    return diff < 7;
  };

  return (
    <div className="pb-4">
      {/* Sub-tabs */}
      <div className="grid grid-cols-2 gap-2 mb-4 bg-white rounded-2xl shadow p-1">
        <button
          onClick={() => setView('roster')}
          className={`py-2 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-1.5 ${
            view === 'roster' ? 'bg-gradient-to-r from-yellow-400 to-amber-400 text-blue-900 shadow' : 'text-gray-500'
          }`}
        >
          <Award className="w-4 h-4" /> Petals
        </button>
        <button
          onClick={() => setView('cookies')}
          className={`py-2 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-1.5 ${
            view === 'cookies' ? 'bg-gradient-to-r from-yellow-400 to-amber-400 text-blue-900 shadow' : 'text-gray-500'
          }`}
        >
          <Cookie className="w-4 h-4" /> Cookies
        </button>
      </div>

      {view === 'roster' && (
        <>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-blue-900 font-bold text-lg">Our Daisies 🌸</h2>
            {isLeader && (
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-1 bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold px-3 py-1.5 rounded-full text-xs transition shadow"
              >
                {showForm ? <X className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                {showForm ? 'Cancel' : 'Add'}
              </button>
            )}
          </div>

          {isLeader && showForm && (
            <div className="bg-white rounded-2xl shadow p-4 mb-4 animate-[fadeIn_0.3s_ease]">
              <input
                type="text"
                placeholder="First name"
                value={newGirl.name}
                onChange={e => setNewGirl({ ...newGirl, name: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 mb-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
              <label className="text-xs text-gray-500 mb-1 block">Birthday (optional)</label>
              <input
                type="date"
                value={newGirl.birthday}
                onChange={e => setNewGirl({ ...newGirl, birthday: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 mb-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
              <button
                onClick={addGirl}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 rounded-xl transition flex items-center justify-center gap-1"
              >
                <Sparkles className="w-4 h-4" /> Add Daisy
              </button>
            </div>
          )}

          {girls.length === 0 ? (
            <div className="bg-white rounded-2xl shadow p-8 text-center">
              <div className="text-6xl mb-2">🌼</div>
              <p className="text-gray-400 text-sm">
                No Daisies added yet.{isLeader ? ' Tap "Add" to build your roster.' : ''}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {girls.map((girl, i) => {
                const earnedCount = Object.keys(girl.petals || {}).filter(k => girl.petals[k]).length;
                const bday = isBirthdayWeek(girl.birthday);
                return (
                  <button
                    key={girl.id}
                    onClick={() => setSelected(girl)}
                    className="relative bg-white rounded-2xl shadow hover:shadow-lg transition p-3 text-center"
                    style={{ animation: `fadeIn 0.4s ease ${i * 50}ms both` }}
                  >
                    {bday && (
                      <span className="absolute -top-2 -right-2 bg-pink-400 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow animate-bounce">
                        🎂 Birthday!
                      </span>
                    )}
                    <div className="flex justify-center">
                      <DaisyFlower earned={girl.petals || {}} size={100} animatedBloom={false} />
                    </div>
                    <p className="font-bold text-blue-900 mt-1 truncate">{girl.name}</p>
                    <p className="text-[11px] text-yellow-600 font-semibold">
                      {earnedCount}/10 petals earned
                    </p>
                  </button>
                );
              })}
            </div>
          )}

          {/* Selected girl - petal editor */}
          {selected && (
            <div
              className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-[fadeIn_0.2s_ease]"
              onClick={() => setSelected(null)}
            >
              <div
                className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
              >
                <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between">
                  <h3 className="font-bold text-blue-900 text-lg">{selected.name}'s Flower 🌼</h3>
                  <button onClick={() => setSelected(null)}><X className="w-5 h-5 text-gray-400" /></button>
                </div>
                <div className="p-6 text-center">
                  <div className="flex justify-center mb-3">
                    <DaisyFlower earned={selected.petals || {}} size={220} onPetalClick={isLeader ? (k) => togglePetal(selected.id, k) : undefined} />
                  </div>
                  <p className="text-xs text-gray-400">
                    {isLeader ? 'Tap a petal to toggle it earned' : 'Petals earned so far'}
                  </p>
                </div>
                <ul className="divide-y divide-gray-100 px-4 pb-2">
                  {PETALS.map(p => {
                    const earned = !!selected.petals?.[p.key];
                    return (
                      <li key={p.key} className="flex items-center gap-3 py-2.5">
                        <span
                          className="w-5 h-5 rounded-full shrink-0 border-2 border-white shadow-sm"
                          style={{ background: p.color, filter: earned ? 'none' : 'grayscale(0.85) opacity(0.35)' }}
                        />
                        <span className={`text-sm flex-1 ${earned ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
                          {p.law}
                        </span>
                        {isLeader ? (
                          <button
                            onClick={() => togglePetal(selected.id, p.key)}
                            className={`text-xs font-bold px-3 py-1 rounded-full transition ${
                              earned ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}
                          >
                            {earned ? 'Earned ✓' : 'Mark earned'}
                          </button>
                        ) : (
                          earned && <span className="text-green-500 text-sm">✓</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
                {isLeader && (
                  <div className="p-4 border-t border-gray-100">
                    <button
                      onClick={() => deleteGirl(selected.id)}
                      className="w-full text-red-500 hover:text-red-700 text-sm font-semibold py-2 rounded-xl hover:bg-red-50 transition flex items-center justify-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" /> Remove from troop
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {view === 'cookies' && (
        <>
          <h2 className="text-blue-900 font-bold text-lg mb-3">Cookie Season 🍪</h2>

          {/* Progress card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-400 via-rose-400 to-red-400 p-5 shadow-lg mb-5 text-white">
            <div className="absolute -top-2 -right-2 text-5xl opacity-40">🍪</div>
            <p className="text-white/90 text-xs font-bold uppercase tracking-wide">Troop Progress</p>
            <p className="text-4xl font-extrabold mt-1">{totalBoxes} <span className="text-lg font-semibold">/ {cookieGoal}</span></p>
            <p className="text-white/90 text-xs mt-1">boxes sold</p>

            {/* Progress bar */}
            <div className="h-3 bg-white/30 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-700"
                style={{ width: `${goalPct}%` }}
              />
            </div>
            <p className="text-white/90 text-xs mt-1 font-semibold">{goalPct}% of goal</p>

            {isLeader && (
              <div className="mt-3">
                {!editingGoal ? (
                  <button
                    onClick={() => { setEditingGoal(true); setGoalDraft(String(cookieGoal)); }}
                    className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition"
                  >
                    Edit goal
                  </button>
                ) : (
                  <div className="flex gap-2 items-center mt-2">
                    <input
                      type="number"
                      value={goalDraft}
                      onChange={e => setGoalDraft(e.target.value)}
                      className="flex-1 bg-white/90 text-gray-800 rounded-lg px-3 py-1.5 text-sm font-semibold"
                    />
                    <button onClick={saveGoal} className="bg-white text-pink-600 font-bold text-xs px-3 py-1.5 rounded-lg">Save</button>
                    <button onClick={() => setEditingGoal(false)} className="text-white/80 text-xs">Cancel</button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Leaderboard */}
          <h3 className="flex items-center gap-2 text-blue-900 font-bold mb-2">
            <Trophy className="w-4 h-4 text-yellow-500" /> Leaderboard
          </h3>
          {girls.length === 0 ? (
            <div className="bg-white rounded-2xl shadow p-6 text-center">
              <div className="text-4xl mb-1">🌼</div>
              <p className="text-gray-400 text-sm">Add Daisies to the Petals tab first, then track cookies here.</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {leaderboard.map((girl, i) => (
                <li
                  key={girl.id}
                  className="bg-white rounded-2xl shadow p-3 flex items-center gap-3 hover:shadow-md transition"
                  style={{ animation: `fadeIn 0.4s ease ${i * 50}ms both` }}
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-extrabold shrink-0 text-white shadow ${
                    i === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                    i === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                    i === 2 ? 'bg-gradient-to-br from-amber-700 to-amber-900' :
                    'bg-blue-400'
                  }`}>
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-blue-900 truncate">{girl.name}</p>
                    <p className="text-xs text-gray-400">{girl.cookieBoxesSold || 0} boxes sold</p>
                  </div>
                  {isLeader ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateCookies(girl.id, -1)}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 font-bold text-gray-600"
                      >−</button>
                      <span className="font-extrabold text-blue-900 w-10 text-center">{girl.cookieBoxesSold || 0}</span>
                      <button
                        onClick={() => updateCookies(girl.id, 1)}
                        className="w-8 h-8 rounded-full bg-yellow-400 hover:bg-yellow-500 font-bold text-blue-900 shadow"
                      >+</button>
                    </div>
                  ) : (
                    <span className="font-extrabold text-blue-900 text-lg">{girl.cookieBoxesSold || 0}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
