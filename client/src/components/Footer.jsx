import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, Heart, Phone, Mail, MapPin, ExternalLink, Instagram, Sparkles, Lightbulb, HeartHandshake, Megaphone } from 'lucide-react';

export function Footer({ onOpenPoster }) {
  return (
    <footer className="bg-slate-950 text-slate-400 text-sm border-t border-slate-900 shadow-2xl relative z-10">
      {/* Top Footer Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 py-8 px-4 sm:px-6 lg:px-8 border-b border-slate-900/90">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-du-gold flex items-center justify-center text-du-navy font-bold shadow-lg">
              <Scale className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-white font-serif font-bold text-lg">Team Prashant Diwakar for LC-1</h3>
              <p className="text-xs text-du-gold font-medium">स्टूडेंट सपोर्ट की नई शुरुआत • प्रशांत और आपका साथ</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {onOpenPoster && (
              <button
                type="button"
                onClick={onOpenPoster}
                className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-semibold text-xs transition flex items-center gap-1.5 shadow-sm"
              >
                <span>📜 View Campaign Poster</span>
              </button>
            )}
            <Link
              to="/raise-ticket?type=Manifesto+Suggestion"
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition border border-white/10 flex items-center gap-1.5"
            >
              <Lightbulb className="w-3.5 h-3.5 text-du-gold" />
              <span>Give Manifesto Idea</span>
            </Link>
            <Link
              to="/raise-ticket?type=Volunteer+Application"
              className="px-4 py-2 rounded-xl bg-du-gold hover:bg-du-goldLight text-du-navy font-bold text-xs transition shadow flex items-center gap-1.5"
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Join Campaign Team</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-slate-950">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Col 1: Candidate Vision */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider text-du-gold">Campaign Vision</h4>
            <p className="text-xs leading-relaxed text-slate-400">
              Prashant Kumar Diwakar is contesting for President, Law Centre-1. Dedicated to fearless student advocacy, clean campus infrastructure, library reforms, and transparent student council representation.
            </p>
            <div className="pt-2 text-xs text-slate-400 flex items-center gap-1">
              <span>Organized by</span>
              <strong className="text-white">Team Prashant Diwakar for LC-1</strong>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline ml-0.5" />
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider text-du-gold">Quick Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition">Home Portal</Link></li>
              <li><Link to="/raise-ticket?type=Issue" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition">🚨 Raise Campus Issues</Link></li>
              <li><Link to="/raise-ticket?type=Manifesto+Suggestion" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition">💡 Submit Manifesto Idea</Link></li>
              <li><Link to="/raise-ticket?type=Volunteer+Application" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition">🤝 Join Campaign Team (Volunteer)</Link></li>
              <li><Link to="/announcements" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition">📢 Campaign Events & Schedule</Link></li>
              <li><Link to="/track" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition">Track Status</Link></li>
              <li><Link to="/faq" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition">Campaign FAQs</Link></li>
            </ul>
          </div>

          {/* Col 3: Contact & Campaign Socials */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider text-du-gold">Campaign Helpline</h4>
            <div className="space-y-2 text-xs">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-du-gold flex-shrink-0 mt-0.5" />
                <span>Faculty of Law, Chhatra Marg, North Campus, University of Delhi, Delhi - 110007</span>
              </p>
              <p className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-du-gold flex-shrink-0" />
                <span>Team Prashant Diwakar • 24/7 Student Support</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-du-gold flex-shrink-0" />
                <span>prashant@lc1helpdesk.in</span>
              </p>
              <div className="pt-2 flex flex-col gap-1.5">
                <a 
                  href="https://instagram.com/prashantkumardiwakar1" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center gap-1.5 text-xs text-pink-400 hover:text-pink-300"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>Instagram: @prashantkumardiwakar1</span>
                </a>
                <a 
                  href="https://instagram.com/prashant_diwakar_for_lc1" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center gap-1.5 text-xs text-pink-400 hover:text-pink-300"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>Instagram: @prashant_diwakar_for_lc1</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Team Prashant Kumar Diwakar for LC-1 President. All Rights Reserved.</p>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span>Vote for Change</span>
            <span>•</span>
            <span>Law Centre-1, University of Delhi</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
