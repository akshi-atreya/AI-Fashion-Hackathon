import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Camera, Sliders, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { fetchTrends } from '../services/api';
import { Trend } from '../types/stylelens';

export const LandingPage: React.FC = () => {
  const [trends, setTrends] = useState<Trend[]>([]);

  useEffect(() => {
    fetchTrends().then(setTrends);
  }, []);

  const retailers = [
    {
      name: 'Zara',
      tier: 'Low Budget',
      priceRange: '$25 – $99',
      tagline: 'High-street silhouettes, trend-forward seasonal drops & contemporary everyday wear.',
      imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80',
      badge: 'Smart Fashion on a Budget'
    },
    {
      name: 'Calvin Klein',
      tier: 'Medium Budget',
      priceRange: '$60 – $220',
      tagline: 'Iconic 90s denim cuts, sculpted modern knits & understated minimalist luxury.',
      imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80',
      badge: 'Modern American Minimalism'
    },
    {
      name: 'Michael Kors (MKors)',
      tier: 'High Budget',
      priceRange: '$250 – $950',
      tagline: 'Tailored double-face wool coats, silk georgette evening gowns & American luxury glamour.',
      imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80',
      badge: 'Heritage Luxury & Precision'
    }
  ];

  const steps = [
    {
      step: '01',
      title: 'Style Quiz',
      desc: 'Select your budget tier, fashion aesthetic (streetwear, formal, casual), size, and occasion.',
      icon: Sliders
    },
    {
      step: '02',
      title: 'Voyage Video & Silhouette',
      desc: 'Snap a live model frame via Voyage/Vonage Video API or calibrate your studio silhouette.',
      icon: Camera
    },
    {
      step: '03',
      title: 'Budget-Mapped Catalog',
      desc: 'Instantly view curated products from Zara, Calvin Klein, or Michael Kors matched to your intake.',
      icon: ShoppingBag
    },
    {
      step: '04',
      title: 'Runway Model Try-On',
      desc: 'See yourself presented as a fashion model and switch between different outfits in real time.',
      icon: Sparkles
    }
  ];

  return (
    <div className="min-h-screen bg-noir-950 text-white">
      {/* Hero Section */}
      <section className="relative w-full pt-16 pb-28 sm:pt-24 sm:pb-36 overflow-hidden border-b border-white/10">
        {/* Ambient Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-luxe-gold/10 via-white/5 to-transparent blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-luxe-gold/40 bg-noir-900/80 backdrop-blur-md text-xs uppercase tracking-[0.25em] text-luxe-gold mb-8 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-luxe-gold" />
            <span>AI Fashion Discovery & Virtual Try-On</span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal tracking-wide text-white uppercase leading-tight mb-6 max-w-4xl mx-auto">
            Discover Your Style. <br />
            <span className="text-gradient-gold font-semibold">Try Before You Buy.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-neutral-300 tracking-[0.15em] uppercase max-w-2xl mx-auto mb-10 leading-relaxed">
            StyleLens matches your aesthetic & budget to curated pieces from <span className="text-white font-semibold">Zara</span>, <span className="text-white font-semibold">Calvin Klein</span>, and <span className="text-white font-semibold">Michael Kors</span>, composited directly onto your photo.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/quiz"
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-luxe-champagne text-noir-950 text-xs font-bold uppercase tracking-[0.25em] transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(212,175,55,0.5)]"
            >
              <span>Start Style Quiz</span>
              <ArrowRight className="w-4 h-4 text-noir-950" />
            </Link>

            <Link
              to="/upload"
              className="w-full sm:w-auto px-8 py-4 bg-noir-900/80 hover:bg-noir-800 text-white border border-white/20 hover:border-luxe-gold text-xs font-medium uppercase tracking-[0.25em] transition-all flex items-center justify-center gap-2"
            >
              <Camera className="w-4 h-4 text-luxe-gold" />
              <span>Upload / Camera</span>
            </Link>
          </div>

          {/* Features checkmark bar */}
          <div className="mt-14 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs tracking-wider text-neutral-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-luxe-gold" />
              <span>Budget Mapping (Zara · CK · Michael Kors)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-luxe-gold" />
              <span>Live Camera Frame Capture</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-luxe-gold" />
              <span>Gemini Virtual Try-On</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-luxe-gold" />
              <span>Vogue Runway Trends</span>
            </div>
          </div>
        </div>
      </section>

      {/* Retailer Budget Tiers Section */}
      <section className="py-24 bg-noir-900/40 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] uppercase tracking-[0.3em] text-luxe-gold block mb-2 font-semibold">
              Curated Retailer Tiers
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-white uppercase font-normal">
              Tailored to Your Budget
            </h2>
            <p className="text-xs text-neutral-400 tracking-wider uppercase mt-2">
              We connect your style directly with authentic catalogs from international fashion houses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {retailers.map((ret, idx) => (
              <div
                key={idx}
                className="glass-panel p-6 border border-white/10 hover:border-luxe-gold/50 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="aspect-[4/3] w-full overflow-hidden rounded mb-5 bg-noir-800 relative">
                    <img
                      src={ret.imageUrl}
                      alt={ret.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 text-[9px] uppercase tracking-widest text-luxe-gold font-semibold border border-white/10">
                      {ret.tier}
                    </div>
                    <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1 text-[9px] tracking-wider text-white font-mono">
                      {ret.priceRange}
                    </div>
                  </div>

                  <span className="text-[10px] uppercase tracking-widest text-neutral-400 block mb-1">
                    {ret.badge}
                  </span>
                  <h3 className="font-serif text-2xl text-white font-medium mb-2">{ret.name}</h3>
                  <p className="text-xs text-neutral-300 leading-relaxed mb-6">
                    {ret.tagline}
                  </p>
                </div>

                <Link
                  to="/quiz"
                  className="w-full py-3 text-[10px] uppercase tracking-widest border border-white/20 hover:border-luxe-gold text-center text-white hover:text-luxe-gold bg-noir-900 transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Select {ret.name} in Quiz</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works (The 4-Step Flow) */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] uppercase tracking-[0.3em] text-luxe-gold block mb-2 font-semibold">
            Simple 4-Step Workflow
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-white uppercase font-normal">
            How StyleLens Works
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((st, i) => {
            const Icon = st.icon;
            return (
              <div
                key={i}
                className="p-6 bg-noir-900 border border-white/10 hover:border-white/20 rounded transition-all"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-xs text-luxe-gold font-bold">{st.step}</span>
                  <div className="w-10 h-10 rounded-full bg-noir-800 border border-white/10 flex items-center justify-center text-luxe-gold">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="font-serif text-lg text-white mb-2">{st.title}</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">{st.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Vogue Fashion Trends Preview */}
      {trends.length > 0 && (
        <section className="py-20 bg-noir-900/50 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-luxe-gold block mb-1">
                  Trending Now
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-white uppercase">
                  Vogue Fashion Dispatches
                </h2>
              </div>
              <Link
                to="/trends"
                className="text-xs uppercase tracking-widest text-neutral-300 hover:text-luxe-gold flex items-center gap-1.5 underline"
              >
                <span>View Full Trends Feed</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {trends.slice(0, 3).map((trend) => (
                <div
                  key={trend.id}
                  className="glass-panel p-4 border border-white/10 flex flex-col justify-between"
                >
                  <img
                    src={trend.imageUrl}
                    alt={trend.title}
                    className="aspect-video w-full object-cover rounded mb-4"
                  />
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-luxe-gold">{trend.category}</span>
                    <h3 className="font-serif text-sm text-white font-medium line-clamp-2 mt-1 mb-2">
                      {trend.title}
                    </h3>
                    <p className="text-[11px] text-neutral-400 line-clamp-2">{trend.summary}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/5 text-[10px] text-neutral-400 italic">
                    💡 {trend.geminiTakeaway}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* AI Stylist AI Input Checklist Highlight Section */}
      <section className="py-20 border-b border-white/10 bg-gradient-to-b from-noir-900/60 to-noir-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-panel p-8 sm:p-12 border border-luxe-gold/30 rounded-2xl relative overflow-hidden">
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-luxe-gold/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-luxe-gold/15 border border-luxe-gold/30 text-[10px] uppercase tracking-[0.25em] text-luxe-gold font-bold">
                <span>Data Specification & Governance</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-4xl text-white uppercase font-normal leading-snug">
                Built on the <span className="text-luxe-gold">AI Stylist AI Input Checklist</span>
              </h2>

              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                StyleLens strictly follows a comprehensive 10-section intake and data specification for personalized shopping and virtual try-on. We prioritize hard budget boundaries, ground all recommendations in attributable retailer facts, enforce strict non-inference safeguards, and give users total control over their data.
              </p>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Link
                  to="/checklist"
                  className="px-6 py-3 bg-luxe-gold hover:bg-luxe-champagne text-noir-950 text-xs font-bold uppercase tracking-widest rounded flex items-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all"
                >
                  <span>Explore 10-Section Checklist & Schema</span>
                  <ArrowRight className="w-4 h-4 text-noir-950" />
                </Link>

                <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-neutral-400">
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                  <span>Aligned with NIST AI RMF 1.0 · EU GDPR · FTC Guidelines</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
