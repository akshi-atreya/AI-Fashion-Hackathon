import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-noir-950 text-white border-t border-white/10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-luxe-gold text-noir-950 font-bold text-xs flex items-center justify-center">
                SL
              </div>
              <span className="font-serif tracking-widest text-base font-bold text-white">
                STYLELENS
              </span>
            </div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-luxe-gold font-medium">
              AI Fashion Discovery & Virtual Try-On
            </p>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              Helping fashion lovers discover clothing tailored to their budget tier and preview how garments drape on their silhouette before purchasing.
            </p>
          </div>

          {/* Quick Flow Links (3 cols) */}
          <div className="lg:col-span-3 space-y-2">
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-semibold mb-3">
              Application Flow
            </h4>
            <ul className="space-y-2 text-xs text-neutral-300">
              <li>
                <Link to="/" className="hover:text-luxe-gold transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/quiz" className="hover:text-luxe-gold transition-colors">
                  Style Quiz
                </Link>
              </li>
              <li>
                <Link to="/upload" className="hover:text-luxe-gold transition-colors">
                  Photo Studio & Camera
                </Link>
              </li>
              <li>
                <Link to="/recommendations" className="hover:text-luxe-gold transition-colors">
                  Recommendations
                </Link>
              </li>
              <li>
                <Link to="/trends" className="hover:text-luxe-gold transition-colors">
                  Vogue Trends
                </Link>
              </li>
              <li>
                <Link to="/checklist" className="hover:text-luxe-gold transition-colors flex items-center gap-1.5 text-luxe-gold font-medium">
                  <span>AI Stylist Checklist & Spec</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-luxe-gold/20 text-luxe-gold">v1.0</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Budget Retailer Partners (4 cols) */}
          <div className="lg:col-span-4 space-y-2">
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-semibold mb-3">
              Retailer Mapping
            </h4>
            <ul className="space-y-2 text-xs text-neutral-300">
              <li className="flex items-center justify-between">
                <span>Low Budget:</span>
                <a
                  href="https://www.zara.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-luxe-gold flex items-center gap-1"
                >
                  <span>Zara</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li className="flex items-center justify-between">
                <span>Medium Budget:</span>
                <a
                  href="https://www.calvinklein.us"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-luxe-gold flex items-center gap-1"
                >
                  <span>Calvin Klein</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li className="flex items-center justify-between">
                <span>High Budget:</span>
                <a
                  href="https://www.michaelkors.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-luxe-gold flex items-center gap-1"
                >
                  <span>Michael Kors (MKors)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li className="flex items-center justify-between pt-1">
                <span>Trends Source:</span>
                <a
                  href="https://www.vogue.com/fashion"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-luxe-gold hover:underline flex items-center gap-1"
                >
                  <span>Vogue Fashion</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] uppercase tracking-[0.2em] text-neutral-500">
          <p>© 2026 STYLELENS · ZARA · CALVIN KLEIN · MICHAEL KORS · VOGUE EDITORIAL INTEGRATION</p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
