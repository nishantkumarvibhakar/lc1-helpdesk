import React, { useState, useEffect } from 'react';
import { X, Phone, Instagram, ArrowRight, ExternalLink } from 'lucide-react';

export function WelcomePosterModal({ isOpen, onClose }) {
  const [visible, setVisible] = useState(false);
  const [posterImage, setPosterImage] = useState('/images/prashant-diwakar-poster.jpg');

  useEffect(() => {
    const savedPoster = localStorage.getItem('lc1_campaign_poster_image');
    if (savedPoster) {
      setPosterImage(savedPoster);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    if (visible) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visible]);

  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  if (!visible) return null;

  return (
    <div 
      className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn"
      onClick={handleClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="relative max-w-md w-full my-auto flex flex-col items-center bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-700/30 transform transition-all animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button (Top-Right) */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-20 p-2.5 rounded-full bg-slate-900/80 hover:bg-red-600 text-white shadow-xl transition transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Close poster"
          title="Close (Esc)"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Poster Image */}
        <div className="relative w-full overflow-hidden bg-slate-900">
          <img
            src={posterImage}
            alt="Team Prashant Diwakar for LC1 - Official Campaign Poster"
            className="w-full h-auto max-h-[72vh] sm:max-h-[75vh] object-contain mx-auto block select-none"
            loading="eager"
          />
        </div>

        {/* Bottom Quick Contact & Action Bar */}
        <div className="w-full bg-gradient-to-r from-du-navy via-slate-900 to-du-navy text-white p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-du-gold/30">
          {/* Quick Contact Info */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-start">
            <a
              href="tel:6206319802"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-du-gold hover:bg-du-goldLight text-du-navy font-bold text-xs shadow transition"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call: 6206319802</span>
            </a>

            <a
              href="https://instagram.com/prashantkumardiwakar1"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-600/30 hover:bg-pink-600 text-pink-200 hover:text-white border border-pink-500/40 text-xs font-semibold transition"
            >
              <Instagram className="w-3.5 h-3.5 text-pink-400" />
              <span className="hidden xs:inline">Instagram</span>
            </a>
          </div>

          {/* Dismiss button */}
          <button
            onClick={handleClose}
            className="w-full sm:w-auto px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold transition flex items-center justify-center gap-1 border border-white/10"
          >
            <span>Continue to Help Desk</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
