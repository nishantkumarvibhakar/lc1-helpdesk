import React from 'react';
import { Megaphone, ChevronRight, Sparkles, Calendar } from 'lucide-react';

export function NoticeMarquee({ notices = [], onSelectNotice }) {
  // Only display if notices array has active notices
  if (!notices || notices.length === 0) return null;

  const activeNotices = notices.filter(n => n.isActive !== false);
  if (activeNotices.length === 0) return null;

  // Filter pinned / urgent first, or show active
  const urgentOrPinned = activeNotices.filter(n => n.isPinned || n.priority === 'Urgent' || n.priority === 'High');
  const displayNotices = urgentOrPinned.length > 0 ? urgentOrPinned : activeNotices.slice(0, 4);

  return (
    <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-sm overflow-hidden py-2 px-4 flex items-center text-xs md:text-sm font-medium border-b border-red-800/20">
      <div className="flex items-center gap-1.5 flex-shrink-0 bg-red-900/70 px-2.5 py-0.5 rounded-full mr-3 text-red-100 font-bold uppercase tracking-wider text-[11px] shadow-inner">
        <Megaphone className="w-3.5 h-3.5 text-yellow-300 animate-bounce" />
        <span>LC1 Announcement</span>
      </div>

      <div className="relative overflow-hidden w-full whitespace-nowrap">
        <div className="animate-marquee flex items-center gap-8 cursor-pointer">
          {displayNotices.map((n, idx) => {
            const isEvent = n.type === 'Event' || n.category === 'Event & Workshop';
            return (
              <button
                type="button"
                key={n.id || idx}
                onClick={() => onSelectNotice && onSelectNotice(n)}
                className="hover:underline flex items-center gap-2 text-red-50 hover:text-white transition focus:outline-none"
              >
                <span className="font-semibold text-yellow-200 bg-red-900/40 px-1.5 py-0.5 rounded text-[11px]">
                  {isEvent ? '🎉 Event' : `[${n.category}]`}
                </span>
                <span>{n.title}</span>
                {n.eventDate ? (
                  <span className="text-yellow-300 text-xs font-semibold">📅 {n.eventDate}</span>
                ) : (
                  <span className="text-red-200 text-xs font-normal">({n.date})</span>
                )}
                <ChevronRight className="w-3.5 h-3.5 text-yellow-300 inline" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
