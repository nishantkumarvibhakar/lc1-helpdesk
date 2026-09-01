import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Search, 
  Calendar, 
  ExternalLink, 
  Flame, 
  Tag, 
  Sparkles,
  ArrowRight,
  Filter,
  MapPin,
  Clock
} from 'lucide-react';
import { api } from '../services/api';
import { PriorityBadge } from '../components/StatusBadge';

export function Notices({ onSelectNotice }) {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadNotices() {
      try {
        const res = await api.getNotices();
        setNotices(res.notices || []);
      } catch (err) {
        console.error('Failed to load notices:', err);
      } finally {
        setLoading(false);
      }
    }
    loadNotices();
  }, []);

  const categories = ['All', 'Event & Workshop', 'Examination', 'Academic', 'Library', 'ID Card / Documents', 'General'];

  const filteredNotices = notices.filter(n => {
    const matchesCat = selectedCategory === 'All' || n.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = searchTerm === '' || 
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (n.venue && n.venue.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-du-navy bg-du-gold/20 px-3 py-1 rounded-full border border-du-gold/40">
          Faculty of Law • LC1 Circulars & Events
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
          Notices, Events & Announcements
        </h1>
        <p className="text-slate-600 text-sm">
          Stay updated with Team Prashant Diwakar events, official examination schedules, internal assessment dates, and student announcements.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-du-navy text-du-gold shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search circulars or events..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-du-gold focus:outline-none"
          />
        </div>
      </div>

      {/* Notices Grid */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-4 border-du-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      ) : filteredNotices.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-500">
          No notices or events found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredNotices.map((notice) => {
            const isEvent = notice.type === 'Event' || notice.category === 'Event & Workshop' || Boolean(notice.eventDate);
            return (
              <div
                key={notice.id}
                onClick={() => onSelectNotice && onSelectNotice(notice)}
                className={`bg-white rounded-3xl border p-6 sm:p-7 shadow-sm hover:shadow-lg transition flex flex-col justify-between cursor-pointer group ${
                  notice.isPinned ? 'border-amber-300 ring-2 ring-amber-100' : 'border-slate-200 hover:border-du-gold/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                        isEvent ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-du-gold/20 text-du-navy border-du-gold/30'
                      }`}>
                        {isEvent ? '🎉 Event' : notice.category}
                      </span>
                      {notice.isPinned && (
                        <span className="text-[11px] font-extrabold bg-red-100 text-red-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Flame className="w-3 h-3 text-red-500" /> Pinned
                        </span>
                      )}
                    </div>
                    <PriorityBadge priority={notice.priority} />
                  </div>

                  <h3 className="font-bold text-slate-900 text-lg mb-2.5 leading-snug group-hover:text-primary-700 transition">
                    {notice.title}
                  </h3>

                  {notice.eventDate && (
                    <div className="text-xs text-amber-800 font-semibold mb-3 flex items-center gap-2 bg-amber-50 p-2 rounded-xl border border-amber-200">
                      <Calendar className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      <span>{notice.eventDate}</span>
                      {notice.venue && <span>• 📍 {notice.venue}</span>}
                    </div>
                  )}

                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 line-clamp-3">
                    {notice.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-du-gold" />
                    <span>{notice.date}</span>
                    <span>•</span>
                    <span className="text-slate-700 font-medium">{notice.publishedBy}</span>
                  </div>

                  <span className="font-bold text-primary-600 group-hover:text-du-navy flex items-center gap-1 text-xs">
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition" />
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
