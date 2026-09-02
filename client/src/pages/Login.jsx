import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  ArrowRight,
  Scale,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [activeTab, setActiveTab] = useState('admin'); // 'student' | 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setError('');
    setEmail('');
    setPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Invalid username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-du-navy text-du-gold flex items-center justify-center mx-auto shadow-md border border-du-gold/30">
          <Scale className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
          Sign In to LC1 Help Desk
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm">
          Access your student issue dashboard or team portal.
        </p>
      </div>

      {/* Login Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl space-y-6">
        
        {/* Role Tab Switcher */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-2xl">
          <button
            type="button"
            onClick={() => handleTabSwitch('student')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'student'
                ? 'bg-white text-du-navy shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-du-navy" />
            <span>Student Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabSwitch('admin')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'admin'
                ? 'bg-du-navy text-du-gold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-du-gold" />
            <span>Admin / Team Login</span>
          </button>
        </div>

        {/* Informational Guidance */}
        {activeTab === 'admin' ? (
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-3.5 text-xs text-amber-900 space-y-1">
            <div className="font-bold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Team Prashant Diwakar Admin Portal</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Login to manage issues, assign coordinators, publish events, edit FAQs & team members.
            </p>
          </div>
        ) : (
          <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-3.5 text-xs text-blue-900 space-y-1">
            <div className="font-bold flex items-center gap-1">
              <GraduationCap className="w-4 h-4 text-blue-600" />
              <span>Law Centre-1 Student Portal</span>
            </div>
            <p className="text-[11px] text-blue-800 leading-relaxed">
              Login using your registered DU email to view personal tickets and post updates.
            </p>
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {activeTab === 'admin' ? 'Admin Username or Email' : 'Registered Student Email'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={activeTab === 'admin' ? "Admin Username or Email" : "Registered Student Email"}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-du-gold focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=""
                className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-du-gold focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-du-gold hover:from-amber-400 hover:to-du-goldLight text-du-navy shadow-md transition transform hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>{activeTab === 'admin' ? 'Sign In to Admin Portal' : 'Sign In to Student Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500 space-y-3">
          {activeTab === 'student' ? (
            <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3 text-center space-y-2 shadow-sm">
              <p className="text-slate-800 font-semibold text-xs">New to LC-1 Help Desk?</p>
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-du-navy hover:bg-slate-900 text-du-gold shadow transition transform hover:-translate-y-0.5"
              >
                <span>Sign Up as New User</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <p className="text-slate-400">
              Authorized Team Prashant Diwakar representatives only.
            </p>
          )}
          <p>
            Or track an existing ticket directly:{' '}
            <Link to="/track" className="font-semibold text-du-navy hover:underline">
              Track Ticket Status
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
