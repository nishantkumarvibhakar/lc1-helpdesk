import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Ticket, 
  Bell, 
  HelpCircle, 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Trash2, 
  Edit, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  X, 
  Send, 
  Flame, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  UserCheck,
  Lightbulb,
  HeartHandshake,
  Droplet,
  Library,
  Wifi,
  Utensils,
  Building2,
  Scale,
  Calendar,
  Phone,
  Mail,
  MapPin,
  CalendarDays,
  Megaphone,
  EyeOff,
  UserPlus,
  Check,
  Pin,
  UploadCloud,
  ImageIcon,
  Crown,
  Settings,
  BookOpen
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge, PriorityBadge } from '../../components/StatusBadge';

export function AdminDashboard() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('issues'); // 'issues' | 'suggestions' | 'volunteers' | 'events' | 'faqs' | 'team' | 'manifesto'
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0, rejected: 0, resolutionRate: 0 });
  const [tickets, setTickets] = useState([]);
  const [notices, setNotices] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [team, setTeam] = useState([]);
  const [manifesto, setManifesto] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters for issues/tickets
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected ticket for modal / drawer
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [assignedMember, setAssignedMember] = useState('');
  const [updating, setUpdating] = useState(false);

  // Full Record Editing State inside Ticket Modal
  const [isEditingRecord, setIsEditingRecord] = useState(false);
  const [recordEditForm, setRecordEditForm] = useState({
    subject: '',
    description: '',
    category: '',
    priority: 'Normal',
    studentName: '',
    studentId: '',
    studentEmail: '',
    phone: '',
    llbYear: '1st Year',
    section: 'Section A'
  });

  // Campaign Event / Notice Modal state
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [editingNoticeId, setEditingNoticeId] = useState(null);
  const [noticeForm, setNoticeForm] = useState({
    title: '',
    category: 'Event & Rally',
    type: 'Event',
    description: '',
    eventDate: '',
    eventTime: '',
    venue: '',
    priority: 'Normal',
    isPinned: true,
    linkText: '',
    linkUrl: '',
    contactPerson: 'Team Prashant Diwakar'
  });

  // Campaign Poster Modal state
  const [showPosterModal, setShowPosterModal] = useState(false);
  const [posterUrlInput, setPosterUrlInput] = useState('');
  const [posterPreview, setPosterPreview] = useState('/images/prashant-diwakar-poster.jpg');

  // FAQ Modal state
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [editingFaqId, setEditingFaqId] = useState(null);
  const [faqForm, setFaqForm] = useState({
    category: 'Campaign & Vision',
    question: '',
    answer: ''
  });

  // Team Member Modal state
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState(null);
  const [teamForm, setTeamForm] = useState({
    name: '',
    role: '',
    year: '3rd Year (Batch \'24)',
    phone: '',
    email: '',
    bio: '',
    isMainLeader: false
  });

  // Manifesto Point Modal state
  const [showManifestoModal, setShowManifestoModal] = useState(false);
  const [editingManifestoId, setEditingManifestoId] = useState(null);
  const [manifestoForm, setManifestoForm] = useState({
    num: '',
    title: '',
    desc: '',
    icon: 'Droplet'
  });

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedTicket(null);
        setShowNoticeModal(false);
        setShowPosterModal(false);
        setShowFaqModal(false);
        setShowTeamModal(false);
        setShowManifestoModal(false);
        setIsEditingRecord(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!isAdmin) {
      navigate('/login');
      return;
    }
    loadAllData();
    const savedPoster = localStorage.getItem('lc1_campaign_poster_image') || '/images/prashant-diwakar-poster.jpg';
    setPosterPreview(savedPoster);
    setPosterUrlInput(savedPoster);
  }, [isAdmin, authLoading, navigate]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [statsRes, ticketsRes, noticesRes, faqsRes, teamRes, manifestoRes] = await Promise.all([
        api.getStats(),
        api.getTickets(),
        api.getNotices(),
        api.getFaqs(),
        api.getTeam(),
        api.getManifesto().catch(() => ({ manifesto: [] }))
      ]);
      setStats(statsRes || {});
      setTickets(ticketsRes.tickets || []);
      setNotices(noticesRes.notices || []);
      setFaqs(faqsRes.faqs || []);
      setTeam(teamRes.team || []);
      setManifesto(manifestoRes?.manifesto || []);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenTicketModal = (t) => {
    setSelectedTicket(t);
    setStatusUpdate(t.status);
    setAssignedMember(t.assignedTo || 'Prashant Kumar Diwakar (Main Leader)');
    setIsEditingRecord(false);
    setRecordEditForm({
      subject: t.subject || '',
      description: t.description || '',
      category: t.category || '',
      priority: t.priority || 'Normal',
      studentName: t.studentName || '',
      studentId: t.studentId || '',
      studentEmail: t.studentEmail || '',
      phone: t.phone || '',
      llbYear: t.llbYear || '1st Year',
      section: t.section || 'Section A'
    });
  };

  const handleUpdateStatus = async () => {
    if (!selectedTicket || !statusUpdate) return;
    setUpdating(true);
    try {
      const res = await api.updateTicketStatus(selectedTicket.id, statusUpdate, statusNote);
      setSelectedTicket(res.ticket);
      loadAllData();
      setStatusNote('');
      alert(`Status updated to ${statusUpdate}`);
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveFullRecord = async (e) => {
    e.preventDefault();
    if (!selectedTicket) return;
    setUpdating(true);
    try {
      const res = await api.updateTicketFull(selectedTicket.id, recordEditForm);
      setSelectedTicket(res.ticket);
      setIsEditingRecord(false);
      loadAllData();
      alert('Record details updated successfully!');
    } catch (err) {
      alert('Failed to update record: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleAssignMember = async () => {
    if (!selectedTicket || !assignedMember) return;
    setUpdating(true);
    try {
      const res = await api.assignTicket(selectedTicket.id, assignedMember);
      setSelectedTicket(res.ticket);
      loadAllData();
      alert(`Successfully assigned to ${assignedMember}`);
    } catch (err) {
      alert('Failed to assign member: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteTicket = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this record?')) return;
    try {
      await api.deleteTicket(id);
      setSelectedTicket(null);
      loadAllData();
      alert('Record deleted successfully.');
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    }
  };

  // Event handlers
  const handleSaveNotice = async (e) => {
    e.preventDefault();
    try {
      if (editingNoticeId) {
        await api.updateNotice(editingNoticeId, noticeForm);
        alert('Event updated successfully!');
      } else {
        await api.createNotice(noticeForm);
        alert('New event published successfully!');
      }
      setShowNoticeModal(false);
      setEditingNoticeId(null);
      setNoticeForm({
        title: '',
        category: 'Event & Rally',
        type: 'Event',
        description: '',
        eventDate: '',
        eventTime: '',
        venue: '',
        priority: 'Normal',
        isPinned: true,
        linkText: '',
        linkUrl: '',
        contactPerson: 'Team Prashant Diwakar'
      });
      loadAllData();
    } catch (err) {
      alert('Failed to save announcement: ' + err.message);
    }
  };

  const handleEditNotice = (notice) => {
    setEditingNoticeId(notice.id);
    setNoticeForm({
      title: notice.title || '',
      category: notice.category || 'Event & Rally',
      type: notice.type || 'Event',
      description: notice.description || '',
      eventDate: notice.eventDate || '',
      eventTime: notice.eventTime || '',
      venue: notice.venue || '',
      priority: notice.priority || 'Normal',
      isPinned: Boolean(notice.isPinned),
      linkText: notice.linkText || '',
      linkUrl: notice.linkUrl || '',
      contactPerson: notice.contactPerson || 'Team Prashant Diwakar'
    });
    setShowNoticeModal(true);
  };

  const handleDeleteNotice = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event/notice?')) return;
    try {
      await api.deleteNotice(id);
      loadAllData();
      alert('Event deleted successfully.');
    } catch (err) {
      alert('Failed to delete announcement: ' + err.message);
    }
  };

  const handleTogglePinNotice = async (notice) => {
    try {
      await api.updateNotice(notice.id, { isPinned: !notice.isPinned });
      loadAllData();
    } catch (err) {
      alert('Failed to update pin: ' + err.message);
    }
  };

  // FAQ handlers
  const handleSaveFaq = async (e) => {
    e.preventDefault();
    try {
      if (editingFaqId) {
        await api.updateFaq(editingFaqId, faqForm);
        alert('FAQ updated successfully!');
      } else {
        await api.createFaq(faqForm);
        alert('FAQ created successfully!');
      }
      setShowFaqModal(false);
      setEditingFaqId(null);
      setFaqForm({ category: 'Campaign & Vision', question: '', answer: '' });
      loadAllData();
    } catch (err) {
      alert('Failed to save FAQ: ' + err.message);
    }
  };

  const handleEditFaq = (faq) => {
    setEditingFaqId(faq.id);
    setFaqForm({
      category: faq.category || 'Campaign & Vision',
      question: faq.question || '',
      answer: faq.answer || ''
    });
    setShowFaqModal(true);
  };

  const handleDeleteFaq = async (id) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) return;
    try {
      await api.deleteFaq(id);
      loadAllData();
      alert('FAQ deleted successfully.');
    } catch (err) {
      alert('Failed to delete FAQ: ' + err.message);
    }
  };

  // Team Member handlers
  const handleSaveTeamMember = async (e) => {
    e.preventDefault();
    try {
      if (editingTeamId) {
        await api.updateTeamMember(editingTeamId, teamForm);
        alert('Team member updated successfully!');
      } else {
        await api.createTeamMember(teamForm);
        alert('Team member added successfully!');
      }
      setShowTeamModal(false);
      setEditingTeamId(null);
      setTeamForm({
        name: '',
        role: '',
        year: '3rd Year (Batch \'24)',
        phone: '',
        email: '',
        bio: '',
        isMainLeader: false
      });
      loadAllData();
    } catch (err) {
      alert('Failed to save team member: ' + err.message);
    }
  };

  const handleEditTeamMember = (member) => {
    setEditingTeamId(member.id);
    setTeamForm({
      name: member.name || '',
      role: member.role || '',
      year: member.year || '3rd Year (Batch \'24)',
      phone: member.phone || '',
      email: member.email || '',
      bio: member.bio || '',
      isMainLeader: Boolean(member.isMainLeader)
    });
    setShowTeamModal(true);
  };

  const handleDeleteTeamMember = async (id) => {
    if (!window.confirm('Are you sure you want to delete this team member?')) return;
    try {
      await api.deleteTeamMember(id);
      loadAllData();
      alert('Team member deleted successfully.');
    } catch (err) {
      alert('Failed to delete team member: ' + err.message);
    }
  };

  // Manifesto handlers
  const handleSaveManifesto = async (e) => {
    e.preventDefault();
    try {
      if (editingManifestoId) {
        await api.updateManifestoPoint(editingManifestoId, manifestoForm);
        alert('Manifesto commitment updated successfully!');
      } else {
        await api.createManifestoPoint(manifestoForm);
        alert('New manifesto commitment added successfully!');
      }
      setShowManifestoModal(false);
      setEditingManifestoId(null);
      setManifestoForm({ num: '', title: '', desc: '', icon: 'Droplet' });
      loadAllData();
    } catch (err) {
      alert('Failed to save manifesto point: ' + err.message);
    }
  };

  const handleEditManifesto = (point) => {
    setEditingManifestoId(point.id);
    setManifestoForm({
      num: point.num || '',
      title: point.title || '',
      desc: point.desc || '',
      icon: point.icon || 'Droplet'
    });
    setShowManifestoModal(true);
  };

  const handleDeleteManifesto = async (id) => {
    if (!window.confirm('Are you sure you want to delete this manifesto point?')) return;
    try {
      await api.deleteManifestoPoint(id);
      loadAllData();
      alert('Manifesto point deleted successfully.');
    } catch (err) {
      alert('Failed to delete manifesto point: ' + err.message);
    }
  };

  // Poster handlers
  const handlePosterFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const uploadRes = await api.uploadFile(file, 'lc1_posters');
        const cdnUrl = uploadRes.secure_url || uploadRes.url;
        setPosterPreview(cdnUrl);
        setPosterUrlInput(cdnUrl);
      } catch (err) {
        console.warn('Cloudinary upload failed, falling back to local file reader:', err);
        const reader = new FileReader();
        reader.onload = (uploadEvent) => {
          const result = uploadEvent.target?.result;
          if (result) {
            setPosterPreview(result);
            setPosterUrlInput(result);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSavePoster = () => {
    if (!posterPreview) return;
    localStorage.setItem('lc1_campaign_poster_image', posterPreview);
    alert('Campaign Poster successfully updated! It is now live across the portal.');
    setShowPosterModal(false);
  };

  const handleResetPoster = () => {
    const defaultPoster = '/images/prashant-diwakar-poster.jpg';
    localStorage.setItem('lc1_campaign_poster_image', defaultPoster);
    setPosterPreview(defaultPoster);
    setPosterUrlInput(defaultPoster);
    alert('Poster reset to default official campaign poster.');
    setShowPosterModal(false);
  };

  // Group tickets by submission type
  const issueTickets = tickets.filter(t => !t.submissionType || t.submissionType === 'Grievance' || t.type === 'Issue');
  const suggestionTickets = tickets.filter(t => t.submissionType === 'Manifesto Suggestion' || t.type === 'Manifesto Suggestion');
  const volunteerTickets = tickets.filter(t => t.submissionType === 'Volunteer Application' || t.type === 'Volunteer Application');

  // Active tickets to show based on selected tab
  const getActiveTabTickets = () => {
    if (activeTab === 'suggestions') return suggestionTickets;
    if (activeTab === 'volunteers') return volunteerTickets;
    return issueTickets;
  };

  // Filtered tickets
  const filteredTickets = getActiveTabTickets().filter(t => {
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || t.category === categoryFilter;
    const matchesSearch = 
      (t.ticketId && t.ticketId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.subject && t.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.studentName && t.studentName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.studentId && t.studentId.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesStatus && matchesCategory && matchesSearch;
  });

  const resolvedIssuesCount = issueTickets.filter(t => t.status === 'Resolved').length;
  const inProgressIssuesCount = issueTickets.filter(t => t.status === 'In Progress').length;
  const pendingIssuesCount = issueTickets.filter(t => t.status === 'Pending').length;

  if (authLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-du-gold border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-du-navy">Loading Campaign Control Room...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      
      {/* Top Admin Header Bar */}
      <div className="bg-gradient-to-r from-du-navy via-slate-900 to-du-dark rounded-3xl p-5 sm:p-8 text-white shadow-xl border border-du-gold/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-du-gold/20 text-du-gold border border-du-gold/40 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Official Candidate & Operations Command Center</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-serif font-black tracking-tight text-white leading-tight">
            Team Prashant Diwakar — Campaign Control Room
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Full administrative control: Manage & solve student campus issues, edit events, update FAQs, edit 6-point manifesto charter, configure team members, and customize campaign assets live.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={() => setShowPosterModal(true)}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold text-xs shadow transition flex items-center justify-center gap-1.5 whitespace-nowrap"
          >
            <ImageIcon className="w-4 h-4" />
            <span>Update Poster</span>
          </button>

          <button
            onClick={() => {
              setEditingNoticeId(null);
              setNoticeForm({
                title: '',
                category: 'Event & Rally',
                type: 'Event',
                description: '',
                eventDate: '',
                eventTime: '',
                venue: '',
                priority: 'Normal',
                isPinned: true,
                linkText: '',
                linkUrl: '',
                contactPerson: 'Team Prashant Diwakar'
              });
              setShowNoticeModal(true);
            }}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-du-gold hover:bg-du-goldLight text-du-navy font-bold text-xs shadow transition flex items-center justify-center gap-1.5 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Event</span>
          </button>
        </div>
      </div>

      {/* 5 High-Impact Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Metric 1: Total Issues Raised */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Campus Issues</span>
            <span className="p-2 rounded-xl bg-rose-50 text-rose-600"><Droplet className="w-4 h-4" /></span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-2">{issueTickets.length}</div>
          <div className="text-[11px] text-rose-600 font-semibold mt-0.5">{pendingIssuesCount} Pending</div>
        </div>

        {/* Metric 2: Active / In Progress */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-blue-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-700">In Progress</span>
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600"><Clock className="w-4 h-4" /></span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-blue-700 mt-2">{inProgressIssuesCount}</div>
          <div className="text-[11px] text-blue-600 mt-0.5">Active Liaison</div>
        </div>

        {/* Metric 3: Solved & Resolved */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-800">Solved & Resolved</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600"><CheckCircle2 className="w-4 h-4" /></span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-700 mt-2">{resolvedIssuesCount}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
            {Math.round((resolvedIssuesCount / (issueTickets.length || 1)) * 100)}% Rate
          </div>
        </div>

        {/* Metric 4: Manifesto Suggestions */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-800">Manifesto Ideas</span>
            <span className="p-2 rounded-xl bg-amber-50 text-amber-700"><Lightbulb className="w-4 h-4" /></span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-700 mt-2">{suggestionTickets.length}</div>
          <div className="text-[11px] text-amber-600 mt-0.5">Student suggestions</div>
        </div>

        {/* Metric 5: Campaign Volunteers */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-du-gold/50 shadow-sm col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-du-navy">Volunteers</span>
            <span className="p-2 rounded-xl bg-du-gold/20 text-du-navy"><HeartHandshake className="w-4 h-4" /></span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-du-navy mt-2">{volunteerTickets.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Coordinators active</div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-2 -mx-3 px-3 sm:mx-0 sm:px-0">
        <button
          onClick={() => { setActiveTab('issues'); setSelectedTicket(null); }}
          className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'issues'
              ? 'bg-du-navy text-du-gold shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Droplet className="w-4 h-4 text-rose-400" />
          <span>🚨 Campus Issues ({issueTickets.length})</span>
        </button>

        <button
          onClick={() => { setActiveTab('suggestions'); setSelectedTicket(null); }}
          className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'suggestions'
              ? 'bg-du-navy text-du-gold shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <span>💡 Ideas ({suggestionTickets.length})</span>
        </button>

        <button
          onClick={() => { setActiveTab('volunteers'); setSelectedTicket(null); }}
          className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'volunteers'
              ? 'bg-du-navy text-du-gold shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <HeartHandshake className="w-4 h-4 text-emerald-400" />
          <span>🤝 Volunteers ({volunteerTickets.length})</span>
        </button>

        <button
          onClick={() => { setActiveTab('events'); setSelectedTicket(null); }}
          className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'events'
              ? 'bg-du-navy text-du-gold shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Megaphone className="w-4 h-4 text-du-gold" />
          <span>📢 Events ({notices.length})</span>
        </button>

        <button
          onClick={() => { setActiveTab('manifesto'); setSelectedTicket(null); }}
          className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'manifesto'
              ? 'bg-du-navy text-du-gold shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4 text-amber-300" />
          <span>📜 Welfare Charter ({manifesto.length})</span>
        </button>

        <button
          onClick={() => { setActiveTab('faqs'); setSelectedTicket(null); }}
          className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'faqs'
              ? 'bg-du-navy text-du-gold shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-du-gold" />
          <span>❓ FAQs ({faqs.length})</span>
        </button>

        <button
          onClick={() => { setActiveTab('team'); setSelectedTicket(null); }}
          className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'team'
              ? 'bg-du-navy text-du-gold shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4 text-du-gold" />
          <span>👥 Team Members ({team.length})</span>
        </button>
      </div>

      {/* Tab 1: Issues | Tab 2: Suggestions | Tab 3: Volunteers */}
      {(activeTab === 'issues' || activeTab === 'suggestions' || activeTab === 'volunteers') && (
        <div className="space-y-4">
          {/* Filter / Search Bar */}
          <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 focus:ring-2 focus:ring-du-gold"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">🟡 Pending Review</option>
                <option value="In Progress">🔵 In Progress</option>
                <option value="Resolved">🟢 Resolved</option>
                <option value="Rejected">🔴 Rejected</option>
              </select>
            </div>

            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by ID, name, roll, subject..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-du-gold focus:outline-none"
              />
            </div>
          </div>

          {/* Mobile Card Stream (Phones) */}
          <div className="block md:hidden space-y-3">
            {filteredTickets.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center text-slate-400 border border-slate-200">
                <Ticket className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="font-semibold text-xs text-slate-600">No records found matching current filters.</p>
              </div>
            ) : (
              filteredTickets.map((t) => (
                <div key={t.id} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-black text-xs text-du-navy bg-du-gold/20 px-2 py-0.5 rounded border border-du-gold/40">
                      #{t.ticketId}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <StatusBadge status={t.status} size="sm" />
                      <PriorityBadge priority={t.priority} />
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{t.subject}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{t.category}</p>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl text-xs space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Student:</span>
                      <span className="font-semibold text-slate-800">
                        {t.isAnonymous ? '🔒 Anonymous Student' : t.studentName}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Assigned:</span>
                      <span className="font-semibold text-du-navy">
                        {t.assignedTo || '⚠️ Unassigned'}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenTicketModal(t)}
                      className="flex-1 py-2.5 rounded-xl bg-du-navy hover:bg-slate-800 text-du-gold font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      <span>Manage & Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteTicket(t.id)}
                      className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition"
                      title="Delete Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop Table View (Laptops/Desktops) */}
          <div className="hidden md:block bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3.5">Ref ID</th>
                    <th className="px-4 py-3.5">Subject & Category</th>
                    <th className="px-4 py-3.5">Student / Submitter</th>
                    <th className="px-4 py-3.5">Assigned To</th>
                    <th className="px-4 py-3.5">Priority & Status</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTickets.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                        <Ticket className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                        <p className="font-semibold text-slate-600">No records found matching current filters.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredTickets.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50/80 transition">
                        <td className="px-4 py-3.5 font-mono font-bold text-du-navy">
                          #{t.ticketId}
                        </td>
                        <td className="px-4 py-3.5 max-w-xs">
                          <div className="font-bold text-slate-800 truncate" title={t.subject}>
                            {t.subject}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {t.category}
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          {t.isAnonymous ? (
                            <span className="inline-flex items-center gap-1 font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                              <EyeOff className="w-3 h-3" /> Anonymous Student
                            </span>
                          ) : (
                            <div>
                              <div className="font-semibold text-slate-800">{t.studentName}</div>
                              <div className="text-[10px] text-slate-400 font-mono">{t.studentId || t.studentEmail}</div>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3.5">
                          {t.assignedTo ? (
                            <span className="font-semibold text-slate-700 flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5 text-du-gold" />
                              {t.assignedTo}
                            </span>
                          ) : (
                            <span className="text-amber-600 font-semibold text-[11px] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              ⚠️ Unassigned
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <StatusBadge status={t.status} size="sm" />
                            <PriorityBadge priority={t.priority} />
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-right space-x-2">
                          <button
                            onClick={() => handleOpenTicketModal(t)}
                            className="px-3 py-1.5 rounded-lg bg-du-navy hover:bg-slate-800 text-du-gold font-bold text-xs shadow-sm transition inline-flex items-center gap-1"
                          >
                            <Settings className="w-3 h-3" />
                            <span>Solve & Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteTicket(t.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition inline-flex items-center"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Campaign Events & Announcements Management */}
      {activeTab === 'events' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <div>
              <h3 className="font-bold text-slate-800 text-base">Campaign Schedule & Events Hub</h3>
              <p className="text-xs text-slate-500">Add, edit, pin to marquee, or delete official campaign events.</p>
            </div>
            <button
              onClick={() => {
                setEditingNoticeId(null);
                setNoticeForm({
                  title: '',
                  category: 'Event & Rally',
                  type: 'Event',
                  description: '',
                  eventDate: '',
                  eventTime: '',
                  venue: '',
                  priority: 'Normal',
                  isPinned: true,
                  linkText: '',
                  linkUrl: '',
                  contactPerson: 'Team Prashant Diwakar'
                });
                setShowNoticeModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-du-gold hover:bg-du-goldLight text-du-navy font-bold text-xs shadow transition flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Event</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notices.map((notice) => (
              <div key={notice.id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full">
                      {notice.category || 'Campaign Event'}
                    </span>
                    {notice.isPinned && (
                      <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Pin className="w-3 h-3" /> Pinned on Marquee
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">{notice.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{notice.description}</p>
                  
                  {notice.eventDate && (
                    <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl space-y-1">
                      <div className="flex items-center gap-1.5 text-du-navy font-semibold">
                        <Calendar className="w-3.5 h-3.5 text-du-gold" />
                        <span>{notice.eventDate} {notice.eventTime ? `• ${notice.eventTime}` : ''}</span>
                      </div>
                      {notice.venue && (
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <MapPin className="w-3.5 h-3.5 text-rose-500" />
                          <span>{notice.venue}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleTogglePinNotice(notice)}
                    className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg transition ${
                      notice.isPinned ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {notice.isPinned ? '📌 Unpin Marquee' : '📍 Pin to Marquee'}
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditNotice(notice)}
                      className="p-2 text-slate-600 hover:text-du-navy hover:bg-slate-100 rounded-lg transition"
                      title="Edit Event"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteNotice(notice.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="Delete Event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Manifesto / 6-Point Welfare Charter Management */}
      {activeTab === 'manifesto' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <div>
              <h3 className="font-bold text-slate-800 text-base">Manifesto & Welfare Charter Management</h3>
              <p className="text-xs text-slate-500">Add, edit, or customize Prashant Kumar Diwakar's key commitments shown on the homepage.</p>
            </div>
            <button
              onClick={() => {
                setEditingManifestoId(null);
                setManifestoForm({
                  num: String(manifesto.length + 1).padStart(2, '0'),
                  title: '',
                  desc: '',
                  icon: 'Droplet'
                });
                setShowManifestoModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-du-gold hover:bg-du-goldLight text-du-navy font-bold text-xs shadow transition flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Commitment Point</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {manifesto.map((pt) => (
              <div 
                key={pt.id || pt.num} 
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-extrabold text-xs text-du-gold bg-slate-900 px-2.5 py-1 rounded-lg">
                      #{pt.num}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{pt.icon || 'Icon'}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">{pt.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{pt.desc}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleEditManifesto(pt)}
                    className="p-2 text-slate-600 hover:text-du-navy hover:bg-slate-100 rounded-lg transition"
                    title="Edit Point"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteManifesto(pt.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Delete Point"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: FAQs Management */}
      {activeTab === 'faqs' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <div>
              <h3 className="font-bold text-slate-800 text-base">Campaign FAQs Management</h3>
              <p className="text-xs text-slate-500">Add, edit, or delete frequently asked questions for students regarding election & welfare charter.</p>
            </div>
            <button
              onClick={() => {
                setEditingFaqId(null);
                setFaqForm({ category: 'Campaign & Vision', question: '', answer: '' });
                setShowFaqModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-du-gold hover:bg-du-goldLight text-du-navy font-bold text-xs shadow transition flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add FAQ</span>
            </button>
          </div>

          <div className="space-y-3">
            {faqs.map((faq) => (
              <div key={faq.id} className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-2 flex items-start justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                    {faq.category}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm">{faq.question}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{faq.answer}</p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => handleEditFaq(faq)}
                    className="p-2 text-slate-500 hover:text-du-navy hover:bg-slate-100 rounded-lg transition"
                    title="Edit FAQ"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteFaq(faq.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Delete FAQ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 7: Team Members Management */}
      {activeTab === 'team' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <div>
              <h3 className="font-bold text-slate-800 text-base">Campaign Team Members Management</h3>
              <p className="text-xs text-slate-500">Add, edit, or delete student coordinators displayed on the homepage and throughout the portal.</p>
            </div>
            <button
              onClick={() => {
                setEditingTeamId(null);
                setTeamForm({
                  name: '',
                  role: '',
                  year: '3rd Year (Batch \'24)',
                  phone: '',
                  email: '',
                  bio: '',
                  isMainLeader: false
                });
                setShowTeamModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-du-gold hover:bg-du-goldLight text-du-navy font-bold text-xs shadow transition flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Team Member</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {team.map((member) => (
              <div 
                key={member.id} 
                className={`bg-white rounded-3xl p-5 border shadow-sm flex flex-col justify-between space-y-4 ${
                  member.isMainLeader ? 'border-du-gold ring-2 ring-du-gold/30' : 'border-slate-200'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                      member.isMainLeader ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {member.isMainLeader ? '👑 Main Leader' : 'Coordinator'}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500">{member.year}</span>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 text-base">{member.name}</h4>
                    <p className="text-xs font-semibold text-du-navy">{member.role}</p>
                    <p className="text-xs text-slate-500 mt-1 font-mono">{member.phone}</p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-2">
                    {member.bio}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleEditTeamMember(member)}
                    className="p-2 text-slate-600 hover:text-du-navy hover:bg-slate-100 rounded-lg transition"
                    title="Edit Member"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTeamMember(member.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Delete Member"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Issue Solver & Assignment Modal (With Complete Edit & Delete Powers) */}
      {selectedTicket && (
        <div 
          className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fadeIn"
          onClick={() => setSelectedTicket(null)}
        >
          <div 
            className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sticky Header with Cross Button */}
            <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-5 sm:px-7 py-4 border-b border-slate-100 flex items-center justify-between gap-3 shadow-sm">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-mono text-xs font-bold bg-du-gold/20 text-du-navy px-2.5 py-0.5 rounded border border-du-gold/30">
                    #{selectedTicket.ticketId}
                  </span>
                  <StatusBadge status={selectedTicket.status} size="sm" />
                  <PriorityBadge priority={selectedTicket.priority} />
                  {selectedTicket.isAnonymous && (
                    <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 flex items-center gap-1">
                      <EyeOff className="w-3 h-3" /> Anonymous
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-slate-900 text-base sm:text-lg truncate">{selectedTicket.subject}</h3>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setIsEditingRecord(!isEditingRecord)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                    isEditingRecord 
                      ? 'bg-du-navy text-du-gold' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>{isEditingRecord ? 'Back to View' : 'Edit Details'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedTicket(null)}
                  className="p-2 rounded-full bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 transition shadow-sm"
                  title="Close Window (Esc)"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* Scrollable Modal Content */}
            <div className="overflow-y-auto p-5 sm:p-7 space-y-5 flex-1 text-xs">
              
              {/* If in Edit Mode: Full Record Edit Form */}
              {isEditingRecord ? (
                <form onSubmit={handleSaveFullRecord} className="space-y-4">
                  <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-amber-900 font-medium">
                    ✏️ Editing Record #{selectedTicket.ticketId}. You can update any field below.
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Subject / Title *</label>
                    <input
                      type="text"
                      required
                      value={recordEditForm.subject}
                      onChange={(e) => setRecordEditForm({ ...recordEditForm, subject: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Category</label>
                      <input
                        type="text"
                        value={recordEditForm.category}
                        onChange={(e) => setRecordEditForm({ ...recordEditForm, category: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-300"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Priority</label>
                      <select
                        value={recordEditForm.priority}
                        onChange={(e) => setRecordEditForm({ ...recordEditForm, priority: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                      >
                        <option value="Normal">Normal</option>
                        <option value="High">High</option>
                        <option value="Urgent">Urgent</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Student Name</label>
                      <input
                        type="text"
                        value={recordEditForm.studentName}
                        onChange={(e) => setRecordEditForm({ ...recordEditForm, studentName: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-300"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Roll Number</label>
                      <input
                        type="text"
                        value={recordEditForm.studentId}
                        onChange={(e) => setRecordEditForm({ ...recordEditForm, studentId: e.target.value.toUpperCase() })}
                        className="w-full p-2.5 rounded-xl border border-slate-300 uppercase font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Phone</label>
                      <input
                        type="text"
                        value={recordEditForm.phone}
                        onChange={(e) => setRecordEditForm({ ...recordEditForm, phone: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Description *</label>
                    <textarea
                      rows="4"
                      required
                      value={recordEditForm.description}
                      onChange={(e) => setRecordEditForm({ ...recordEditForm, description: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300"
                    ></textarea>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingRecord(false)}
                      className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updating}
                      className="px-5 py-2 rounded-xl bg-du-navy text-du-gold font-bold shadow hover:bg-slate-800"
                    >
                      {updating ? 'Saving...' : '💾 Save Changes'}
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  {/* Submitter Details */}
                  <div className="bg-slate-50 rounded-2xl p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <span className="text-slate-400 font-medium">Student Name</span>
                      <p className="font-bold text-slate-800">{selectedTicket.studentName}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium">Student Roll / ID</span>
                      <p className="font-mono font-bold text-slate-800">{selectedTicket.studentId || 'Not Provided'}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium">Contact Phone</span>
                      <p className="font-bold text-slate-800">{selectedTicket.phone || 'Not Provided'}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-400 font-medium">Email</span>
                      <p className="text-slate-600">{selectedTicket.studentEmail}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium">Class / Year</span>
                      <p className="text-slate-700">{selectedTicket.llbYear || '1st Year'} • {selectedTicket.section || 'Sec A'}</p>
                    </div>
                  </div>

                  {/* Issue Description */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description</label>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {selectedTicket.description}
                    </div>
                  </div>

                  {/* 1-Click Assignment Tool */}
                  <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
                    <label className="block text-xs font-bold text-amber-900 flex items-center gap-1.5">
                      <UserPlus className="w-4 h-4 text-amber-700" />
                      <span>Assign Issue to Team Representative / Coordinator:</span>
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <select
                        value={assignedMember}
                        onChange={(e) => setAssignedMember(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl border border-amber-300 text-xs bg-white focus:ring-2 focus:ring-du-gold"
                      >
                        <option value="">-- Select Team Coordinator --</option>
                        {team.map(m => (
                          <option key={m.id} value={`${m.name} (${m.role})`}>{m.name} ({m.role})</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        disabled={updating || !assignedMember}
                        onClick={handleAssignMember}
                        className="px-4 py-2.5 rounded-xl bg-du-navy hover:bg-slate-800 text-du-gold font-bold text-xs transition whitespace-nowrap"
                      >
                        Assign Representative
                      </button>
                    </div>
                  </div>

                  {/* Status Update & Resolution Tool */}
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <label className="block text-xs font-bold text-slate-700">Update Resolution Status & Post Official Note:</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {['Pending', 'In Progress', 'Resolved', 'Rejected'].map(s => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setStatusUpdate(s)}
                          className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                            statusUpdate === s
                              ? 'bg-du-navy text-du-gold border-du-navy shadow-sm'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {s === 'Pending' && '🟡 Pending'}
                          {s === 'In Progress' && '🔵 In Progress'}
                          {s === 'Resolved' && '🟢 Resolved'}
                          {s === 'Rejected' && '🔴 Rejected'}
                        </button>
                      ))}
                    </div>

                    <textarea
                      rows="3"
                      value={statusNote}
                      onChange={(e) => setStatusNote(e.target.value)}
                      placeholder="Write official resolution notes / action taken (e.g. 'Met with Campus Dean regarding water cooler repair...')"
                      className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-du-gold focus:outline-none"
                    ></textarea>
                  </div>
                </>
              )}
            </div>

            {/* Sticky Bottom Action Bar with Close / Save / Delete */}
            <div className="sticky bottom-0 z-20 bg-slate-50 border-t border-slate-200 px-5 sm:px-7 py-3 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => handleDeleteTicket(selectedTicket.id)}
                className="px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Delete Record</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedTicket(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs transition"
                >
                  Exit / Close
                </button>
                <button
                  type="button"
                  disabled={updating}
                  onClick={handleUpdateStatus}
                  className="px-5 py-2.5 rounded-xl bg-du-navy hover:bg-slate-800 text-white font-bold text-xs shadow-md transition"
                >
                  {updating ? 'Saving...' : 'Save Resolution'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Modal: Add / Edit Manifesto Point */}
      {showManifestoModal && (
        <div 
          className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn"
          onClick={() => setShowManifestoModal(false)}
        >
          <div 
            className="relative bg-white rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-5 sm:px-7 py-4 border-b border-slate-100 flex items-center justify-between gap-3 shadow-sm">
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                {editingManifestoId ? 'Edit Welfare Commitment' : 'Add New Welfare Commitment Point'}
              </h3>
              <button 
                onClick={() => setShowManifestoModal(false)} 
                className="p-2 rounded-full bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveManifesto} className="overflow-y-auto p-5 sm:p-7 space-y-4 text-xs flex-1">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Point # (Number)</label>
                  <input
                    type="text"
                    value={manifestoForm.num}
                    onChange={(e) => setManifestoForm({ ...manifestoForm, num: e.target.value })}
                    placeholder="01"
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-center"
                  />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="font-bold text-slate-700">Icon Theme</label>
                  <select
                    value={manifestoForm.icon}
                    onChange={(e) => setManifestoForm({ ...manifestoForm, icon: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Droplet">💧 Droplet (Water)</option>
                    <option value="Library">📖 Library (AC & Books)</option>
                    <option value="Wifi">📶 Wifi (Internet & SCC)</option>
                    <option value="Utensils">🥪 Utensils (Canteen)</option>
                    <option value="Scale">⚖️ Scale (Placement & Legal)</option>
                    <option value="Building2">🏛️ Building (Attendance & Admin)</option>
                    <option value="Flame">🔥 Flame (Urgent Reforms)</option>
                    <option value="Sparkles">✨ Sparkles (Student Welfare)</option>
                    <option value="ShieldCheck">🛡️ ShieldCheck (Security)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Commitment Title *</label>
                <input
                  type="text"
                  required
                  value={manifestoForm.title}
                  onChange={(e) => setManifestoForm({ ...manifestoForm, title: e.target.value })}
                  placeholder="e.g. Guaranteed Clean RO Water"
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Detailed Action Description *</label>
                <textarea
                  rows="3"
                  required
                  value={manifestoForm.desc}
                  onChange={(e) => setManifestoForm({ ...manifestoForm, desc: e.target.value })}
                  placeholder="e.g. Functional RO water coolers with weekly TDS checks and hygiene audit on all floors..."
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowManifestoModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-du-navy text-du-gold font-bold shadow hover:bg-slate-800"
                >
                  {editingManifestoId ? 'Update Commitment' : 'Add Commitment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add / Edit Team Member */}
      {showTeamModal && (
        <div 
          className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn"
          onClick={() => setShowTeamModal(false)}
        >
          <div 
            className="relative bg-white rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-5 sm:px-7 py-4 border-b border-slate-100 flex items-center justify-between gap-3 shadow-sm">
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                {editingTeamId ? 'Edit Team Member' : 'Add New Campaign Team Member'}
              </h3>
              <button 
                onClick={() => setShowTeamModal(false)} 
                className="p-2 rounded-full bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTeamMember} className="overflow-y-auto p-5 sm:p-7 space-y-4 text-xs flex-1">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Full Name *</label>
                <input
                  type="text"
                  required
                  value={teamForm.name}
                  onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                  placeholder="e.g. Prashant Kumar Diwakar"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-du-gold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Role / Designation *</label>
                <input
                  type="text"
                  required
                  value={teamForm.role}
                  onChange={(e) => setTeamForm({ ...teamForm, role: e.target.value })}
                  placeholder="e.g. Candidate for President (LC-1) • Main Leader"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-du-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">LL.B. Year / Batch</label>
                  <select
                    value={teamForm.year}
                    onChange={(e) => setTeamForm({ ...teamForm, year: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="3rd Year (Batch '24)">3rd Year (Batch '24)</option>
                    <option value="2nd Year (Batch '25)">2nd Year (Batch '25)</option>
                    <option value="1st Year (Batch '26)">1st Year (Batch '26)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Contact Phone</label>
                  <input
                    type="text"
                    value={teamForm.phone}
                    onChange={(e) => setTeamForm({ ...teamForm, phone: e.target.value })}
                    placeholder="9876543210"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Email Address</label>
                <input
                  type="email"
                  value={teamForm.email}
                  onChange={(e) => setTeamForm({ ...teamForm, email: e.target.value })}
                  placeholder="prashant@lc1helpdesk.in"
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Bio / Responsibility Description</label>
                <textarea
                  rows="3"
                  value={teamForm.bio}
                  onChange={(e) => setTeamForm({ ...teamForm, bio: e.target.value })}
                  placeholder="Brief description of member's campaign responsibilities..."
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                ></textarea>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isMainLeader"
                  checked={teamForm.isMainLeader}
                  onChange={(e) => setTeamForm({ ...teamForm, isMainLeader: e.target.checked })}
                  className="rounded text-du-gold focus:ring-du-gold"
                />
                <label htmlFor="isMainLeader" className="font-bold text-slate-700 cursor-pointer">
                  👑 Mark as Main Candidate / Presidential Leader
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowTeamModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-du-navy text-du-gold font-bold shadow hover:bg-slate-800"
                >
                  {editingTeamId ? 'Update Member' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Update Campaign Poster */}
      {showPosterModal && (
        <div 
          className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn"
          onClick={() => setShowPosterModal(false)}
        >
          <div 
            className="relative bg-white rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-5 sm:px-7 py-4 border-b border-slate-100 flex items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-du-navy" />
                <h3 className="font-bold text-slate-900 text-base sm:text-lg">Update Campaign Poster</h3>
              </div>
              <button 
                onClick={() => setShowPosterModal(false)} 
                className="p-2 rounded-full bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-5 sm:p-7 space-y-4 text-xs flex-1">
              <p className="text-slate-600 leading-relaxed">
                Upload a new campaign advertising flyer or poster. This poster will automatically appear when visitors open the site or click <strong>"📜 View Campaign Poster"</strong> in the footer.
              </p>

              {/* Upload Image File */}
              <div className="space-y-2">
                <label className="font-bold text-slate-800 block">Option 1: Upload Image File from Phone / PC</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePosterFileUpload}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-slate-50 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-du-navy file:text-du-gold"
                />
              </div>

              {/* Enter Image URL */}
              <div className="space-y-2">
                <label className="font-bold text-slate-800 block">Option 2: Or Paste Poster Image URL</label>
                <input
                  type="text"
                  value={posterUrlInput}
                  onChange={(e) => {
                    setPosterUrlInput(e.target.value);
                    setPosterPreview(e.target.value);
                  }}
                  placeholder="e.g. /images/prashant-diwakar-poster.jpg or https://..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-xs"
                />
              </div>

              {/* Live Preview */}
              {posterPreview && (
                <div className="space-y-1.5 pt-2">
                  <label className="font-bold text-slate-700 block">Poster Live Preview:</label>
                  <div className="max-h-56 overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 flex items-center justify-center p-2">
                    <img
                      src={posterPreview}
                      alt="Campaign Poster Preview"
                      className="max-h-52 object-contain mx-auto rounded-lg shadow"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 z-20 bg-slate-50 border-t border-slate-200 px-5 sm:px-7 py-3 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleResetPoster}
                className="text-xs font-semibold text-rose-600 hover:text-rose-800 underline"
              >
                Reset Default
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowPosterModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleSavePoster}
                  className="px-5 py-2 rounded-xl bg-du-navy text-du-gold font-bold shadow hover:bg-slate-800"
                >
                  💾 Save Active Poster
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Modal: Publish / Edit Campaign Event */}
      {showNoticeModal && (
        <div 
          className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn"
          onClick={() => setShowNoticeModal(false)}
        >
          <div 
            className="relative bg-white rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-5 sm:px-7 py-4 border-b border-slate-100 flex items-center justify-between gap-3 shadow-sm">
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                {editingNoticeId ? 'Edit Campaign Event' : 'Publish New Campaign Event'}
              </h3>
              <button 
                onClick={() => setShowNoticeModal(false)} 
                className="p-2 rounded-full bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNotice} className="overflow-y-auto p-5 sm:p-7 space-y-4 text-xs flex-1">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Event / Announcement Title *</label>
                <input
                  type="text"
                  required
                  value={noticeForm.title}
                  onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                  placeholder="e.g. Student Open Mic & Campaign Meet with Prashant Diwakar"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-du-gold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Category</label>
                  <select
                    value={noticeForm.category}
                    onChange={(e) => setNoticeForm({ ...noticeForm, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Event & Rally">Event & Rally</option>
                    <option value="Workshop & Legal Aid">Workshop & Legal Aid</option>
                    <option value="Manifesto Release">Manifesto Release</option>
                    <option value="Campus Notice">Campus Notice</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Date & Time</label>
                  <input
                    type="text"
                    value={noticeForm.eventDate}
                    onChange={(e) => setNoticeForm({ ...noticeForm, eventDate: e.target.value })}
                    placeholder="e.g. 26th Aug 2026, 3:00 PM"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Venue / Location</label>
                <input
                  type="text"
                  value={noticeForm.venue}
                  onChange={(e) => setNoticeForm({ ...noticeForm, venue: e.target.value })}
                  placeholder="e.g. Faculty Law Canteen Area / Room 102, LC-1"
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Event Description *</label>
                <textarea
                  rows="3"
                  required
                  value={noticeForm.description}
                  onChange={(e) => setNoticeForm({ ...noticeForm, description: e.target.value })}
                  placeholder="Describe the agenda, speakers, and significance for LC-1 students..."
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                ></textarea>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isPinned"
                  checked={noticeForm.isPinned}
                  onChange={(e) => setNoticeForm({ ...noticeForm, isPinned: e.target.checked })}
                  className="rounded text-du-gold focus:ring-du-gold"
                />
                <label htmlFor="isPinned" className="font-bold text-slate-700 cursor-pointer">
                  Pin this event to the Top Notification Marquee Bar
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNoticeModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-du-navy text-du-gold font-bold shadow hover:bg-slate-800"
                >
                  {editingNoticeId ? 'Update Event' : 'Publish Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Publish / Edit FAQ */}
      {showFaqModal && (
        <div 
          className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn"
          onClick={() => setShowFaqModal(false)}
        >
          <div 
            className="relative bg-white rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-5 sm:px-7 py-4 border-b border-slate-100 flex items-center justify-between gap-3 shadow-sm">
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                {editingFaqId ? 'Edit Campaign FAQ' : 'Add New Campaign FAQ'}
              </h3>
              <button 
                onClick={() => setShowFaqModal(false)} 
                className="p-2 rounded-full bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFaq} className="overflow-y-auto p-5 sm:p-7 space-y-4 text-xs flex-1">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Question *</label>
                <input
                  type="text"
                  required
                  value={faqForm.question}
                  onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                  placeholder="e.g. How will Team Prashant ensure 10 PM library timings?"
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Answer *</label>
                <textarea
                  rows="4"
                  required
                  value={faqForm.answer}
                  onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                  placeholder="Provide detailed answer explaining candidate roadmap..."
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowFaqModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-du-navy text-du-gold font-bold shadow hover:bg-slate-800"
                >
                  {editingFaqId ? 'Update FAQ' : 'Add FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
