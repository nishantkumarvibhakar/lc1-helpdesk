import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  PlusCircle, 
  Search, 
  LayoutDashboard, 
  HelpCircle, 
  ShieldCheck, 
  LogOut, 
  Menu, 
  X, 
  User,
  Scale,
  Megaphone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  // Compact nav links for desktop
  const studentNavLinks = [
    { name: 'Home', path: '/', icon: Scale },
    { name: 'Raise Issue', path: '/raise-ticket', icon: PlusCircle, highlight: true },
    { name: 'Campaign Events', path: '/announcements', icon: Megaphone },
    { name: 'Track', path: '/track', icon: Search },
    { name: 'FAQs', path: '/faq', icon: HelpCircle },
  ];

  const adminNavLinks = [
    { name: 'Home', path: '/', icon: Scale },
    { name: 'Admin Command Center', path: '/admin', icon: ShieldCheck, highlight: true },
    { name: 'Campaign Events', path: '/announcements', icon: Megaphone },
    { name: 'FAQs', path: '/faq', icon: HelpCircle },
  ];

  const navLinks = isAdmin ? adminNavLinks : studentNavLinks;

  return (
    <header className="sticky top-0 z-50 bg-du-navy text-white shadow-md border-b border-slate-700/60 w-full overflow-hidden">
      {/* Top micro bar for university & campaign branding */}
      <div className="bg-du-dark/95 px-3 sm:px-6 py-1 text-[11px] text-slate-300 border-b border-slate-800 flex justify-between items-center w-full">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-du-gold flex items-center gap-1">
            <GraduationCap className="w-3.5 h-3.5" />
            Faculty of Law, DU • LC-1
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-du-gold font-medium">
            Vote & Support <strong className="text-white">Prashant Kumar Diwakar</strong> for President
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          
          {/* Left: Logo & Candidate Name */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-du-gold to-amber-600 p-0.5 shadow-md flex items-center justify-center text-du-navy font-bold flex-shrink-0">
              <Scale className="w-5 h-5 text-du-navy" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-black text-base sm:text-lg tracking-tight text-white group-hover:text-du-gold transition whitespace-nowrap">
                PRASHANT DIWAKAR
              </span>
              <span className="text-[10px] text-du-gold font-bold -mt-1 hidden sm:block">
                LC-1 Presidential Candidate
              </span>
            </div>
          </Link>

          {/* Center: Desktop Navigation Items */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);

              if (link.highlight) {
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm transition transform hover:-translate-y-0.5 whitespace-nowrap ${
                      isAdmin
                        ? 'bg-du-gold text-du-navy hover:bg-du-goldLight shadow'
                        : 'bg-gradient-to-r from-amber-500 to-du-gold hover:from-amber-400 hover:to-du-goldLight text-du-navy'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{link.name}</span>
                  </Link>
                );
              }

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition whitespace-nowrap ${
                    active
                      ? 'bg-white/15 text-white font-bold shadow-inner'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-du-gold" />
                  <span>{link.name}</span>
                </Link>
              );
            })}

            {/* If student logged in (not admin), show My Issues link */}
            {user && !isAdmin && (
              <Link
                to="/dashboard"
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition whitespace-nowrap ${
                  isActive('/dashboard')
                    ? 'bg-white/15 text-white font-bold shadow-inner'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-du-gold" />
                <span>My Issues</span>
              </Link>
            )}
          </nav>

          {/* Right: Desktop User Profile & Actions */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-700">
                <div className="bg-white/10 px-2.5 py-1 rounded-xl flex items-center gap-1.5 text-xs text-slate-200 border border-white/10">
                  <User className="w-3.5 h-3.5 text-du-gold flex-shrink-0" />
                  <span className="font-bold text-white max-w-[110px] truncate" title={user.name}>
                    {user.name.split(' ')[0]}
                  </span>
                  <span className="text-[10px] text-du-gold font-mono uppercase bg-du-navy/60 px-1 py-0.5 rounded">
                    {user.role === 'admin' ? 'Admin' : 'LC-1'}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-white/5 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link
                  to="/login"
                  className="px-2.5 py-1.5 text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 rounded-lg transition whitespace-nowrap"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 text-xs font-semibold bg-du-gold hover:bg-du-goldLight text-du-navy rounded-lg transition whitespace-nowrap font-bold"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Menu Button */}
          <div className="flex lg:hidden items-center gap-1">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg focus:outline-none"
              aria-label="Toggle navigation"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="lg:hidden bg-du-navy border-t border-slate-700/80 px-4 pt-2 pb-6 space-y-2">
          {user && (
            <div className="p-3 bg-white/5 rounded-xl mb-2 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white">{user.name}</p>
                <p className="text-xs text-du-gold font-mono">{user.studentId || user.email}</p>
              </div>
              <span className="text-[10px] bg-du-gold/20 text-du-gold font-bold px-2 py-0.5 rounded uppercase">
                {user.role === 'admin' ? 'Admin' : 'Verified LC-1'}
              </span>
            </div>
          )}

          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium ${
                  isActive(link.path)
                    ? 'bg-du-gold text-du-navy font-bold'
                    : 'text-slate-200 hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.name}</span>
              </Link>
            );
          })}

          {user && !isAdmin && (
            <Link
              to="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-200 hover:bg-white/5"
            >
              <LayoutDashboard className="w-4 h-4 text-du-gold" />
              <span>My Issues</span>
            </Link>
          )}

          <div className="pt-3 border-t border-slate-700/80 flex flex-col gap-2">
            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full px-4 py-2 text-xs font-medium text-rose-300 bg-rose-950/40 hover:bg-rose-950/80 rounded-lg border border-rose-900/50"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="text-center px-4 py-2 text-xs font-semibold text-white bg-du-gold/20 hover:bg-du-gold/30 rounded-lg border border-du-gold/40"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="text-center px-4 py-2 text-xs font-semibold text-du-navy bg-du-gold hover:bg-du-goldLight rounded-lg font-bold"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
