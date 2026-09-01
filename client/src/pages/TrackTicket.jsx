import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  User, 
  Calendar, 
  Tag, 
  Send, 
  MessageSquare, 
  FileText, 
  ShieldCheck,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Lock,
  EyeOff
} from 'lucide-react';
import { api } from '../services/api';
import { StatusBadge, PriorityBadge } from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';

export function TrackTicket() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isAdmin } = useAuth();

  const [ticketInput, setTicketInput] = useState('');
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [replying, setReplying] = useState(false);

  const fetchTicket = async (id) => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const res = await api.trackTicket(id);
      setTicket(res.ticket);
    } catch (err) {
      setTicket(null);
      setError(err.message || `No active record found for ticket #${id}. Please verify your ticket number.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const idFromUrl = searchParams.get('id');
    if (idFromUrl) {
      setTicketInput(idFromUrl);
      fetchTicket(idFromUrl);
    }
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!ticketInput.trim()) return;
    setSearchParams({ id: ticketInput.trim() });
    fetchTicket(ticketInput.trim());
  };

  // Check if current user is authorized to post a reply (Admin or the original Issue Creator)
  const isAuthorizedToReply = () => {
    if (!ticket) return false;
    if (isAdmin) return true;
    if (!user) return false;
    
    const userEmail = (user.email || '').toLowerCase().trim();
    const ticketEmail = (ticket.studentEmail || '').toLowerCase().trim();
    const userRoll = (user.studentId || '').toUpperCase().trim();
    const ticketRoll = (ticket.studentId || '').toUpperCase().trim();

    return (userEmail && userEmail === ticketEmail) || (userRoll && ticketRoll && userRoll === ticketRoll);
  };

  const handleAddReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim() || !ticket) return;

    if (!isAuthorizedToReply()) {
      alert('Access restricted: Only Team Admin and the student who created this issue can post replies.');
      return;
    }

    setReplying(true);
    try {
      const authorName = isAdmin 
        ? `${user?.name || 'Prashant Diwakar'} (Team Lead)`
        : (ticket.isAnonymous ? 'Anonymous Student (LC-1)' : `${user?.name || ticket.studentName} (Student)`);
      
      const authorRole = isAdmin ? 'admin' : 'student';

      const res = await api.addTicketMessage(ticket.id, {
        author: authorName,
        role: authorRole,
        message: replyMessage.trim()
      });

      setTicket(res.ticket);
      setReplyMessage('');
    } catch (err) {
      alert('Failed to send reply: ' + err.message);
    } finally {
      setReplying(false);
    }
  };

  // Stepper calculations
  const steps = [
    { title: 'Submitted', desc: 'Logged into LC1 Student Portal' },
    { title: 'Assigned', desc: 'Team representative allocated' },
    { title: 'In Progress', desc: 'Active liaison with Administration' },
    { title: 'Resolved', desc: 'Action completed & closed' }
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case 'Pending': return 0;
      case 'In Progress': return 2;
      case 'Resolved': return 3;
      case 'Rejected': return 3;
      default: return 0;
    }
  };

  const currentStep = ticket ? getStepIndex(ticket.status) : 0;
  const isAnon = Boolean(ticket?.isAnonymous);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
          Track Issue / Suggestion Status
        </h1>
        <p className="text-slate-600 text-sm max-w-lg mx-auto">
          Enter your unique Tracking Reference Number (e.g. LC1-2026-XXXXX or SUGG-2026-XXXXX) to view live progress.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-md">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={ticketInput}
              onChange={(e) => setTicketInput(e.target.value)}
              placeholder="e.g. LC1-2026-77613 or SUGG-2026-64215"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-du-gold focus:outline-none font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl font-bold text-sm bg-du-navy hover:bg-slate-800 text-white shadow transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Searching...</span>
            ) : (
              <>
                <span>Search Status</span>
                <ChevronRight className="w-4 h-4 text-du-gold" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600 mt-0.5" />
          <div>
            <p className="font-semibold">Record Not Found</p>
            <p className="text-xs text-rose-700 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Ticket Details View */}
      {ticket && (
        <div className="space-y-6 animate-fadeIn">
          {/* Top Ticket Status Header Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-lg space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                  <span className="font-mono text-base font-extrabold text-du-navy bg-du-gold/20 px-3 py-1 rounded-lg border border-du-gold/30">
                    #{ticket.ticketId}
                  </span>
                  <PriorityBadge priority={ticket.priority} />
                  <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                    {ticket.category}
                  </span>
                  {isAnon && (
                    <span className="text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <EyeOff className="w-3 h-3" /> Anonymous Submission
                    </span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                  {ticket.subject}
                </h2>
              </div>
              <div className="flex sm:flex-col items-end justify-between sm:justify-center">
                <StatusBadge status={ticket.status} size="lg" />
                <span className="text-[11px] text-slate-400 mt-1">
                  Updated: {new Date(ticket.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>

            {/* Visual 4-Step Stepper */}
            <div className="py-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Resolution Progress</p>
              <div className="grid grid-cols-4 gap-2 relative">
                {steps.map((step, idx) => {
                  const isPassed = currentStep >= idx;
                  const isCurrent = currentStep === idx;
                  return (
                    <div key={step.title} className="text-center">
                      <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-bold mb-2 transition shadow-sm ${
                        isPassed 
                          ? 'bg-emerald-600 text-white ring-4 ring-emerald-100' 
                          : 'bg-slate-200 text-slate-500'
                      }`}>
                        {isPassed ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                      </div>
                      <div className={`text-xs font-bold leading-tight ${isCurrent ? 'text-du-navy' : 'text-slate-600'}`}>
                        {step.title}
                      </div>
                      <div className="text-[10px] text-slate-400 hidden sm:block mt-0.5">
                        {step.desc}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ticket Info Details Grid - Anonymous Safe */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 font-medium">Raised By</span>
                <p className="font-semibold text-slate-800">
                  {isAnon ? 'Anonymous Student (LC-1)' : ticket.studentName}
                </p>
                <p className="text-slate-500 text-[11px]">
                  {isAnon ? '🔒 Confidential (Email Hidden)' : ticket.studentEmail}
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 font-medium">Assigned Representative</span>
                <p className="font-semibold text-du-navy flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-du-gold" />
                  {ticket.assignedTo || 'Unassigned (Team Prashant Diwakar)'}
                </p>
                <p className="text-slate-500 text-[11px]">Student Welfare Operations</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 font-medium">Student Identity</span>
                <p className="font-mono font-semibold text-slate-800">
                  {isAnon ? '🔒 Verified LC-1 Student' : (ticket.studentId || 'Not Provided')}
                </p>
                <p className="text-slate-500 text-[11px]">Submitted: {new Date(ticket.createdAt).toLocaleDateString('en-IN')}</p>
              </div>
            </div>

            {/* Problem Description */}
            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Issue Description</h3>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                {ticket.description}
              </div>
              {ticket.attachment && (
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-du-navy bg-slate-100 px-3 py-1.5 rounded-lg">
                  <FileText className="w-4 h-4 text-du-gold" />
                  <span>Attachment: {ticket.attachment}</span>
                </div>
              )}
            </div>
          </div>

          {/* Activity & Timeline Section */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-lg space-y-6">
            <h3 className="text-lg font-serif font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-du-gold" />
              <span>Resolution Timeline & Updates</span>
            </h3>

            {/* Timeline Stream */}
            <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
              {ticket.timeline && ticket.timeline.map((entry, idx) => {
                const isAdminRole = entry.role === 'admin';
                return (
                  <div key={entry.id || idx} className="relative flex items-start gap-4 pl-1">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                      isAdminRole ? 'bg-du-navy text-du-gold ring-4 ring-amber-100' : 'bg-slate-400 text-white'
                    }`}>
                      {isAdminRole ? <ShieldCheck className="w-3.5 h-3.5" /> : <User className="w-3 h-3" />}
                    </div>
                    <div className={`flex-1 p-4 rounded-2xl border text-xs sm:text-sm ${
                      isAdminRole ? 'bg-amber-50/50 border-amber-200' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`font-bold ${isAdminRole ? 'text-du-navy' : 'text-slate-800'}`}>
                          {isAnon && !isAdminRole ? 'Anonymous Student' : entry.author}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(entry.timestamp).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                        </span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">
                        {entry.message}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Access-Controlled Reply Box */}
            {isAuthorizedToReply() ? (
              <form onSubmit={handleAddReply} className="pt-4 border-t border-slate-100 space-y-3">
                <label className="block text-xs font-semibold text-slate-700">
                  Post an Update or Follow-up Reply:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your official update or question here..."
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-du-gold focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={replying}
                    className="px-5 py-2.5 rounded-xl font-bold text-sm bg-du-navy hover:bg-slate-800 text-white shadow transition flex items-center gap-1.5"
                  >
                    <Send className="w-4 h-4 text-du-gold" />
                    <span>Reply</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-center sm:text-left">
                  <Lock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span>Only the <strong>Issue Creator</strong> and <strong>Team Admin</strong> can post replies on this ticket.</span>
                </div>
                {!user ? (
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-xl bg-du-navy text-du-gold font-bold text-xs shadow hover:bg-slate-800 transition whitespace-nowrap"
                  >
                    Sign In to Reply
                  </Link>
                ) : (
                  <span className="text-[11px] text-slate-400 italic">Logged in as {user.name}</span>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
