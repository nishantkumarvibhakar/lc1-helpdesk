import React from 'react';
import { Clock, CheckCircle2, AlertCircle, XCircle, ShieldAlert } from 'lucide-react';

export function StatusBadge({ status = 'Pending', size = 'md' }) {
  const sizeClasses = size === 'sm' 
    ? 'px-2 py-0.5 text-xs' 
    : 'px-2.5 py-1 text-xs font-semibold';

  const safeStatus = status || 'Pending';

  switch (safeStatus) {
    case 'Pending':
      return (
        <span className={`inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
          Pending
        </span>
      );
    case 'In Progress':
      return (
        <span className={`inline-flex items-center gap-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 ${sizeClasses}`}>
          <Clock className="w-3.5 h-3.5 text-blue-500 animate-spin" style={{ animationDuration: '3s' }} />
          In Progress
        </span>
      );
    case 'Resolved':
      return (
        <span className={`inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 ${sizeClasses}`}>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Resolved
        </span>
      );
    case 'Rejected':
      return (
        <span className={`inline-flex items-center gap-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 ${sizeClasses}`}>
          <XCircle className="w-3.5 h-3.5 text-rose-500" />
          Rejected
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center rounded-full bg-slate-100 text-slate-700 border border-slate-200 ${sizeClasses}`}>
          {safeStatus}
        </span>
      );
  }
}

export function PriorityBadge({ priority = 'Normal', size = 'sm' }) {
  const sizeClasses = size === 'xs' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs';
  const safePriority = priority || 'Normal';

  switch (safePriority) {
    case 'Urgent':
      return (
        <span className={`inline-flex items-center gap-1 font-bold rounded bg-red-100 text-red-800 border border-red-200 ${sizeClasses}`}>
          <ShieldAlert className="w-3 h-3" />
          Urgent
        </span>
      );
    case 'High':
      return (
        <span className={`inline-flex items-center font-semibold rounded bg-orange-100 text-orange-800 border border-orange-200 ${sizeClasses}`}>
          High
        </span>
      );
    case 'Medium':
    case 'Normal':
      return (
        <span className={`inline-flex items-center rounded bg-slate-100 text-slate-700 border border-slate-200 ${sizeClasses}`}>
          Normal
        </span>
      );
    case 'Low':
      return (
        <span className={`inline-flex items-center rounded bg-zinc-100 text-zinc-600 border border-zinc-200 ${sizeClasses}`}>
          Low
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center rounded bg-slate-100 text-slate-600 ${sizeClasses}`}>
          {safePriority}
        </span>
      );
  }
}
