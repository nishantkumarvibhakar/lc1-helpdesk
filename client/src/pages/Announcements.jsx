import React, { useState, useEffect } from 'react';
import { 
  Megaphone, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Users, 
  Search, 
  ArrowRight, 
  Flame, 
  Sparkles, 
  Share2, 
  ExternalLink,
  Check,
  CalendarDays
} from 'lucide-react';
import { api } from '../services/api';
import { PriorityBadge } from '../components/StatusBadge';

export function Announcements({ onSelectNotice }) {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [rsvpd, setRsvpd] = useState({});

  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await api.getNotices();
        setNotices(res.notices || []);
      } catch (err) {
        console.error('Failed to load announcements:', err);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, []);

  const handleRsvp = (e, id) => {
    e.stopPropagation();
    setRsvpd(prev => ({ ...prev, [id]: true }));
  };

  const handleShare = (e, item) => {
    e.stopPropagation();
    const text = `📢 Team Prashant Diwakar Campaign Event:\n*${item.title}*\n📅 ${item.eventDate || item.date} | 📍 ${item.venue || 'Faculty of Law'}\n\nJoin us: ${window.location.origin}/announcements`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      alert('Event details copied! Share it on your batch WhatsApp groups.');
    }
  };

  const filterTabs = [
    { id: 'All', label: '🌟 All Events & Updates' },
    { id: 'Townhall', label: '🗣️ Townhalls & Open Mics' },
    { id: 'Workshop', label: '⚖️ Legal Masterclasses' },
    { id: 'Manifesto', label: '📜 Manifesto & Agendas' },
    { id: 'Rally', label: '☕ Chai-Pe-Charcha & Meets' },
  ];

  const filtered = notices.filter(n => {
    const matchesTab = selectedFilter === 'All' || 
      (n.type && n.type.toLowerCase() === selectedFilter.toLowerCase()) ||
      (n.category && n.category.toLowerCase().includes(selectedFilter.toLowerCase()));
    
    const matchesSearch = searchTerm === '' ||
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (n.venue && n.venue.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesTab && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-du-navy via-slate-900 to-du-dark rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-du-gold/30">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-du-gold/20 text-du-gold border border-du-gold/40 text-xs font-bold uppercase tracking-wider">
            <Megaphone className="w-3.5 h-3.5 animate-bounce" />
            <span>Campaign Events & Announcements</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-extrabold tracking-tight text-white leading-tight">
            Prashant Kumar Diwakar — Campaign Schedule & Events
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Stay connected with all official rallies, interactive open mic sessions, and legal drafting workshops organized by Team Prashant Diwakar for Law Centre-1 students.
          </p>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 bottom-0 transform translate-x-12 translate-y-12 w-64 h-64 bg-du-gold/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
          {filterTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedFilter === tab.id
                  ? 'bg-du-navy text-du-gold shadow-sm ring-2 ring-du-gold/30'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search events, topics, venues..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-du-gold focus:outline-none"
          />
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-4 border-du-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500 mt-2">Loading campaign schedule...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-500 text-sm">
          No campaign events found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((item) => {
            const isAttending = rsvpd[item.id];
            const isEvent = Boolean(item.eventDate) || item.type === 'Event' || item.type === 'Townhall' || item.type === 'Workshop';

            return (
              <div
                key={item.id}
                onClick={() => onSelectNotice && onSelectNotice(item)}
                className={`bg-white rounded-3xl border p-6 sm:p-7 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between cursor-pointer group relative ${
                  item.isPinned ? 'border-amber-400 ring-2 ring-amber-100' : 'border-slate-200 hover:border-du-gold/70'
                }`}
              >
                <div className="space-y-4">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-du-gold/20 text-du-navy border border-du-gold/40">
                        {item.category || 'Campaign Event'}
                      </span>
                      {item.isPinned && (
                        <span className="text-[11px] font-extrabold bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <Flame className="w-3 h-3 text-red-500" /> Featured
                        </span>
                      )}
                    </div>
                    <PriorityBadge priority={item.priority} />
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-slate-900 text-lg sm:text-xl leading-snug group-hover:text-primary-700 transition font-serif">
                    {item.title}
                  </h3>

                  {/* Schedule Details Box */}
                  {isEvent && (
                    <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5 sm:p-4 space-y-2 text-xs">
                      {item.eventDate && (
                        <div className="flex items-center gap-2 font-bold text-slate-900">
                          <CalendarDays className="w-4 h-4 text-amber-700 flex-shrink-0" />
                          <span>{item.eventDate}</span>
                          {item.eventTime && (
                            <span className="text-amber-800 font-semibold">({item.eventTime})</span>
                          )}
                        </div>
                      )}

                      {item.venue && (
                        <div className="flex items-start gap-2 text-slate-700">
                          <MapPin className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                          <span>{item.venue}</span>
                        </div>
                      )}

                      {item.contactPerson && (
                        <div className="flex items-center gap-2 text-slate-600 pt-1 border-t border-amber-200/50">
                          <User className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
                          <span>Coordinator: <strong>{item.contactPerson}</strong></span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-4 mt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleRsvp(e, item.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                        isAttending
                          ? 'bg-emerald-600 text-white'
                          : 'bg-du-navy hover:bg-slate-800 text-du-gold'
                      }`}
                    >
                      {isAttending ? <Check className="w-3.5 h-3.5" /> : <Users className="w-3.5 h-3.5" />}
                      <span>{isAttending ? 'RSVP Confirmed' : 'Count Me In (RSVP)'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleShare(e, item)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                      title="Share Event"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>

                  <span className="text-xs font-bold text-primary-600 group-hover:text-du-navy flex items-center gap-1">
                    <span>Full Details</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
