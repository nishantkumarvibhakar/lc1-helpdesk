import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  FileText, 
  ArrowRight,
  Filter,
  ShieldCheck
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { TicketCard } from '../components/TicketCard';

export function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/login');
      return;
    }

    async function loadTickets() {
      try {
        const res = await api.getMyTickets();
        setTickets(res.tickets || []);
      } catch (err) {
        console.error('Failed to load my tickets:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTickets();
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-du-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  // Stats calculation
  const total = tickets.length;
  const pending = tickets.filter(t => t.status === 'Pending').length;
  const inProgress = tickets.filter(t => t.status === 'In Progress').length;
  const resolved = tickets.filter(t => t.status === 'Resolved').length;

  // Filtering
  const filteredTickets = tickets.filter(t => {
    const matchesStatus = filterStatus === 'All' || t.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      t.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Student Welcome Header */}
      <div className="bg-gradient-to-r from-du-navy via-slate-900 to-du-dark rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-du-gold/30">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-du-gold text-xs font-semibold border border-du-gold/30">
            <span>Faculty of Law • Student Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Welcome back, {user.name} 👋
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm">
            Roll No: <strong className="text-white font-mono">{user.studentId || '24LC10124'}</strong> | Email: <span className="text-du-gold">{user.email}</span>
          </p>
        </div>

        <Link
          to="/raise-ticket"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-du-gold hover:bg-du-goldLight text-du-navy shadow-md transition"
        >
          <PlusCircle className="w-5 h-5" />
          <span>+ Raise New Query</span>
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Raised</p>
          <p className="text-3xl font-extrabold text-slate-900 mt-1">{total}</p>
          <p className="text-[11px] text-slate-400 mt-1">Issues logged</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-sm">
          <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">Pending Review</p>
          <p className="text-3xl font-extrabold text-amber-600 mt-1">{pending}</p>
          <p className="text-[11px] text-amber-700/70 mt-1">Awaiting coordinator</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-blue-200 shadow-sm">
          <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">In Progress</p>
          <p className="text-3xl font-extrabold text-blue-600 mt-1">{inProgress}</p>
          <p className="text-[11px] text-blue-700/70 mt-1">Liaising with faculty</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-emerald-200 shadow-sm">
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Resolved</p>
          <p className="text-3xl font-extrabold text-emerald-600 mt-1">{resolved}</p>
          <p className="text-[11px] text-emerald-700/70 mt-1">Successfully closed</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
          {['All', 'Pending', 'In Progress', 'Resolved'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                filterStatus === status
                  ? 'bg-du-navy text-du-gold shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status} {status === 'All' ? `(${total})` : ''}
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
            placeholder="Search my tickets..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-du-gold focus:outline-none"
          />
        </div>
      </div>

      {/* Tickets List */}
      {loading ? (
        <div className="text-center py-16 space-y-3">
          <div className="w-8 h-8 border-4 border-du-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500">Loading your tickets...</p>
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <div className="space-y-1">
            <h3 className="font-bold text-slate-800 text-base">No tickets found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {filterStatus !== 'All' || searchTerm
                ? 'Try clearing your filters or search query.'
                : 'You have not submitted any queries yet. Whenever you encounter an issue at LC1, raise a ticket here!'}
            </p>
          </div>
          <Link
            to="/raise-ticket"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-xs bg-du-gold hover:bg-du-goldLight text-du-navy transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Submit Your First Query</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTickets.map(ticket => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onView={(t) => navigate(`/track?id=${t.ticketId}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
