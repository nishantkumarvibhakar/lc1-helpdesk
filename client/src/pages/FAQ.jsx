import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  PlusCircle, 
  BookOpen, 
  FileText, 
  CreditCard, 
  Library, 
  Building2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';

export function FAQ() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    async function loadFaqs() {
      try {
        const res = await api.getFaqs();
        setFaqs(res.faqs || []);
      } catch (err) {
        console.error('Failed to load FAQs:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFaqs();
  }, []);

  const categories = ['All', 'Examination', 'Academic', 'ID Card / Documents', 'Library', 'Fees', 'Portal/Technical Issue'];

  const filteredFaqs = faqs.filter(f => {
    const matchesCat = activeCategory === 'All' || f.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch = searchQuery === '' ||
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-du-navy bg-du-gold/20 px-3 py-1 rounded-full border border-du-gold/40">
          Instant Help & Guidance
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
          Frequently Asked Questions
        </h1>
        <p className="text-slate-600 text-sm">
          Find instant answers to common Law Centre-1 administrative, academic, examination, and library inquiries.
        </p>
      </div>

      {/* Search & Category Filter */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-md space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search FAQs (e.g. attendance, migration, exam fee, SCC online)..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 text-sm focus:ring-2 focus:ring-du-gold focus:outline-none shadow-inner"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-du-navy text-du-gold shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FAQs List */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-4 border-du-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      ) : filteredFaqs.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-500">
          No FAQs match your search terms.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openId === (faq.id || idx);
            return (
              <div
                key={faq.id || idx}
                className={`bg-white rounded-2xl border transition overflow-hidden shadow-sm ${
                  isOpen ? 'border-du-gold/80 ring-2 ring-du-gold/20' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : (faq.id || idx))}
                  className="w-full p-5 text-left flex items-start justify-between gap-4 bg-white hover:bg-slate-50/80 transition"
                >
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-du-gold bg-du-navy px-2 py-0.5 rounded">
                      {faq.category}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base pt-1">
                      {faq.question}
                    </h3>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-slate-400 flex-shrink-0 mt-2 transform transition ${isOpen ? 'rotate-180 text-du-gold' : ''}`} />
                </button>

                {isOpen && (
                  <div className="p-5 bg-slate-50 text-slate-700 text-xs sm:text-sm leading-relaxed border-t border-slate-100">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Still need help banner */}
      <div className="bg-gradient-to-r from-du-navy via-slate-900 to-du-dark text-white rounded-3xl p-6 sm:p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4 border border-du-gold/30 shadow-lg">
        <div>
          <h3 className="text-lg font-serif font-bold text-white mb-1">
            Didn't find an answer to your problem?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Submit a direct query ticket to Team Prashant Diwakar and our coordinators will assist you personally.
          </p>
        </div>
        <Link
          to="/raise-ticket"
          className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm bg-du-gold hover:bg-du-goldLight text-du-navy shadow transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Raise a Query Ticket</span>
        </Link>
      </div>
    </div>
  );
}
