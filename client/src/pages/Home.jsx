import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Flame, 
  Phone, 
  Mail, 
  Users,
  Award,
  Sparkles,
  ExternalLink,
  Droplet,
  Wifi,
  Library,
  Utensils,
  Building2,
  Bus,
  Scale,
  Lightbulb,
  HeartHandshake,
  Megaphone,
  Calendar,
  Instagram,
  Check,
  Crown
} from 'lucide-react';
import { api } from '../services/api';
import { StatusBadge, PriorityBadge } from '../components/StatusBadge';

const iconMap = {
  Droplet,
  Library,
  Wifi,
  Utensils,
  Scale,
  Building2,
  Flame,
  Sparkles,
  ShieldCheck,
  Award
};

const defaultManifesto = [
  {
    id: 'mf_01',
    num: '01',
    title: 'Guaranteed Clean RO Water',
    desc: 'Functional RO water coolers with weekly TDS checks and hygiene audit on all floors.',
    icon: 'Droplet'
  },
  {
    id: 'mf_02',
    num: '02',
    title: '10 PM Library AC & Reading Room',
    desc: 'Extended library hours till 10:00 PM during exam months with working air-conditioning.',
    icon: 'Library'
  },
  {
    id: 'mf_03',
    num: '03',
    title: 'High-Speed Campus Wi-Fi',
    desc: 'High-speed Wi-Fi across LC-1 classrooms and remote off-campus proxy for SCC Online / Manupatra.',
    icon: 'Wifi'
  },
  {
    id: 'mf_04',
    num: '04',
    title: 'Hygienic Canteen & Subsidized Food',
    desc: 'Quality inspection of canteen food, strict hygiene protocols, and affordable student pricing.',
    icon: 'Utensils'
  },
  {
    id: 'mf_05',
    num: '05',
    title: 'Placement & Internship Cell Revival',
    desc: 'Dedicated placement cell connecting LC-1 students with top tier law firms, senior advocates & NGOs.',
    icon: 'Scale'
  },
  {
    id: 'mf_06',
    num: '06',
    title: 'Transparent Attendance Dispute Redressal',
    desc: 'Student representation in medical leave clearance and issue hearings before detention lists.',
    icon: 'Building2'
  },
  {
    id: 'mf_07',
    num: '07',
    title: 'Formation of Corporate Law Society',
    desc: 'Establishment of dedicated LC-1 Corporate Law Society for corporate mooting, M&A workshops, tier-1 law firm networking, and specialized commercial law seminars.',
    icon: 'Scale'
  }
];

