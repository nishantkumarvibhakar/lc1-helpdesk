import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { NoticeMarquee } from './components/NoticeMarquee';
import { NoticeDetailModal } from './components/NoticeDetailModal';
import { WelcomePosterModal } from './components/WelcomePosterModal';

import { Home } from './pages/Home';
import { RaiseTicket } from './pages/RaiseTicket';
import { TrackTicket } from './pages/TrackTicket';
import { Dashboard } from './pages/Dashboard';
import { Announcements } from './pages/Announcements';
import { FAQ } from './pages/FAQ';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { api } from './services/api';

function AppContent() {
  const [notices, setNotices] = useState([]);
  const [selectedNotice, setSelectedNotice] = useState(null);
  
  // Welcome Poster popup on website open
  const [showPoster, setShowPoster] = useState(true);

  useEffect(() => {
    async function loadNotices() {
      try {
        const res = await api.getNotices();
        setNotices(res.notices || []);
      } catch (err) {
        console.error('Failed to load notices for marquee:', err);
      }
    }
    loadNotices();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/80 text-slate-900 selection:bg-du-gold selection:text-du-navy relative">
      {/* Prominent & Bright Full-Website Candidate Background */}
      <div 
        className="fixed inset-0 pointer-events-none bg-cover bg-top md:bg-[center_top_8%] bg-fixed z-0 opacity-30 brightness-110 contrast-105"
        style={{ backgroundImage: `url('/images/prashant-speaking-bg.jpg')` }}
      ></div>
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-slate-950/15 via-white/40 to-slate-100/70"></div>

      {/* Welcome / Campaign Poster Popup on initial website open */}
      <WelcomePosterModal
        isOpen={showPoster}
        onClose={() => setShowPoster(false)}
      />

      {/* Notice & Event Detail Modal (Opens when user clicks any announcement) */}
      <NoticeDetailModal
        notice={selectedNotice}
        onClose={() => setSelectedNotice(null)}
      />

      {/* Dynamic Announcement Marquee (Only renders if active notices exist) */}
      <NoticeMarquee 
        notices={notices} 
        onSelectNotice={(notice) => setSelectedNotice(notice)}
      />

      {/* Top Navbar */}
      <Navbar />

      {/* Main Page Body with Error Boundary */}
      <main className="flex-grow relative z-10">
        <ErrorBoundary>
          <Routes>
            <Route 
              path="/" 
              element={
                <Home 
                  onSelectNotice={(n) => setSelectedNotice(n)} 
                  onOpenPoster={() => setShowPoster(true)}
                />
              } 
            />
            <Route path="/raise-ticket" element={<RaiseTicket />} />
            <Route path="/track" element={<TrackTicket />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/announcements" element={<Announcements onSelectNotice={(n) => setSelectedNotice(n)} />} />
            <Route path="/notices" element={<Announcements onSelectNotice={(n) => setSelectedNotice(n)} />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </ErrorBoundary>
      </main>

      {/* Official Footer */}
      <Footer onOpenPoster={() => setShowPoster(true)} />
    </div>
  );
}

export function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
