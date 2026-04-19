import React, { useState } from 'react';
import Header from './shared/Header';
import BottomNav from './shared/BottomNav';
import HomeTab from '../tabs/HomeTab';
import PhotosTab from '../tabs/PhotosTab';
import EventsTab from '../tabs/EventsTab';
import TroopTab from '../tabs/TroopTab';
import { useAuth } from '../contexts/AuthContext';

export default function AppShell() {
  const { userRole } = useAuth();
  const isLeader = userRole === 'leader';
  const [tab, setTab] = useState('home');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50">
      <Header subtitle={isLeader ? 'Leader · New Jersey' : 'Girl Scout Daisy · New Jersey'} />

      <main className="max-w-4xl mx-auto px-4 py-5 pb-24">
        {tab === 'home'   && <HomeTab   isLeader={isLeader} onGoto={setTab} />}
        {tab === 'photos' && <PhotosTab isLeader={isLeader} />}
        {tab === 'events' && <EventsTab isLeader={isLeader} />}
        {tab === 'troop'  && <TroopTab  isLeader={isLeader} />}
      </main>

      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}
