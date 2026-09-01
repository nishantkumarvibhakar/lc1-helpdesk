import React from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  ExternalLink, 
  Megaphone, 
  Sparkles, 
  Share2, 
  Check, 
  Flame, 
  CalendarDays
} from 'lucide-react';
import { PriorityBadge } from './StatusBadge';

export function NoticeDetailModal({ notice, onClose }) {
  const [copied, setCopied] = React.useState(false);

  if (!notice) return null;

  const isEvent = notice.type === 'Event' || notice.category === 'Event & Workshop' || Boolean(notice.eventDate) || Boolean(notice.venue);

  const handleShare = () => {
    const text = `${notice.title}\n\nRead more at LC1 Help Desk: ${window.location.origin}/notices`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-900/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 relative max-h-[88vh] overflow-y-auto my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Badges */}
        <div className="flex items-center gap-2 flex-wrap pr-8">
          <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
            isEvent 
              ? 'bg-amber-100 text-amber-900 border-amber-300' 
              : 'bg-du-navy text-du-gold border-du-navy'
          }`}>
            {isEvent ? '🎉 Team Prashant Diwakar Event' : '📢 Official Notice'}
          </span>
          <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
            {notice.category}
          </span>
          <PriorityBadge priority={notice.priority} />
          {notice.isPinned && (
            <span className="text-[11px] font-bold bg-rose-100 text-rose-700 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Flame className="w-3 h-3 text-rose-500" /> Pinned
            </span>
          )}
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-serif font-extrabold text-slate-900 leading-snug">
            {notice.title}
          </h2>
          <p className="text-xs text-slate-400">
            Published on {notice.date} by <strong className="text-du-navy">{notice.publishedBy || 'Team Prashant Diwakar'}</strong>
          </p>
        </div>

        {/* Event Key Highlights Box (if Event / Special Notice) */}
        {isEvent && (
          <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-200/80 rounded-2xl p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {notice.eventDate && (
              <div className="flex items-start gap-2.5">
                <div className="p-2 rounded-xl bg-amber-200/60 text-amber-900">
                  <CalendarDays className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-amber-900/60 font-medium">Event Date</span>
                  <p className="font-bold text-slate-900 text-sm">{notice.eventDate}</p>
                </div>
              </div>
            )}

            {notice.eventTime && (
              <div className="flex items-start gap-2.5">
                <div className="p-2 rounded-xl bg-amber-200/60 text-amber-900">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-amber-900/60 font-medium">Timing</span>
                  <p className="font-bold text-slate-900 text-sm">{notice.eventTime}</p>
                </div>
              </div>
            )}

            {notice.venue && (
              <div className="flex items-start gap-2.5 sm:col-span-2">
                <div className="p-2 rounded-xl bg-amber-200/60 text-amber-900">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-amber-900/60 font-medium">Venue / Location</span>
                  <p className="font-bold text-slate-900 text-sm">{notice.venue}</p>
                </div>
              </div>
            )}

            {notice.contactPerson && (
              <div className="flex items-start gap-2.5 sm:col-span-2 pt-2 border-t border-amber-200/60">
                <div className="p-2 rounded-xl bg-amber-200/60 text-amber-900">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-amber-900/60 font-medium">Organizer / Contact Coordinator</span>
                  <p className="font-semibold text-slate-800">{notice.contactPerson}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Detailed Content / Description */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {isEvent ? 'About the Event & Details' : 'Full Notice & Instructions'}
          </h3>
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
            {notice.description}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handleShare}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? 'Link Copied!' : 'Share Announcement'}</span>
          </button>

          <div className="w-full sm:w-auto flex items-center gap-2">
            {notice.linkUrl && (
              <a
                href={notice.linkUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-xl font-bold text-xs bg-du-gold hover:bg-du-goldLight text-du-navy shadow transition"
              >
                <span>{notice.linkText || 'Register / Open Link'}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-du-navy hover:bg-slate-800 text-white font-semibold text-xs transition"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
