import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  Send, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  ShieldCheck, 
  Copy, 
  Check, 
  ArrowRight,
  Droplet,
  Wifi,
  Library,
  Utensils,
  Building2,
  Bus,
  Scale,
  Sparkles,
  Lightbulb,
  HeartHandshake,
  UserCheck,
  Megaphone,
  HelpCircle
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export function RaiseTicket() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [submissionType, setSubmissionType] = useState('Issue'); // 'Issue' | 'Manifesto Suggestion' | 'Volunteer Application'

  const [formData, setFormData] = useState({
    studentName: '',
    studentEmail: '',
    studentId: '',
    llbYear: '1st Year',
    section: 'Section A',
    phone: '',
    category: 'Water & Washroom Hygiene',
    subject: '',
    description: '',
    priority: 'Normal',
    isAnonymous: false,
    attachmentName: ''
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successTicket, setSuccessTicket] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const typeFromUrl = searchParams.get('type');
    if (typeFromUrl) {
      if (typeFromUrl.toLowerCase().includes('sugg')) {
        setSubmissionType('Manifesto Suggestion');
        setFormData(prev => ({ ...prev, category: 'General Suggestion for LC-1' }));
      } else if (typeFromUrl.toLowerCase().includes('vol')) {
        setSubmissionType('Volunteer Application');
        setFormData(prev => ({ ...prev, category: 'On-Ground Campaigning & Event Organizing' }));
      } else {
        setSubmissionType('Issue');
      }
    }

    const catFromUrl = searchParams.get('cat');
    if (catFromUrl) {
      setFormData(prev => ({ ...prev, category: catFromUrl }));
    }

    if (user) {
      setFormData(prev => ({
        ...prev,
        studentName: user.name || '',
        studentEmail: user.email || '',
        studentId: user.studentId || '',
        llbYear: user.llbYear || '1st Year',
        section: user.section || 'Section A',
        phone: user.phone || ''
      }));
    }
  }, [searchParams, user]);

  const issueCategories = [
    { id: 'Water & Washroom Hygiene', label: '💧 Water & Washroom Hygiene', icon: Droplet },
    { id: 'Wi-Fi & Digital Connectivity', label: '📶 Wi-Fi & Digital Connectivity', icon: Wifi },
    { id: 'Library AC & 10 PM Timings', label: '📖 Library AC & Extended 10 PM Timings', icon: Library },
    { id: 'Canteen Food Quality & Rates', label: '🥪 Canteen Hygiene & Subsidized Rates', icon: Utensils },
    { id: 'Exams & Samarth Portal Help', label: '📝 Exams & Samarth Portal Assistance', icon: FileText },
    { id: 'Faculty Admin & Attendance Redressal', label: '🏛️ Faculty Admin & Attendance Issues', icon: Building2 },
    { id: 'Metro E-Rickshaw & Parking', label: '🚌 Metro Commute & Parking Welfare', icon: Bus },
    { id: 'Moot Court Society & Placements', label: '⚖️ Moot Court & Internship Support', icon: Scale },
    { id: 'Other Issues / Campus Matters', label: '📌 Other Issues & General Issues', icon: HelpCircle },
  ];

  const manifestoCategories = [
    { id: 'Infrastructure & Library Upgrades', label: '🏛️ Infrastructure & Smart Classrooms', icon: Building2 },
    { id: 'Academic Reform & Timetable', label: '📚 Academic & Attendance Reforms', icon: FileText },
    { id: 'Internship & Placement Cell Revival', label: '⚖️ Placement Cell & Internship Drive', icon: Scale },
    { id: 'Women Student Welfare & Safety', label: '🌸 Women Student Welfare & Common Room', icon: Sparkles },
    { id: 'Sports, Moot Court & Cultural Fests', label: '🏆 Annual Fest & Sports Tournaments', icon: Megaphone },
    { id: 'General Suggestion for LC-1', label: '💡 General Idea / Vision for LC-1', icon: Lightbulb },
  ];

  const volunteerRoles = [
    { id: '1st Year Batch Coordinator', label: '👨‍🎓 1st Year Batch Coordinator (Batch \'26)', icon: UserCheck },
    { id: '2nd Year Batch Coordinator', label: '👩‍🎓 2nd Year Batch Coordinator (Batch \'25)', icon: UserCheck },
    { id: '3rd Year Batch Coordinator', label: '⚖️ 3rd Year Batch Coordinator (Batch \'24)', icon: UserCheck },
    { id: 'Social Media & Content Team', label: '📱 Social Media & Digital Outreach', icon: Sparkles },
    { id: 'On-Ground Campaigning & Event Organizing', label: '🤝 On-Ground Campaign & Event Volunteer', icon: HeartHandshake },
  ];

  const getActiveCategories = () => {
    if (submissionType === 'Manifesto Suggestion') return manifestoCategories;
    if (submissionType === 'Volunteer Application') return volunteerRoles;
    return issueCategories;
  };

  const handleTypeChange = (newType) => {
    setSubmissionType(newType);
    setError('');
    if (newType === 'Manifesto Suggestion') {
      setFormData(prev => ({ ...prev, category: 'General Suggestion for LC-1', subject: '' }));
    } else if (newType === 'Volunteer Application') {
      setFormData(prev => ({ ...prev, category: 'On-Ground Campaigning & Event Organizing', subject: 'Volunteer Application for Team Prashant Diwakar' }));
    } else {
      setFormData(prev => ({ ...prev, category: 'Water & Washroom Hygiene', subject: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFormData(prev => ({ ...prev, attachmentName: file.name }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      let attachmentUrl = null;
      if (selectedFile) {
        try {
          const uploadRes = await api.uploadFile(selectedFile, 'lc1_issues');
          attachmentUrl = uploadRes?.secure_url || uploadRes?.url || null;
        } catch (uploadErr) {
          console.warn('Cloudinary upload fallback:', uploadErr);
        }
      }

      const payload = {
        type: submissionType,
        ...formData,
        attachmentUrl
      };

      const res = await api.createTicket(payload);
      setSuccessTicket(res.ticket);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.message || 'Failed to submit. Please verify all details and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const copyTicketId = () => {
    if (successTicket?.ticketId) {
      navigator.clipboard.writeText(successTicket.ticketId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-du-navy bg-du-gold/20 px-3 py-1 rounded-full border border-du-gold/40">
          LC-1 Presidential Election 2026 • Student Connect
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-slate-900 leading-tight">
          {submissionType === 'Issue' && 'Raise a Campus Issue & Issue'}
          {submissionType === 'Manifesto Suggestion' && 'Give Your Idea for LC-1 Manifesto'}
          {submissionType === 'Volunteer Application' && 'Join Team Prashant Diwakar'}
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm">
          {submissionType === 'Issue' && 'Tell Team Prashant Diwakar about any issue in LC-1. We will inspect, represent, and resolve it.'}
          {submissionType === 'Manifesto Suggestion' && 'What changes do you want in Law Centre-1? Your suggestions will directly shape Prashant Diwakar’s official manifesto.'}
          {submissionType === 'Volunteer Application' && 'Be the voice of your class! Join our core campaign committee, batch coordinators, and digital team.'}
        </p>
      </div>

      {/* 3 Top Submission Type Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-1.5 bg-slate-200/80 rounded-2xl">
        <button
          type="button"
          onClick={() => handleTypeChange('Issue')}
          className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
            submissionType === 'Issue'
              ? 'bg-du-navy text-du-gold shadow-md ring-2 ring-du-navy'
              : 'text-slate-700 hover:text-slate-900 bg-white/60 hover:bg-white'
          }`}
        >
          <Droplet className="w-4 h-4 text-rose-400" />
          <span>1. Raise Campus Issue</span>
        </button>

        <button
          type="button"
          onClick={() => handleTypeChange('Manifesto Suggestion')}
          className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
            submissionType === 'Manifesto Suggestion'
              ? 'bg-du-navy text-du-gold shadow-md ring-2 ring-du-navy'
              : 'text-slate-700 hover:text-slate-900 bg-white/60 hover:bg-white'
          }`}
        >
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <span>2. Manifesto Suggestion</span>
        </button>

        <button
          type="button"
          onClick={() => handleTypeChange('Volunteer Application')}
          className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
            submissionType === 'Volunteer Application'
              ? 'bg-du-navy text-du-gold shadow-md ring-2 ring-du-navy'
              : 'text-slate-700 hover:text-slate-900 bg-white/60 hover:bg-white'
          }`}
        >
          <HeartHandshake className="w-4 h-4 text-emerald-400" />
          <span>3. Join Campaign Team</span>
        </button>
      </div>

      {/* Success View */}
      {successTicket ? (
        <div className="bg-white rounded-3xl border border-emerald-200 p-8 sm:p-12 shadow-xl text-center space-y-6 animate-scaleUp">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {submissionType === 'Manifesto Suggestion' ? '💡 Suggestion Received' : (submissionType === 'Volunteer Application' ? '🤝 Volunteer Application Received' : '🚨 Issue Registered')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              {submissionType === 'Manifesto Suggestion'
                ? 'Thank you for shaping the LC-1 Manifesto!'
                : (submissionType === 'Volunteer Application'
                  ? 'Welcome to Team Prashant Diwakar!'
                  : 'Your Issue has been logged successfully!')}
            </h2>
            <p className="text-slate-600 text-sm max-w-md mx-auto">
              {submissionType === 'Manifesto Suggestion'
                ? 'Prashant Kumar Diwakar and our manifesto committee will review your idea for incorporation into the official 10-Point Student Charter.'
                : (submissionType === 'Volunteer Application'
                  ? 'Our batch coordinator will contact you on WhatsApp/Phone to assign your role.'
                  : 'Team Prashant Diwakar is on it. You can track live updates using your unique Tracking ID.')}
            </p>
          </div>

          {/* Reference ID card */}
          <div className="bg-slate-50 rounded-2xl p-5 max-w-md mx-auto border border-slate-200 space-y-2">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Your Reference ID</span>
            <div className="flex items-center justify-center gap-2">
              <span className="font-mono text-xl sm:text-2xl font-extrabold text-du-navy">
                #{successTicket.ticketId}
              </span>
              <button
                onClick={copyTicketId}
                className="p-2 text-slate-500 hover:text-du-navy rounded-lg hover:bg-slate-200 transition"
                title="Copy ID"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            {copied && <p className="text-[11px] text-emerald-600 font-medium">Tracking ID copied to clipboard!</p>}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to={`/track?id=${encodeURIComponent(successTicket.ticketId)}`}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs bg-du-gold hover:bg-du-goldLight text-du-navy shadow transition flex items-center justify-center gap-1.5"
            >
              <span>Track Live Status</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => {
                setSuccessTicket(null);
                setFormData(prev => ({ ...prev, subject: '', description: '' }));
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            >
              Submit Another Response
            </button>
          </div>
        </div>
      ) : (
        /* Submission Form Card */
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xl space-y-8">
          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Step 1: Category / Role Selection */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                1. Select {submissionType === 'Manifesto Suggestion' ? 'Manifesto Theme' : (submissionType === 'Volunteer Application' ? 'Volunteer Role' : 'Issue Category')} <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {getActiveCategories().map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = formData.category === cat.id;
                  return (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setFormData({ ...formData, category: cat.id })}
                      className={`p-3.5 rounded-2xl text-left text-xs font-bold border transition flex items-center gap-2.5 ${
                        isSelected
                          ? 'border-du-gold bg-amber-50/80 text-du-navy ring-2 ring-du-gold/30 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      }`}
                    >
                      <Icon className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-du-navy' : 'text-slate-400'}`} />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Student Details (LC-1 Verified Fields) */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  2. Student & Batch Details (LC-1 Verified) <span className="text-rose-500">*</span>
                </label>
                {submissionType === 'Issue' && (
                  <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.isAnonymous}
                      onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                      className="rounded text-du-gold focus:ring-du-gold"
                    />
                    <span>Keep My Identity Anonymous</span>
                  </label>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    placeholder="e.g. Prashant Diwakar"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-du-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    LC-1 Roll Number / Student ID <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.studentId}
                    onChange={(e) => {
                      const val = e.target.value.toUpperCase();
                      let y = formData.llbYear;
                      if (val.startsWith('24')) y = '3rd Year';
                      else if (val.startsWith('25')) y = '2nd Year';
                      else if (val.startsWith('26')) y = '1st Year';
                      setFormData({ ...formData, studentId: val, llbYear: y });
                    }}
                    placeholder="e.g. 26LC10124, 25LC10567, 24LC10999"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-du-gold focus:outline-none uppercase"
                  />
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    💡 Batch prefix: <strong>26</strong> = 1st Yr | <strong>25</strong> = 2nd Yr | <strong>24</strong> = 3rd Yr
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">LL.B. Year</label>
                  <select
                    value={formData.llbYear}
                    onChange={(e) => setFormData({ ...formData, llbYear: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-du-gold"
                  >
                    <option value="1st Year">1st Year (Batch '26)</option>
                    <option value="2nd Year">2nd Year (Batch '25)</option>
                    <option value="3rd Year">3rd Year (Batch '24)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Section</label>
                  <select
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-du-gold"
                  >
                    {['Section A', 'Section B', 'Section C', 'Section D', 'Section E', 'Section F', 'Section G', 'Section H', 'Section I', 'Section J', 'Section K'].map(sec => (
                      <option key={sec} value={sec}>{sec}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp / Calling No.</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 6206319802"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-du-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">DU / Personal Email</label>
                <input
                  type="email"
                  required
                  value={formData.studentEmail}
                  onChange={(e) => setFormData({ ...formData, studentEmail: e.target.value })}
                  placeholder="e.g. name@lc1.du.ac.in"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-du-gold"
                />
              </div>
            </div>

            {/* Step 3: Issue / Suggestion Content */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                3. {submissionType === 'Manifesto Suggestion' ? 'Your Manifesto Idea / Proposal' : (submissionType === 'Volunteer Application' ? 'Volunteer Note & Availability' : 'Issue Description')} <span className="text-rose-500">*</span>
              </label>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subject / Summary Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder={
                    submissionType === 'Manifesto Suggestion'
                      ? 'e.g. Remote proxy access for SCC Online & Manupatra off-campus'
                      : (submissionType === 'Volunteer Application'
                        ? 'e.g. Ready to lead 1st Year Section B campaign mobilization'
                        : 'e.g. Non-functional water cooler on 2nd Floor LC-1')
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-du-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Detailed Description & Suggestions <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={
                    submissionType === 'Manifesto Suggestion'
                      ? 'Describe your idea in detail. What is the current problem and how should Prashant Kumar Diwakar address it in the student council?'
                      : (submissionType === 'Volunteer Application'
                        ? 'Tell us why you want to support Prashant Diwakar and how you can contribute (e.g. class coordination, poster distribution, digital media).'
                        : 'Provide exact location (room number, floor, department) and details so our team can immediately inspect.')
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-du-gold leading-relaxed"
                />
              </div>

              {/* Priority Selection for Issue */}
              {submissionType === 'Issue' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Urgency Level</label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {['Normal', 'High', 'Urgent'].map((p) => (
                      <button
                        type="button"
                        key={p}
                        onClick={() => setFormData({ ...formData, priority: p })}
                        className={`py-2 rounded-xl font-bold border transition ${
                          formData.priority === p
                            ? p === 'Urgent'
                              ? 'bg-rose-100 text-rose-800 border-rose-300 ring-2 ring-rose-200'
                              : 'bg-du-gold/30 text-du-navy border-du-gold ring-2 ring-du-gold/30'
                            : 'border-slate-200 text-slate-600 bg-white'
                        }`}
                      >
                        {p === 'Urgent' ? '🔴 Urgent' : (p === 'High' ? '🟠 High' : '🟢 Normal')}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Optional Attachment */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Attach Photo / Document (Optional)
                </label>
                <label className="border-2 border-dashed border-slate-200 hover:border-du-gold rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer bg-slate-50/60 hover:bg-slate-50 transition text-center">
                  <UploadCloud className="w-6 h-6 text-slate-400 mb-1" />
                  <span className="text-xs font-semibold text-slate-700">
                    {selectedFile ? selectedFile.name : 'Upload photo of issue / suggestion note'}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, PDF up to 10MB</span>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*,.pdf"
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-du-gold flex-shrink-0" />
                <span>All submissions are directly monitored by Team Prashant Diwakar.</span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-du-gold hover:from-amber-400 hover:to-du-goldLight text-du-navy shadow-lg transition transform hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <span>Registering...</span>
                ) : (
                  <>
                    <span>
                      {submissionType === 'Manifesto Suggestion'
                        ? 'Submit Manifesto Idea'
                        : (submissionType === 'Volunteer Application'
                          ? 'Join Team Prashant'
                          : 'Submit Issue')}
                    </span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