export function Home({ onSelectNotice, onOpenPoster }) {
  const navigate = useNavigate();
  const [trackInput, setTrackInput] = useState('');
  const [notices, setNotices] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [team, setTeam] = useState([]);
  const [manifesto, setManifesto] = useState(defaultManifesto);
  const [stats, setStats] = useState({ total: 148, pending: 22, inProgress: 18, resolved: 108, resolutionRate: 88 });
  const [recentTickets, setRecentTickets] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [noticesRes, faqsRes, teamRes, statsRes, ticketsRes, manifestoRes] = await Promise.all([
          api.getNotices(),
          api.getFaqs(),
          api.getTeam(),
          api.getStats(),
          api.getTickets(),
          api.getManifesto().catch(() => ({ manifesto: defaultManifesto }))
        ]);
        setNotices(noticesRes.notices || []);
        setFaqs(faqsRes.faqs || []);
        setTeam(teamRes.team || []);
        if (manifestoRes?.manifesto?.length > 0) setManifesto(manifestoRes.manifesto);
        if (statsRes.stats) setStats(statsRes.stats);
        if (ticketsRes.tickets) setRecentTickets(ticketsRes.tickets.slice(0, 4));
      } catch (err) {
        console.error('Failed to load home data:', err);
      }
    }
    loadData();
  }, []);

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (!trackInput.trim()) return;
    navigate(`/track?id=${encodeURIComponent(trackInput.trim())}`);
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section: Exact Premium Campus Design with Candidate Photo */}
      <section className="relative overflow-hidden bg-slate-950 text-white pt-10 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        
        {/* Background Image - Prashant Kumar Diwakar Addressing Students (Bright & Crisp) */}
        <div 
          className="absolute inset-0 bg-cover bg-top md:bg-[center_top_12%] bg-no-repeat brightness-110 contrast-105"
          style={{ backgroundImage: `url('/images/prashant-speaking-bg.jpg')` }}
        ></div>

        {/* Translucent Soft Overlay - Keeps Prashant clearly visible */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/45 via-slate-950/60 to-slate-950/90 backdrop-blur-[0.2px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-slate-950/40 to-slate-950/92 pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto space-y-10 z-10">
          
          {/* Presidential Badges & Slogans */}
          <div className="text-center space-y-4 max-w-4xl mx-auto">
            {/* Outlined Gold Pill Badge */}
            <div className="inline-flex flex-wrap sm:flex-nowrap items-center justify-center gap-2 sm:gap-2.5 px-3.5 sm:px-4 py-1.5 rounded-2xl sm:rounded-full bg-slate-900/90 text-du-gold border border-amber-500/60 text-xs sm:text-sm font-semibold uppercase tracking-wider shadow-xl backdrop-blur-md max-w-full mx-auto">
              <span className="inline-flex items-center gap-1 text-[11px] font-black text-amber-300 bg-slate-950 border border-amber-400/60 px-2 py-0.5 rounded whitespace-nowrap shrink-0">
                <span>☀️</span> LC-1
              </span>
              <span className="text-amber-400 font-bold text-[10px] sm:text-xs tracking-wider text-center">
                PRESIDENTIAL ELECTION 2026 • FACULTY OF LAW, UNIVERSITY OF DELHI
              </span>
            </div>

            {/* Slogan Headings */}
            <div className="space-y-2 pt-2">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-sans font-black tracking-tight text-white leading-tight drop-shadow-lg">
                स्टूडेंट सपोर्ट की नई शुरुआत
              </h1>
              <p className="text-3xl sm:text-5xl lg:text-6xl font-sans font-black text-amber-400 tracking-normal leading-tight drop-shadow-md">
                प्रशांत और आपका साथ
              </p>
            </div>

            {/* Decorative Gold Divider */}
            <div className="flex items-center justify-center gap-2 text-amber-400/80 py-1">
              <div className="w-20 sm:w-28 h-[1px] bg-gradient-to-r from-transparent via-amber-400/60 to-amber-400"></div>
              <span className="text-xs">✦</span>
              <div className="w-20 sm:w-28 h-[1px] bg-gradient-to-l from-transparent via-amber-400/60 to-amber-400"></div>
            </div>

            {/* Subtitle */}
            <p className="text-slate-200 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed drop-shadow">
              <strong>Prashant Kumar Diwakar</strong> — Candidate for President, Law Centre-1. Standing with every student for transparent governance, genuine campus reforms, and 24/7 accessible issue redressal.
            </p>
          </div>

          {/* 3 Main Direct Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {/* Card 1: 🚨 Raise Campus Issue */}
            <Link
              to="/raise-ticket?type=Issue"
              className="group bg-slate-900/80 hover:bg-slate-900 border border-slate-700/80 hover:border-rose-500/80 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition duration-300 backdrop-blur-md flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-110 transition">
                  <Droplet className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg sm:text-xl">Raise Campus Issue</h3>
                  <p className="text-xs text-slate-300 leading-relaxed mt-1.5">
                    RO Water, Washroom hygiene, 10 PM Library AC, Attendance issues, or Canteen food quality.
                  </p>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-rose-400 group-hover:text-rose-300">
                <span>Submit Issue</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition" />
              </div>
            </Link>

            {/* Card 2: 💡 Submit Manifesto Idea */}
            <Link
              to="/raise-ticket?type=Manifesto+Suggestion"
              className="group bg-slate-900/80 hover:bg-slate-900 border border-slate-700/80 hover:border-amber-400/80 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition duration-300 backdrop-blur-md flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300 group-hover:scale-110 transition">
                  <Lightbulb className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg sm:text-xl">Manifesto Suggestion</h3>
                  <p className="text-xs text-slate-300 leading-relaxed mt-1.5">
                    Tell us what reforms Law Centre-1 needs. Your ideas will directly shape Prashant's election agenda.
                  </p>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-amber-300 group-hover:text-amber-200">
                <span>Add Your Idea</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition" />
              </div>
            </Link>

            {/* Card 3: 🤝 Join Campaign Team */}
            <Link
              to="/raise-ticket?type=Volunteer+Application"
              className="group bg-slate-900/80 hover:bg-slate-900 border border-slate-700/80 hover:border-emerald-400/80 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition duration-300 backdrop-blur-md flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-400/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 group-hover:scale-110 transition">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg sm:text-xl">Join Campaign Team</h3>
                  <p className="text-xs text-slate-300 leading-relaxed mt-1.5">
                    Be the voice of your batch! Join as 1st, 2nd, or 3rd year Batch Coordinator, event organizer, or digital volunteer.
                  </p>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-400 group-hover:text-emerald-300">
                <span>Join Now</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition" />
              </div>
            </Link>
          </div>

          {/* Live Status Tracker Bar & Poster Button */}
          <div className="max-w-2xl mx-auto bg-white/10 border border-white/20 p-2.5 sm:p-3 rounded-2xl backdrop-blur-lg flex flex-col sm:flex-row items-center gap-2.5">
            <form onSubmit={handleTrackSubmit} className="flex items-center gap-2 flex-1 w-full">
              <Search className="w-4 h-4 text-du-gold ml-2 flex-shrink-0" />
              <input
                type="text"
                value={trackInput}
                onChange={(e) => setTrackInput(e.target.value)}
                placeholder="Track Tracking ID (e.g. LC1-2026-10492)..."
                className="bg-transparent text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none w-full"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl font-bold text-xs bg-du-gold hover:bg-du-goldLight text-du-navy transition shadow flex-shrink-0"
              >
                Track
              </button>
            </form>

            {onOpenPoster && (
              <button
                type="button"
                onClick={onOpenPoster}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 transition whitespace-nowrap"
              >
                📜 View Campaign Poster
              </button>
            )}
          </div>

        </div>
      </section>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section 1: Upcoming Campaign Events & Townhalls */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-du-navy bg-du-gold/20 px-3 py-0.5 rounded-full border border-du-gold/40 uppercase tracking-wider mb-1">
                <Megaphone className="w-3.5 h-3.5" />
                <span>Campaign Schedule</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
                Join Upcoming Campaign Events & Masterclasses
              </h2>
            </div>
            <Link
              to="/announcements"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-du-navy bg-du-gold hover:bg-du-goldLight px-4 py-2.5 rounded-xl shadow transition"
            >
              <span>View Full Campaign Schedule</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {notices.slice(0, 4).map((event) => (
              <div
                key={event.id}
                onClick={() => onSelectNotice && onSelectNotice(event)}
                className="bg-white rounded-3xl border border-slate-200/80 hover:border-du-gold/70 p-6 shadow-sm hover:shadow-lg transition cursor-pointer flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-du-gold/20 text-du-navy border border-du-gold/30">
                      {event.category || 'Campaign Event'}
                    </span>
                    <PriorityBadge priority={event.priority} />
                  </div>

                  <h3 className="font-bold text-slate-900 text-lg group-hover:text-primary-700 transition font-serif">
                    {event.title}
                  </h3>

                  {event.eventDate && (
                    <div className="text-xs text-amber-900 font-semibold bg-amber-50 p-2.5 rounded-xl border border-amber-200 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-amber-700 flex-shrink-0" />
                      <span>{event.eventDate}</span>
                      {event.venue && <span>• 📍 {event.venue}</span>}
                    </div>
                  )}

                  <p className="text-slate-600 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                    {event.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Organized by: <strong className="text-du-navy">{event.publishedBy}</strong></span>
                  <span className="font-bold text-primary-600 group-hover:text-du-navy flex items-center gap-1">
                    <span>Details & RSVP</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: 6-Point Student Welfare Charter (Manifesto Highlights) */}
        <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-800 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-du-gold bg-du-gold/10 px-3.5 py-1 rounded-full border border-du-gold/30">
              Prashant Kumar Diwakar's Commitments
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-extrabold text-white">
              {manifesto.length}-Point Action Charter for Law Centre-1
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm">
              Non-negotiable core student welfare commitments that Prashant Kumar Diwakar will implement on Day 1.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {manifesto.map((pt) => {
              const Icon = iconMap[pt.icon] || Droplet;
              return (
                <div
                  key={pt.id || pt.num}
                  className="bg-white/5 border border-white/10 hover:border-du-gold/60 rounded-2xl p-5 space-y-3 transition hover:bg-white/[0.08]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-extrabold text-xs text-du-gold bg-du-gold/20 px-2.5 py-0.5 rounded">
                      #{pt.num}
                    </span>
                    <Icon className="w-5 h-5 text-du-gold" />
                  </div>
                  <h3 className="font-bold text-white text-sm leading-snug">{pt.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{pt.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center pt-2">
            <Link
              to="/raise-ticket?type=Manifesto+Suggestion"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm bg-du-gold hover:bg-du-goldLight text-du-navy shadow-lg transition transform hover:-translate-y-0.5"
            >
              <Lightbulb className="w-4 h-4" />
              <span>Have an Idea? Add It to Prashant's Manifesto</span>
            </Link>
          </div>
        </section>

        {/* Section 3: Meet Prashant Kumar Diwakar & Core Team */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-du-navy bg-du-gold/20 px-3 py-1 rounded-full border border-du-gold/40">
              Student Leadership
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              Meet Team Prashant Diwakar
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm">
              Law Centre-1 student leadership fighting together for campus welfare and students' rights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {team.map((member) => {
              const isLead = member.name.toLowerCase().includes('prashant') || member.isMainLeader;
              return (
                <div
                  key={member.id}
                  className={`bg-white rounded-3xl p-6 text-center space-y-3.5 shadow-md hover:shadow-xl transition relative flex flex-col justify-between ${
                    isLead 
                      ? 'border-2 border-du-gold ring-2 ring-du-gold/30 bg-gradient-to-b from-amber-50/40 via-white to-white' 
                      : 'border border-slate-200'
                  }`}
                >
                  {isLead && (
                    <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-du-navy via-slate-900 to-du-navy text-du-gold px-3.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow border border-du-gold/50 flex items-center gap-1 whitespace-nowrap">
                      <Crown className="w-3 h-3 text-du-gold" />
                      <span>Main Leader & Candidate</span>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className={`w-20 h-20 rounded-full overflow-hidden flex items-center justify-center mx-auto shadow-md border-2 ${
                      isLead 
                        ? 'border-du-gold ring-4 ring-du-gold/30 bg-slate-900' 
                        : 'bg-gradient-to-br from-du-navy to-slate-900 border-du-gold/40 text-du-gold font-bold text-xl'
                    }`}>
                      {isLead ? (
                        <img 
                          src="/images/prashant-speaking-bg.jpg" 
                          alt="Prashant Kumar Diwakar" 
                          className="w-full h-full object-cover object-top"
                        />
                      ) : (
                        member.avatar || member.name.substring(0, 2).toUpperCase()
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{member.name}</h3>
                      <p className="text-xs font-bold text-du-navy mt-0.5">{member.role}</p>
                      <span className="inline-block mt-1 text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                        {member.year}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-2.5">
                      {member.bio}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-2 text-xs font-bold text-du-navy">
                    <Phone className="w-4 h-4 text-du-gold" />
                    <a href={`tel:${member.phone}`} className="hover:underline tracking-wide">{member.phone}</a>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 4: Instagram & Direct Connect Banner */}
        <section className="bg-gradient-to-r from-pink-700 via-rose-700 to-purple-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Instagram className="w-6 h-6 text-white" />
              <span className="font-bold uppercase tracking-wider text-xs bg-white/20 px-2.5 py-0.5 rounded-full">
                Connect on Social Media
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-bold">
              Follow Prashant Kumar Diwakar on Instagram
            </h3>
            <p className="text-xs text-pink-100">
              Get daily updates on student townhalls, moot court workshops, and campaign reels.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://instagram.com/prashantkumardiwakar1"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-white text-pink-700 hover:bg-pink-50 shadow transition flex items-center gap-1.5"
            >
              <span>@prashantkumardiwakar1</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href="tel:6206319802"
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-slate-900/40 hover:bg-slate-900/60 text-white border border-white/30 transition flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call: 6206319802</span>
            </a>
          </div>
        </section>

      </div>
    </div>
  );
}
