import React, { useEffect, useState } from 'react';
import { ExternalLink, Sparkles, TrendingUp, Filter, ArrowUpRight } from 'lucide-react';
import { fetchTrends } from '../services/api';
import { Trend } from '../types/stylelens';

export const TrendsPage: React.FC = () => {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    setLoading(true);
    fetchTrends()
      .then(setTrends)
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', 'Runway', 'Trends', 'Culture', 'Celebrity'];

  const filtered =
    activeCategory === 'All'
      ? trends
      : trends.filter((t) => t.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="min-h-screen bg-noir-950 text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-8 border-b border-white/10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-noir-900 text-[10px] uppercase tracking-[0.25em] text-luxe-gold mb-3">
              <TrendingUp className="w-3 h-3 text-luxe-gold" />
              <span>Trending Now · Sourced from Vogue</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl tracking-wide uppercase text-white font-normal">
              Fashion Trends & News
            </h1>
            <p className="text-xs text-neutral-400 tracking-wider uppercase mt-2">
              Curated editorial dispatches summarized with Gemini AI style takeaways.
            </p>
          </div>

          <a
            href="https://www.vogue.com/fashion"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 border border-white/15 hover:border-luxe-gold text-xs uppercase tracking-wider text-neutral-300 hover:text-white bg-noir-900 rounded transition-colors self-start md:self-auto"
          >
            <span>Visit Vogue.com/Fashion</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
          <span className="text-[10px] uppercase tracking-widest text-neutral-500 mr-2 shrink-0 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            <span>Filter:</span>
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded text-[10px] uppercase tracking-wider transition-all shrink-0 border ${
                activeCategory === cat
                  ? 'border-luxe-gold bg-luxe-gold/15 text-white font-medium'
                  : 'border-white/10 bg-noir-900 text-neutral-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-8 h-8 border-2 border-luxe-gold border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs uppercase tracking-widest text-neutral-400">
              Retrieving live Vogue editorial trends...
            </p>
          </div>
        ) : (
          /* Trends Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((trend) => (
              <article
                key={trend.id}
                className="glass-panel rounded-lg overflow-hidden border border-white/10 hover:border-luxe-gold/40 transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Thumbnail */}
                <div className="relative aspect-[16/10] overflow-hidden bg-noir-900">
                  <img
                    src={trend.imageUrl}
                    alt={trend.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded text-[9px] uppercase tracking-widest text-white font-semibold border border-white/10">
                    {trend.category}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[9px] text-neutral-400">
                    {trend.publishedAt}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h2 className="font-serif text-base sm:text-lg text-white group-hover:text-luxe-champagne transition-colors leading-snug mb-2">
                      {trend.title}
                    </h2>
                    <p className="text-xs text-neutral-400 leading-relaxed line-clamp-3">
                      {trend.summary}
                    </p>
                  </div>

                  {/* Gemini AI Style Takeaway */}
                  <div className="p-3 bg-noir-900/80 border border-luxe-gold/20 rounded text-xs text-neutral-300 space-y-1">
                    <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-luxe-gold font-semibold">
                      <Sparkles className="w-3 h-3 text-luxe-gold" />
                      <span>Gemini Style Tip</span>
                    </div>
                    <p className="italic text-[11px] leading-relaxed">
                      "{trend.geminiTakeaway}"
                    </p>
                  </div>

                  {/* External Read Link */}
                  <div className="pt-3 border-t border-white/10">
                    <a
                      href={trend.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 text-[10px] uppercase tracking-widest border border-white/20 hover:border-luxe-gold rounded text-neutral-300 hover:text-white bg-noir-900 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Read on Vogue.com</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
