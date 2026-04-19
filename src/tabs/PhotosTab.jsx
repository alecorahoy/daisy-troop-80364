import React, { useState, useEffect, useRef } from 'react';
import {
  collection, addDoc, getDocs, deleteDoc, doc, setDoc, deleteDoc as delDoc,
  serverTimestamp, orderBy, query, getDoc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { auth, db, storage } from '../firebase/config';
import { compressImage } from '../utils/compressImage';
import { Upload, Trash2, Heart, X, ImagePlus } from 'lucide-react';

export default function PhotosTab({ isLeader }) {
  const fileInputRef = useRef(null);
  const [photos, setPhotos] = useState([]);
  const [selected, setSelected] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState('');
  const [message, setMessage] = useState('');
  const [hearts, setHearts] = useState({}); // photoId -> { count, mine }

  useEffect(() => { load(); }, []);

  async function load() {
    const q = query(collection(db, 'photos'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    setPhotos(list);
    // Load heart counts for each photo in parallel
    const myUid = auth.currentUser?.uid;
    const entries = await Promise.all(
      list.map(async p => {
        const rSnap = await getDocs(collection(db, 'photos', p.id, 'reactions'));
        const mine = myUid && rSnap.docs.some(d => d.id === myUid);
        return [p.id, { count: rSnap.size, mine }];
      })
    );
    setHearts(Object.fromEntries(entries));
  }

  async function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setMessage('');
    try {
      const compressed = await compressImage(file);
      const storageRef = ref(storage, `photos/${Date.now()}_${compressed.name}`);
      await uploadBytes(storageRef, compressed);
      const url = await getDownloadURL(storageRef);
      await addDoc(collection(db, 'photos'), {
        url,
        caption: caption || '',
        storagePath: storageRef.fullPath,
        uploadedBy: auth.currentUser.uid,
        uploaderEmail: auth.currentUser.email,
        createdAt: serverTimestamp(),
      });
      setCaption('');
      setMessage('Photo uploaded! 🎉');
      load();
    } catch (err) { setMessage('Error: ' + err.message); }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function deletePhoto(photo) {
    if (!confirm('Delete this photo?')) return;
    try {
      if (photo.storagePath) { try { await deleteObject(ref(storage, photo.storagePath)); } catch (_) {} }
      await deleteDoc(doc(db, 'photos', photo.id));
      setPhotos(p => p.filter(x => x.id !== photo.id));
      if (selected?.id === photo.id) setSelected(null);
    } catch (err) { setMessage('Error: ' + err.message); }
  }

  async function toggleHeart(photoId) {
    const uid = auth.currentUser.uid;
    const refDoc = doc(db, 'photos', photoId, 'reactions', uid);
    const cur = hearts[photoId] || { count: 0, mine: false };
    // Optimistic update
    setHearts(h => ({ ...h, [photoId]: { count: cur.count + (cur.mine ? -1 : 1), mine: !cur.mine } }));
    try {
      if (cur.mine) await delDoc(refDoc);
      else await setDoc(refDoc, { createdAt: serverTimestamp() });
    } catch (e) {
      // Revert
      setHearts(h => ({ ...h, [photoId]: cur }));
    }
  }

  const myUid = auth.currentUser?.uid;
  const canDelete = (photo) => photo.uploadedBy === myUid || isLeader;

  return (
    <div className="pb-4">
      {message && (
        <div className="mb-4 bg-blue-50 border border-blue-200 text-blue-800 px-4 py-2 rounded-xl flex justify-between items-center animate-[fadeIn_0.3s_ease]">
          <span className="text-sm">{message}</span>
          <button onClick={() => setMessage('')}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Upload */}
      <div className="bg-white rounded-2xl shadow p-4 mb-5">
        <h2 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
          <ImagePlus className="w-5 h-5 text-yellow-500" /> Share a Photo
        </h2>
        <input
          type="text"
          placeholder="Caption (optional)"
          value={caption}
          onChange={e => setCaption(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 mb-3 focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm"
        />
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        <button
          onClick={() => fileInputRef.current.click()}
          disabled={uploading}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-500 hover:to-amber-500 text-blue-900 font-bold px-5 py-2.5 rounded-xl transition disabled:opacity-50 shadow"
        >
          <Upload className="w-4 h-4" />
          {uploading ? 'Uploading…' : 'Choose a photo'}
        </button>
      </div>

      {/* Gallery */}
      {photos.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-2">📸</div>
          <p className="text-gray-400 text-sm">No photos yet. Be the first!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {photos.map((photo, i) => {
            const h = hearts[photo.id] || { count: 0, mine: false };
            return (
              <div
                key={photo.id}
                className="relative group rounded-2xl overflow-hidden shadow bg-white hover:shadow-lg transition"
                style={{ animation: `fadeIn 0.4s ease ${i * 40}ms both` }}
              >
                <button onClick={() => setSelected(photo)} className="block w-full text-left">
                  <img src={photo.url} alt={photo.caption} className="w-full h-36 object-cover" />
                  {photo.caption && (
                    <div className="p-2">
                      <p className="text-xs text-gray-600 truncate">{photo.caption}</p>
                    </div>
                  )}
                </button>
                {/* Heart button */}
                <button
                  onClick={() => toggleHeart(photo.id)}
                  className={`absolute bottom-2 left-2 flex items-center gap-1 backdrop-blur px-2 py-0.5 rounded-full text-xs font-bold transition ${
                    h.mine ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-600 hover:bg-white'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${h.mine ? 'fill-current' : ''}`} />
                  {h.count > 0 && <span>{h.count}</span>}
                </button>
                {canDelete(photo) && (
                  <button
                    onClick={() => deletePhoto(photo)}
                    title="Delete"
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4 animate-[fadeIn_0.2s_ease]"
          onClick={() => setSelected(null)}
        >
          <div className="max-w-2xl w-full" onClick={e => e.stopPropagation()}>
            <img src={selected.url} alt={selected.caption} className="w-full rounded-2xl shadow-2xl" />
            {selected.caption && <p className="text-white text-center mt-3 text-sm">{selected.caption}</p>}
            <button onClick={() => setSelected(null)} className="block mx-auto mt-4 text-gray-300 hover:text-white text-sm">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
