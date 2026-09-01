import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Calendar, ArrowRight, Tag, UserCheck, MessageSquare } from 'lucide-react';
import { StatusBadge, PriorityBadge } from './StatusBadge';

export function TicketCard({ ticket, onView }) {
  const formattedDate = new Date(ticket.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 hover:border-du-gold/50 shadow-sm hover:shadow-md transition p-5 flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 group-hover:border-du-gold/60 group-hover:text-du-navy transition">
              #{ticket.ticketId}
            </span>
            <PriorityBadge priority={ticket.priority} />
          </div>
          <StatusBadge status={ticket.status} size="sm" />
        </div>

        <h3 className="font-semibold text-slate-900 text-base leading-snug group-hover:text-primary-700 transition mb-2">
          {ticket.subject}
        </h3>

        <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed mb-4">
          {ticket.description}
        </p>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 font-medium text-slate-700">
            <Tag className="w-3.5 h-3.5 text-du-gold" />
            {ticket.category}
          </span>
          <span className="inline-flex items-center gap-1 text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            {formattedDate}
          </span>
        </div>

        {onView ? (
          <button
            onClick={() => onView(ticket)}
            className="inline-flex items-center gap-1 font-semibold text-primary-600 hover:text-primary-800 text-xs transition"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <Link
            to={`/track?id=${ticket.ticketId}`}
            className="inline-flex items-center gap-1 font-semibold text-primary-600 hover:text-primary-800 text-xs transition"
          >
            <span>Track</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
}
